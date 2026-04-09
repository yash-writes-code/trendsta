import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

/** GET — poll for an existing analysis written directly by n8n */
export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingAnalysis = await prisma.profileAnalysis.findUnique({
        where: { userId: session.user.id },
    });

    if (existingAnalysis) {
        return NextResponse.json({ ready: true, analysis: existingAnalysis.analysis });
    }

    // Not ready yet — caller should keep polling
    return NextResponse.json({ ready: false }, { status: 202 });
}

/**
 * POST — trigger the n8n workflow (fire and forget).
 * If a cached analysis already exists, returns it immediately (200).
 * Otherwise fires the webhook and returns 202 — the client then polls GET.
 * n8n is responsible for writing the result into the profileAnalysis table.
 */
export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { niche: true, subNiche: true, socialAccounts: { select: { username: true } } },
    });

    const instagramUsername = user?.socialAccounts?.[0]?.username;

    if (!user?.niche || !user?.subNiche || !instagramUsername) {
        return NextResponse.json(
            {
                error: "Profile incomplete. Please complete your profile first.",
                needsOnboarding: true,
            },
            { status: 400 }
        );
    }

    // If analysis already exists, return it immediately — no need to re-trigger
    const existingAnalysis = await prisma.profileAnalysis.findUnique({
        where: { userId }
    });

    if (existingAnalysis) {
        return NextResponse.json({ ready: true, analysis: existingAnalysis.analysis });
    }

    const webhookUrl = process.env.N8N_ANALYSE_PROFILE_URL;
    const apiKey = process.env.N8N_API_KEY;
    const apifyKey = process.env.APIFY_API_KEY;

    if (!webhookUrl) {
        console.error("Missing N8N_ANALYSE_PROFILE_URL environment variable");
        return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    // Fire and forget — n8n writes the result to profileAnalysis when done.
    // The client polls GET /api/analyse_my_profile to pick it up.
    fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(apiKey && { 'x-api-key': apiKey })
        },
        body: JSON.stringify({
            client_username: instagramUsername,
            user_reels_to_scrape: 3,
            use_apify_transcript: false,
            apify_key: apifyKey || "",
            userId: userId,
        })
    }).catch((err) => console.error("n8n webhook error:", err));

    return NextResponse.json({ ready: false, triggered: true }, { status: 202 });
}