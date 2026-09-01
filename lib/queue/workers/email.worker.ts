/**
 * Email Worker
 *
 * Processes email jobs from the BullMQ "email" queue.
 * Currently handles: welcome emails (send-welcome).
 *
 * Idempotency:
 * - BullMQ jobId "welcome-email:{userId}" prevents duplicate enqueues
 * - User.welcomeEmailSentAt prevents duplicate sends (survives Redis flush)
 */

import { Job } from "bullmq";
import { prisma } from "../../prisma";
import { sendWelcomeEmail } from "../../email/resend";
import type { WelcomeEmailJobData } from "../types";

export async function emailProcessor(job: Job<WelcomeEmailJobData>): Promise<void> {
    const { userId, email, name } = job.data;

    console.log(`[EmailWorker] Processing ${job.name} for ${email} (jobId: ${job.id})`);

    // ── Idempotency guard ──────────────────────────────────────
    // Check DB flag to prevent re-sending if this job is retried
    // after a successful send (e.g., worker crashed between send
    // and BullMQ ack, or Redis was flushed and relay re-enqueued).
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { welcomeEmailSentAt: true },
    });

    if (!user) {
        console.warn(`[EmailWorker] User ${userId} not found, skipping`);
        return;
    }

    if (user.welcomeEmailSentAt) {
        console.log(`[EmailWorker] Welcome email already sent to ${email} at ${user.welcomeEmailSentAt}, skipping`);
        return;
    }

    // ── Send email ─────────────────────────────────────────────
    const result = await sendWelcomeEmail(email, name);

    if (!result.success) {
        throw new Error(`Failed to send welcome email to ${email}: ${JSON.stringify(result.error)}`);
    }

    // ── Mark as sent ───────────────────────────────────────────
    await prisma.user.update({
        where: { id: userId },
        data: { welcomeEmailSentAt: new Date() },
    });

    console.log(`[EmailWorker] ✅ Welcome email sent to ${email}`);
}
