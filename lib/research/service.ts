import { prisma } from "@/lib/prisma";
import { RawResearchData } from "@/app/types/rawApiTypes";

/**
 * Result of the research fetching operation
 */
export type ResearchResult = {
    readonly success: true;
    readonly data: RawResearchData;
    readonly isGuest: boolean;
    readonly researchId: string;
} | {
    readonly success: false;
    readonly error: string;
    readonly statusCode: number;
};

/**
 * Fetches the latest research data for a given user (or guest).
 * This logic is shared between the API route and the AI Consultant.
 */
export async function getLatestResearch(
    userId: string,
): Promise<ResearchResult> {
    try {
        let socialAccount = null;

        // A. Try to find authenticated user's social account
        socialAccount = await prisma.socialAccount.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

       // 1. Fetch Social Account for User
        if (!socialAccount) {
            return {
                success: false,
                error: "No social account found. Please connect your Instagram account first.",
                statusCode: 404
            };
        }

        // 2. Fetch Research for Social Account
        const research = await prisma.research.findFirst({
            where: { socialAccountId: socialAccount.id },
            orderBy: { createdAt: "desc" },
            include: {
                scriptSuggestions: true,
                overallStrategy: true,
                userResearch: true,
                competitorResearch: true,
                nicheResearch: true,
                twitterResearch: true,
            },
        });

        if (!research) {
            return {
                success: false,
                error: "No research found. Please run an analysis first.",
                statusCode: 404
            };
        }

        // 3. Format Data
        const formattedData: RawResearchData = {
            id: research.id,
            socialAccountId: research.socialAccountId,
            createdAt: research.createdAt.toISOString(),
            scriptSuggestions: (research.scriptSuggestions?.scripts as any) ?? null,
            overallStrategy: (research.overallStrategy?.data as any) ?? null,
            userResearch: (research.userResearch?.data as any) ?? null,
            competitorResearch: (research.competitorResearch?.data as any) ?? null,
            nicheResearch: (research.nicheResearch?.data as any) ?? null,
            twitterResearch: research.twitterResearch
                ? {
                    latest: (research.twitterResearch.latestData as any),
                    top: (research.twitterResearch.topData as any),
                }
                : null,
        };

        return {
            success: true,
            data: formattedData,
            isGuest: false, // Caller can override if they know it's a guest
            researchId: research.id
        };

    } catch (error) {
        console.error("Error in getLatestResearch service:", error);
        return {
            success: false,
            error: "Internal server error fetching research",
            statusCode: 500
        };
    }
}
