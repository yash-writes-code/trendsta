
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// Force dynamic to ensure we always get fresh status
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Find the most recent job that is active
        const activeJob = await prisma.analysisJob.findFirst({
            where: {
                userId: userId,
                status: {
                    in: ['PENDING', 'PROCESSING']
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                status: true,
                createdAt: true
            }
        });

        if (activeJob) {
            return NextResponse.json({
                isAnalyzing: true,
                job: activeJob
            });
        }

        return NextResponse.json({
            isAnalyzing: false,
            job: null
        });

    } catch (error) {
        console.error("Error checking active analysis:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
