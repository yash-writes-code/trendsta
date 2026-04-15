import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";


export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { instagramUsername, reelsToScrape = 3, force = false } = body;

    if (!instagramUsername) {
        return NextResponse.json(
            { error: "Instagram username is required" },
            { status: 400 }
        );
    }

    // Duplicate check — unless force re-trigger is requested
    if (!force) {
        const existing = await prisma.adminProfileAnalysis.findFirst({
            where: { instagramUsername },
            select: { id: true },
        });

        if (existing) {
            return NextResponse.json({ exists: true }, { status: 200 });
        }
    }
    console.log("Triggering n8n webhook for profile analysis...");
    const webhookUrl = process.env.N8N_ANALYSE_PROFILE_URL;
    const apiKey = process.env.N8N_API_KEY;
    const apifyKey = process.env.APIFY_API_KEY;

    if (!webhookUrl) {
        console.error("Missing N8N_ANALYSE_PROFILE_URL environment variable");
        return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    // Fire and forget — n8n writes the result to AdminProfileAnalysis when done.
    const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(apiKey && { 'x-api-key': apiKey })
        },
        body: JSON.stringify({
            client_username: instagramUsername,
            user_reels_to_scrape: reelsToScrape,
            use_apify_transcript: false,
            apify_key: apifyKey || "",
            isAdmin: true
        })
    }).catch((err) => console.error("n8n webhook error:", err));
    
    console.log("analysis triggered by admin , response",res);
    
    return NextResponse.json({ triggered: true }, { status: 202 });
}
