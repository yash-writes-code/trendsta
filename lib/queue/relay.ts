/**
 * Outbox Relay
 *
 * Polls the outbox_event table for unprocessed events and enqueues them
 * to the appropriate BullMQ queue. This is the bridge between the
 * transactional outbox (PostgreSQL) and the job queue (Redis).
 *
 * Guarantees:
 * - At-least-once delivery: if the relay crashes after enqueue but before
 *   marking processed, the event will be re-enqueued on the next cycle.
 *   BullMQ's jobId deduplication prevents double-processing.
 * - Ordered processing: events are processed oldest-first within each poll.
 *
 * The relay runs on a configurable interval (default: 2 seconds).
 */

import { prisma } from "../prisma";
import { emailQueue, analysisQueue } from "./queues";
import type { OutboxEventType, WelcomeEmailJobData, AnalysisJobData } from "./types";

const CLEANUP_EVERY_N_TICKS = 1000; // ~33 minutes at 2s interval
const CLEANUP_AGE_DAYS = 7;
const BATCH_SIZE = 50;

export class OutboxRelay {
    private intervalId: NodeJS.Timeout | null = null;
    private isProcessing = false;
    private tickCount = 0;

    /**
     * Start polling the outbox table.
     * @param intervalMs - How often to poll (default: 2000ms)
     */
    start(intervalMs: number = 2000): void {
        console.log(`[OutboxRelay] Starting relay, polling every ${intervalMs}ms`);
        // Run immediately on start, then on interval
        this.tick();
        this.intervalId = setInterval(() => this.tick(), intervalMs);
    }

    /**
     * Stop polling. Safe to call multiple times.
     */
    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        console.log("[OutboxRelay] Stopped");
    }

    private async tick(): Promise<void> {
        // Guard against overlapping ticks (if a previous tick is slow)
        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            await this.processOutbox();

            // Periodic cleanup of old processed events
            this.tickCount++;
            if (this.tickCount % CLEANUP_EVERY_N_TICKS === 0) {
                await this.cleanup();
            }
        } catch (error) {
            console.error("[OutboxRelay] Error during tick:", error);
        } finally {
            this.isProcessing = false;
        }
    }

    private async processOutbox(): Promise<void> {
        const events = await prisma.outboxEvent.findMany({
            where: { processedAt: null },
            orderBy: { createdAt: "asc" },
            take: BATCH_SIZE,
        });

        if (events.length === 0) return;

        console.log(`[OutboxRelay] Processing ${events.length} outbox event(s)`);

        for (const event of events) {
            try {
                await this.enqueueEvent(
                    event.eventType as OutboxEventType,
                    event.payload as Record<string, unknown>
                );

                // Mark as processed only after successful enqueue
                await prisma.outboxEvent.update({
                    where: { id: event.id },
                    data: { processedAt: new Date() },
                });
            } catch (error) {
                // Don't mark as processed — will retry on next tick
                console.error(
                    `[OutboxRelay] Failed to process event ${event.id} (${event.eventType}):`,
                    error
                );
            }
        }
    }

    private async enqueueEvent(
        eventType: OutboxEventType,
        payload: Record<string, unknown>
    ): Promise<void> {
        switch (eventType) {
            case "WELCOME_EMAIL": {
                const data = payload as unknown as WelcomeEmailJobData;
                await emailQueue.add("send-welcome", data, {
                    jobId: `welcome-email-${data.userId}`,
                });
                console.log(`[OutboxRelay] Enqueued welcome email for user ${data.userId}`);
                break;
            }

            case "START_ANALYSIS": {
                const data = payload as unknown as AnalysisJobData;
                await analysisQueue.add("start-analysis", data, {
                    jobId: data.analysisJobId,
                });
                console.log(`[OutboxRelay] Enqueued analysis job ${data.analysisJobId}`);
                break;
            }

            default:
                console.warn(`[OutboxRelay] Unknown event type: ${eventType}`);
        }
    }

    /**
     * Delete processed outbox events older than CLEANUP_AGE_DAYS.
     * Keeps the outbox table lean.
     */
    private async cleanup(): Promise<void> {
        const cutoff = new Date(Date.now() - CLEANUP_AGE_DAYS * 24 * 60 * 60 * 1000);

        try {
            const result = await prisma.outboxEvent.deleteMany({
                where: {
                    processedAt: { not: null, lt: cutoff },
                },
            });

            if (result.count > 0) {
                console.log(`[OutboxRelay] Cleaned up ${result.count} processed outbox event(s)`);
            }
        } catch (error) {
            console.error("[OutboxRelay] Cleanup error:", error);
        }
    }
}
