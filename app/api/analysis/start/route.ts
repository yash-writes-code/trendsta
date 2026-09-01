import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { calculateAnalysisCost } from "@/lib/analysis/config";
import { getActiveSubscription, getWalletBalances, calculateDeductionSplit } from "@/lib/analysis/credits";

interface StartAnalysisRequest {
    reelCountTier?: 'LOW' | 'MEDIUM' | 'HIGH';
    competitorUsernames?: string[];
    writingStyle?: string;
    scriptLanguage?: string;
    captionLanguage?: string;
}

// POST /api/analysis/start
// Starts a new analysis job
export async function POST(request: NextRequest) {
    try {
        // 1. Auth check
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Parse request body
        const body: StartAnalysisRequest = await request.json();
        const {
            reelCountTier = 'MEDIUM',
            competitorUsernames = [],
            writingStyle = "let ai decide",
            scriptLanguage = "English",
            captionLanguage = "English"
        } = body;

        // 2. Verify social account belongs to user
        const socialAccount = await prisma.socialAccount.findFirst({
            where: {
                userId: userId,
            },
        });

        if (!socialAccount) {
            return NextResponse.json(
                { error: "Social account not found or access denied" },
                { status: 404 }
            );
        }
        const socialAccountId = socialAccount.id;
        // 3. Check user has completed profile (niche + subNiche)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { niche: true, subNiche: true },
        });

        if (!user?.niche || !user?.subNiche) {
            return NextResponse.json(
                {
                    error: "Profile incomplete. Please complete your profile first.",
                    needsOnboarding: true,
                },
                { status: 400 }
            );
        }

        // 4. Check user has active subscription
        const subscription = await getActiveSubscription(userId);

        if (!subscription) {
            return NextResponse.json(
                { error: "No active subscription. Please subscribe to a plan." },
                { status: 403 }
            );
        }

        const plan = subscription.plan;

        // 5. Check competitor analysis access if competitors provided
        if (competitorUsernames.length > 0 && !plan.competitorAnalysisAccess) {
            return NextResponse.json(
                {
                    error: "Competitor analysis is not available on your current plan",
                    upgradeRequired: true
                },
                { status: 403 }
            );
        }

        // 6. Calculate cost and check credits with bucket breakdown
        const stellaCost = calculateAnalysisCost(reelCountTier, competitorUsernames.length);
        const balances = await getWalletBalances(userId);
        console.log("balances", balances);
        console.log("stellaCost", stellaCost);
        if (balances.total < stellaCost) {
            return NextResponse.json(
                {
                    error: "Insufficient stellas",
                    required: stellaCost,
                    available: balances.total,
                    message: "You don't have enough stellas for this analysis. Please top up or wait for your monthly refresh."
                },
                { status: 402 }
            );
        }

        // Calculate how to split the deduction (monthly first, then topup)
        const deductionSplit = calculateDeductionSplit(stellaCost, balances);

        // Map Tier to Reel Count
        const reelCountMap = {
            'LOW': 3,
            'MEDIUM': 60,
            'HIGH': 90
        };
        const noOfReelsToScrape = reelCountMap[reelCountTier] || 30;

        // 7. Determine analysis configuration
        const isCompetitorAnalysis = competitorUsernames.length > 0 && plan.competitorAnalysisAccess;

        // Validate n8n URL is configured (fail fast, don't waste credits)
        const n8nUrl = isCompetitorAnalysis
            ? process.env.N8N_WEBHOOK_URL
            : process.env.N8N_WEBHOOK_URL_BASIC;

        if (!n8nUrl) {
            console.error("Missing N8N Webhook URL configuration");
            return NextResponse.json(
                { error: "Configuration error. Please contact support." },
                { status: 500 }
            );
        }

        // Determine Model based on Plan
        const analysisModel = plan.tier === 1
            ? "google/gemini-2.5-flash"
            : "google/gemini-3.1-pro-preview";

        // Construct n8n payload (no secrets — worker injects apify_key at dispatch)
        const n8nPayload = {
            creator_niche: user.niche,
            sub_niche: user.subNiche,
            language_of_script: scriptLanguage,
            language_of_text: captionLanguage,
            writing_style: writingStyle,
            location: "India", // TODO: Add location to User profile
            noOfReelsToScrape: noOfReelsToScrape,
            reelsTill_Filter: 14,
            minLikesReel_Filter: 0,
            competitorListUsernames: isCompetitorAnalysis ? competitorUsernames : [],
            reels_per_competitor: isCompetitorAnalysis ? 5 : 0,
            is_user_specific: true,
            client_username: socialAccount.username,
            user_reels_to_scrape: 5,
            use_apify_transcript: false,
            socialAccountId: socialAccountId,
            callBackUrl: "https://trendsta.in",
            analysis_model_openrouter: analysisModel,
        };

        // 8. ATOMIC: Create AnalysisJob + hold credits + write outbox event
        //    All three operations commit or roll back together.
        //    The outbox relay will pick up the event and enqueue to BullMQ.
        const job = await prisma.$transaction(async (tx) => {
            // Create the analysis job
            const newJob = await tx.analysisJob.create({
                data: {
                    userId,
                    socialAccountId,
                    status: "PENDING",
                    stellaCost,
                },
            });

            const transactionMetadata = {
                type: "analysis",
                socialAccountId,
                competitorCount: competitorUsernames.length,
            };

            // Create HELD transaction for monthly portion (if any)
            if (deductionSplit.fromMonthly > 0) {
                await tx.stellaTransaction.create({
                    data: {
                        userId,
                        amount: -deductionSplit.fromMonthly,
                        bucket: "MONTHLY",
                        reason: "FEATURE_USAGE",
                        referenceId: newJob.id,
                        status: "HELD",
                        metadata: transactionMetadata,
                    },
                });
            }

            // Create HELD transaction for topup portion (if any)
            if (deductionSplit.fromTopup > 0) {
                await tx.stellaTransaction.create({
                    data: {
                        userId,
                        amount: -deductionSplit.fromTopup,
                        bucket: "TOPUP",
                        reason: "FEATURE_USAGE",
                        referenceId: newJob.id,
                        status: "HELD",
                        metadata: transactionMetadata,
                    },
                });
            }

            // Deduct from Wallet immediately
            if (deductionSplit.fromMonthly > 0 || deductionSplit.fromTopup > 0) {
                await tx.wallet.update({
                    where: { userId },
                    data: {
                        ...(deductionSplit.fromMonthly > 0 && { monthlyBalance: { decrement: deductionSplit.fromMonthly } }),
                        ...(deductionSplit.fromTopup > 0 && { topupBalance: { decrement: deductionSplit.fromTopup } }),
                    },
                });
            }

            // Write outbox event — guarantees the analysis job will be dispatched
            await tx.outboxEvent.create({
                data: {
                    eventType: "START_ANALYSIS",
                    payload: {
                        analysisJobId: newJob.id,
                        userId,
                        socialAccountId,
                        n8nPayload,
                        isCompetitorAnalysis,
                    },
                },
            });

            return newJob;
        });

        // 9. Return job info (no external API call — response is instant)
        return NextResponse.json({
            success: true,
            jobId: job.id,
            status: job.status,
            estimatedCost: stellaCost,
            message: "Analysis queued. This typically takes 10-15 minutes.",
        });

    } catch (error) {
        console.error("Error starting analysis:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
