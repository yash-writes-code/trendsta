/**
 * GET /api/referral
 *
 * Returns the current user's referral code (generating one on-demand if absent),
 * the full shareable link, and a list of commissions earned.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const LOG = "[Referral GET]";

/** Generate a URL-safe slug: first word of name (or email prefix) + 4 random hex chars */
function generateReferralCode(name: string | null, email: string): string {
    const base = (name ?? email)
        .split(/\s+/)[0]            // first word
        .toLowerCase()
        .replace(/[^a-z0-9]/g, ""); // keep only alphanumeric
    const suffix = Math.random().toString(16).slice(2, 6); // 4 hex chars
    const code = `${base}-${suffix}`;
    console.log(`${LOG} generateReferralCode: base="${base}" suffix="${suffix}" → "${code}"`);
    return code;
}

export async function GET() {
    console.log(`${LOG} request received`);
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            console.warn(`${LOG} unauthorized — no session`);
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.log(`${LOG} authenticated userId=${session.user.id} email=${session.user.email}`);

        let user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                referralCode: true,
                _count: {
                    select: {
                        referrals: true,
                    },
                },
                commissions: {
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        referredUserId: true,
                        commissionPct: true,
                        amount: true,
                        currency: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!user) {
            console.error(`${LOG} user not found in DB for id=${session.user.id}`);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log(`${LOG} DB user: referralCode=${user.referralCode ?? "(none)"}, commissions=${user.commissions.length}`);

        // Lazily generate referral code if missing
        if (!user.referralCode) {
            console.log(`${LOG} no referral code on user — generating one...`);
            let code: string;
            let attempts = 0;
            // Retry on rare collision
            do {
                code = generateReferralCode(user.name, user.email);
                const existing = await prisma.user.findUnique({ where: { referralCode: code } });
                if (!existing) {
                    console.log(`${LOG} code "${code}" is unique (attempt ${attempts + 1})`);
                    break;
                }
                console.warn(`${LOG} code "${code}" already taken, retrying (attempt ${attempts + 1})`);
                attempts++;
            } while (attempts < 5);

            console.log(`${LOG} saving referralCode="${code!}" to DB`);
            user = await prisma.user.update({
                where: { id: user.id },
                data: { referralCode: code! },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    referralCode: true,
                    _count: {
                        select: {
                            referrals: true,
                        },
                    },
                    commissions: {
                        orderBy: { createdAt: "desc" },
                        select: {
                            id: true,
                            referredUserId: true,
                            commissionPct: true,
                            amount: true,
                            currency: true,
                            status: true,
                            createdAt: true,
                        },
                    },
                },
            });
            console.log(`${LOG} referralCode saved successfully`);
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "https://trendsta.in";
        // `user` is guaranteed non-null here (null was already handled above), but TypeScript
        // loses that narrowing because `user` was reassigned inside the if-block. Pinning to
        // a const lets the compiler track the type correctly from this point on.
        const resolvedUser = user!;
        const referralLink = `${appUrl}/?ref=${resolvedUser.referralCode}`;

        // Group commissions by currency and sum each group
        const earningsByCurrency: Record<string, number> = {};
        for (const c of resolvedUser.commissions) {
            const cur = c.currency ?? "USD";
            earningsByCurrency[cur] = (earningsByCurrency[cur] ?? 0) + Number(c.amount);
        }
        const earningsSummary = Object.entries(earningsByCurrency).map(([currency, total]) => ({
            currency,
            total: total.toFixed(2),
        }));

        console.log(`${LOG} returning: referralCode="${resolvedUser.referralCode}" link="${referralLink}" commissions=${resolvedUser.commissions.length} earnings=${JSON.stringify(earningsSummary)}`);

        return NextResponse.json({
            referralCode: resolvedUser.referralCode,
            referralLink,
            totalReferrals: resolvedUser._count.referrals,
            earningsByCurrency: earningsSummary,
            commissions: resolvedUser.commissions,
        });
    } catch (error: any) {
        console.error(`${LOG} unhandled error:`, error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch referral data" },
            { status: 500 }
        );
    }
}
