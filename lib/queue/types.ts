/**
 * Job Payload Types
 *
 * TypeScript interfaces for BullMQ job data and outbox event types.
 * Shared between producers (Next.js app via outbox) and consumers (workers).
 */

// ============================================
// OUTBOX EVENT TYPES
// ============================================

export type OutboxEventType = "WELCOME_EMAIL" | "START_ANALYSIS";

// ============================================
// JOB PAYLOADS
// ============================================

export interface WelcomeEmailJobData {
    userId: string;
    email: string;
    name: string;
}

export interface AnalysisJobData {
    analysisJobId: string;
    userId: string;
    socialAccountId: string;
    /** n8n payload WITHOUT secrets (apify_key injected by worker at dispatch time) */
    n8nPayload: Record<string, unknown>;
    isCompetitorAnalysis: boolean;
}
