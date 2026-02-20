/**
 * POST /api/referral/track
 *
 * Called from the client when a ?ref=<code> query param is detected.
 * Stores the referrer on the current authenticated user's record.
 *
 * Guards:
 *  - User must be authenticated
 *  - No-op if referral already set (first-write-wins)
 *  - No-op if the ref code doesn't match any user
 *  - Prevents self-referral
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const LOG = "[Referral Track]";

export async function POST(req: NextRequest) {
    console.log(`${LOG} request received`);
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            console.warn(`${LOG} unauthorized — no session`);
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.log(`${LOG} authenticated userId=${session.user.id} email=${session.user.email}`);

        const body = await req.json();
        const { ref } = body;
        console.log(`${LOG} received ref="${ref}" (type=${typeof ref})`);

        if (!ref || typeof ref !== "string") {
            console.warn(`${LOG} invalid ref value, returning 400`);
            return NextResponse.json({ error: "Missing ref code" }, { status: 400 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true, referredById: true },
        });

        if (!currentUser) {
            console.error(`${LOG} user not found in DB for id=${session.user.id}`);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log(`${LOG} currentUser.referredById=${currentUser.referredById ?? "(none)"}`);

        // Already has a referrer — first-write-wins, do nothing
        if (currentUser.referredById) {
            console.log(`${LOG} user already has referredById=${currentUser.referredById} — skipping (first-write-wins)`);
            return NextResponse.json({ status: "already_set" });
        }

        // Find the referrer by their code
        const trimmedRef = ref.trim();
        console.log(`${LOG} looking up referral code="${trimmedRef}" in DB`);
        const referrer = await prisma.user.findUnique({
            where: { referralCode: trimmedRef },
            select: { id: true },
        });

        if (!referrer) {
            console.warn(`${LOG} no user found with referralCode="${trimmedRef}"`);
            return NextResponse.json({ status: "code_not_found" });
        }
        console.log(`${LOG} referrer found: referrerId=${referrer.id}`);

        // Prevent self-referral
        if (referrer.id === currentUser.id) {
            console.warn(`${LOG} self-referral blocked: userId=${currentUser.id} tried to use their own code`);
            return NextResponse.json({ status: "self_referral_blocked" });
        }

        console.log(`${LOG} writing referredById=${referrer.id} on userId=${currentUser.id}`);
        await prisma.user.update({
            where: { id: currentUser.id },
            data: { referredById: referrer.id },
        });

        console.log(`${LOG} ✅ success — userId=${currentUser.id} is now referred by referrerId=${referrer.id} (code="${trimmedRef}")`);
        return NextResponse.json({ status: "ok" });
    } catch (error: any) {
        console.error(`${LOG} unhandled error:`, error);
        return NextResponse.json(
            { error: error.message || "Failed to track referral" },
            { status: 500 }
        );
    }
}
