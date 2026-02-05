"use client";

import React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import SmartInsightsView from "../components/SmartInsightsView";
import NoResearchState from "../components/NoResearchState";

// Hooks & Transformers
import { useCompetitorResearch, useOverallStrategy } from "@/hooks/useResearch";
import { useSocialAccount } from "@/hooks/useSocialAccount";
import { useSession } from "@/lib/auth-client";
import { transformCompetitorResearch, formatCompetitorInsights } from "@/lib/transformers";

export default function CompetitorsClient() {
    // Fetch data via hooks
    const { data: rawCompetitorData, isLoading: competitorLoading, error: competitorError, isNoResearch } = useCompetitorResearch();
    const { data: rawStrategyData, isLoading: strategyLoading } = useOverallStrategy();
    const { data: socialAccount } = useSocialAccount();
    const { data: session } = useSession();

    // Transform raw data to UI types

    const competitorInsightsText = formatCompetitorInsights(rawStrategyData?.competitor_reverse_engineering);

    const isLoading = competitorLoading || strategyLoading;



    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-transparent">
                <Sidebar />
                <MobileHeader />
                <main className="md:ml-64 p-4 md:p-8 flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        <p className="text-theme-secondary">Loading competitor data...</p>
                    </div>
                </main>
            </div>
        );
    }

    // No research state for logged-in users
    if (isNoResearch && session?.user) {
        return (
            <div className="min-h-screen bg-transparent">
                <Sidebar />
                <MobileHeader />
                <main className="md:ml-64 p-4 md:p-8">
                    <NoResearchState />
                </main>
            </div>
        );
    }

    // Error State
    if (competitorError) {
        return (
            <div className="min-h-screen bg-transparent">
                <Sidebar />
                <MobileHeader />
                <main className="md:ml-64 p-4 md:p-8 flex items-center justify-center min-h-screen">
                    <div className="glass-panel border-red-500/30 p-6 max-w-md text-center">
                        <p className="text-red-500 font-medium">Failed to load competitor data</p>
                        <p className="text-red-400/80 text-sm mt-2">{(competitorError as Error).message}</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent">
            <Sidebar />
            <MobileHeader />

            <main className="md:ml-64 p-4 md:p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fadeInUp">
                        <div>
                            <h1 className="text-3xl font-bold text-theme-primary flex items-center gap-3">
                                Competitor Strategy Analysis
                            </h1>
                            <p className="text-theme-secondary mt-2">
                                AI breakdown of what your competitors are doing right.
                            </p>
                        </div>
                    </div>

                    <SmartInsightsView
                        insightText={competitorInsightsText}
                        title="Competitor Strategy Breakdown"
                        description="Reverse-engineering the top performing strategies in your niche."
                        theme="competitor"
                    />
                </div>
            </main>


        </div>
    );
}
