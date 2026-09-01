/**
 * Analysis Worker
 *
 * Processes analysis jobs from the BullMQ "analysis" queue.
 * Dispatches the n8n webhook and manages AnalysisJob lifecycle.
 *
 * Idempotency:
 * - BullMQ jobId = AnalysisJob.id prevents duplicate enqueues
 * - Worker checks AnalysisJob.status before processing (must be PENDING)
 *
 * Failure handling:
 * - On transient failure: BullMQ retries (2 attempts, exponential backoff)
 * - On final failure: handleAnalysisFailure() marks job FAILED and refunds credits
 */

import { Job } from "bullmq";
import { prisma } from "../../prisma";
import axios from "axios";
import type { AnalysisJobData } from "../types";

export async function analysisProcessor(job: Job<AnalysisJobData>): Promise<void> {
    const { analysisJobId, n8nPayload, isCompetitorAnalysis } = job.data;

    console.log(`[AnalysisWorker] Processing analysis ${analysisJobId} (attempt ${job.attemptsMade + 1})`);

    // ── Idempotency guard ──────────────────────────────────────
    const analysisJob = await prisma.analysisJob.findUnique({
        where: { id: analysisJobId },
    });

    if (!analysisJob) {
        console.error(`[AnalysisWorker] AnalysisJob ${analysisJobId} not found in DB, skipping`);
        return; // Don't throw — no point retrying if the record doesn't exist
    }

    if (analysisJob.status !== "PENDING") {
        console.log(
            `[AnalysisWorker] Job ${analysisJobId} is already ${analysisJob.status}, skipping`
        );
        return;
    }

    // ── Transition to PROCESSING ───────────────────────────────
    await prisma.analysisJob.update({
        where: { id: analysisJobId },
        data: { status: "PROCESSING" },
    });

    // ── Determine n8n URL ──────────────────────────────────────
    const n8nUrl = isCompetitorAnalysis
        ? process.env.N8N_WEBHOOK_URL!
        : process.env.N8N_WEBHOOK_URL_BASIC!;

    if (!n8nUrl) {
        // Reset to PENDING so it can be retried after config is fixed
        await prisma.analysisJob.update({
            where: { id: analysisJobId },
            data: { status: "PENDING" },
        });
        throw new Error(
            `Missing N8N webhook URL for ${isCompetitorAnalysis ? "competitor" : "basic"} analysis`
        );
    }

    // ── Inject runtime secrets into payload ────────────────────
    const fullPayload = {
        ...n8nPayload,
        apify_key: process.env.APIFY_API_KEY,
    };

    // ── Dispatch to n8n ────────────────────────────────────────
    try {
        const response = await axios.post(n8nUrl, fullPayload, {
            headers: {
                "Content-Type": "application/json",
                "trendsta-key": process.env.N8N_API_KEY,
            },
        });

        if (response.status !== 200) {
            throw new Error(`n8n returned status ${response.status}`);
        }

        console.log(`[AnalysisWorker] ✅ n8n webhook dispatched for job ${analysisJobId}`);
        // Leave status as PROCESSING — n8n writes results to DB,
        // and the polling endpoint (/api/analysis/[jobId]/status) reconciles.
    } catch (error: unknown) {
        const { isAxiosError } = await import("axios");

        if (isAxiosError(error)) {
            console.error(
                `[AnalysisWorker] n8n call failed for job ${analysisJobId}:`,
                error.code,
                error.response?.status,
                error.response?.data
            );
        } else {
            console.error(`[AnalysisWorker] n8n call failed for job ${analysisJobId}:`, error);
        }

        // Reset to PENDING so retries can pick it up with the idempotency check passing
        await prisma.analysisJob.update({
            where: { id: analysisJobId },
            data: { status: "PENDING" },
        });

        throw error; // Re-throw so BullMQ registers the failure and handles retries
    }
}

/**
 * Called when all retry attempts are exhausted.
 * Marks the job as FAILED and refunds the held credits to the user's wallet.
 */
export async function handleAnalysisFailure(analysisJobId: string): Promise<void> {
    console.log(
        `[AnalysisWorker] All retries exhausted for job ${analysisJobId}, marking FAILED and refunding credits`
    );

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Mark job as FAILED
            await tx.analysisJob.update({
                where: { id: analysisJobId },
                data: {
                    status: "FAILED",
                    errorMessage: "Analysis service unavailable after all retry attempts",
                },
            });

            // 2. Find HELD stella transactions for this job
            const heldTransactions = await tx.stellaTransaction.findMany({
                where: { referenceId: analysisJobId, status: "HELD" },
            });

            // 3. Release each hold and refund wallet
            for (const heldTxn of heldTransactions) {
                await tx.stellaTransaction.update({
                    where: { id: heldTxn.id },
                    data: { status: "RELEASED" },
                });

                const balanceField =
                    heldTxn.bucket === "MONTHLY" ? "monthlyBalance" : "topupBalance";

                await tx.wallet.update({
                    where: { userId: heldTxn.userId },
                    data: { [balanceField]: { increment: Math.abs(heldTxn.amount) } },
                });
            }

            if (heldTransactions.length > 0) {
                console.log(
                    `[AnalysisWorker] Refunded ${heldTransactions.length} held transaction(s) for job ${analysisJobId}`
                );
            }
        });
    } catch (error) {
        console.error(
            `[AnalysisWorker] CRITICAL: Failed to refund credits for job ${analysisJobId}:`,
            error
        );
        // This is a critical error — credits are stuck in HELD state.
        // In production, this should trigger an alert (PagerDuty, Slack, etc.)
    }
}
