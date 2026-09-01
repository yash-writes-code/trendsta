/**
 * Worker Entry Point
 *
 * Starts the outbox relay and BullMQ workers in a single process.
 * Run with: npm run worker (production) or npm run worker:dev (with watch)
 *
 * This process is responsible for:
 * 1. Outbox Relay — polls PostgreSQL for pending events, enqueues to BullMQ
 * 2. Email Worker — consumes from "email" queue, sends transactional emails
 * 3. Analysis Worker — consumes from "analysis" queue, dispatches n8n webhooks
 *
 * Architecture note: All three run in one process for simplicity.
 * Split into separate processes when load demands it:
 *   - npm run worker:relay
 *   - npm run worker:email
 *   - npm run worker:analysis
 */

import "dotenv/config";
import { Worker } from "bullmq";
import { createRedisConnection } from "./connection";
import { OutboxRelay } from "./relay";
import { emailProcessor } from "./workers/email.worker";
import { analysisProcessor, handleAnalysisFailure } from "./workers/analysis.worker";

async function main(): Promise<void> {
    console.log("=".repeat(60));
    console.log("[Worker] Starting Trendsta worker process...");
    console.log("=".repeat(60));

    // ── 1. Start Outbox Relay ──────────────────────────────────
    const relay = new OutboxRelay();
    relay.start(2000); // Poll every 2 seconds

    // ── 2. Start BullMQ Workers ────────────────────────────────
    const emailWorker = new Worker("email", emailProcessor, {
        connection: createRedisConnection(),
        concurrency: 5,
    });

    const analysisWorker = new Worker("analysis", analysisProcessor, {
        connection: createRedisConnection(),
        concurrency: 3,
    });

    // ── 3. Worker Event Handlers ───────────────────────────────

    // Email worker events
    emailWorker.on("completed", (job) => {
        console.log(`[EmailWorker] Job ${job.id} completed successfully`);
    });

    emailWorker.on("failed", (job, error) => {
        console.error(`[EmailWorker] Job ${job?.id} failed: ${error.message}`);
    });

    // Analysis worker events
    analysisWorker.on("completed", (job) => {
        console.log(`[AnalysisWorker] Job ${job.id} completed successfully`);
    });

    analysisWorker.on("failed", async (job, error) => {
        if (!job) return;

        console.error(`[AnalysisWorker] Job ${job.id} failed (attempt ${job.attemptsMade}): ${error.message}`);

        // If all retries exhausted, refund credits
        const maxAttempts = job.opts.attempts ?? 2;
        if (job.attemptsMade >= maxAttempts) {
            console.log(`[AnalysisWorker] All ${maxAttempts} attempts exhausted for job ${job.id}`);
            await handleAnalysisFailure(job.data.analysisJobId);
        }
    });

    // ── 4. Graceful Shutdown ───────────────────────────────────
    let isShuttingDown = false;

    async function shutdown(signal: string): Promise<void> {
        if (isShuttingDown) return;
        isShuttingDown = true;

        console.log(`\n[Worker] Received ${signal}, shutting down gracefully...`);

        relay.stop();

        // Wait for in-progress jobs to finish (up to 30s)
        await Promise.all([
            emailWorker.close(),
            analysisWorker.close(),
        ]);

        console.log("[Worker] Shutdown complete ✅");
        process.exit(0);
    }

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    console.log("[Worker] All systems running ✅");
    console.log("[Worker] - Outbox relay: polling every 2s");
    console.log("[Worker] - Email worker: concurrency 5");
    console.log("[Worker] - Analysis worker: concurrency 3");
    console.log("=".repeat(60));
}

main().catch((error) => {
    console.error("[Worker] Fatal error:", error);
    process.exit(1);
});
