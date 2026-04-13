import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;

    if (!username) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const profileAnalysis = await prisma.adminProfileAnalysis.findFirst({
        where: { instagramUsername: username },
        select: {
            id: true,
            instagramUsername: true,
            analysis: true,
            createdAt: true,
        },
    });

    if (!profileAnalysis) {
        // Not ready yet — caller should keep polling
        return NextResponse.json({ ready: false }, { status: 202 });
    }

    return NextResponse.json({ ready: true, ...profileAnalysis });
}
