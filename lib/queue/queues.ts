/**
 * BullMQ Queue Definitions
 *
 * Defines the email and analysis queues with their default job options.
 * Imported ONLY by the worker process (Next.js app writes to the outbox table instead).
 */

import { Queue } from "bullmq";
import { createRedisConnection } from "./connection";
import type { WelcomeEmailJobData, AnalysisJobData } from "./types";

// ============================================
// EMAIL QUEUE
// ============================================

export const emailQueue = new Queue<WelcomeEmailJobData>("email", {
    connection: createRedisConnection(),
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 }, // 5s → 10s → 20s
        removeOnComplete: { age: 7 * 86400 },          // Keep completed jobs for 7 days
        removeOnFail: { age: 30 * 86400 },              // Keep failed jobs for 30 days
    },
});

// ============================================
// ANALYSIS QUEUE
// ============================================

export const analysisQueue = new Queue<AnalysisJobData>("analysis", {
    connection: createRedisConnection(),
    defaultJobOptions: {
        attempts: 2,                                      // n8n calls are expensive, limit retries
        backoff: { type: "exponential", delay: 10000 },  // 10s → 20s
        removeOnComplete: { age: 7 * 86400 },
        removeOnFail: { age: 30 * 86400 },
    },
});
