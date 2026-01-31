"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import NoResearchFound from "../components/NoResearchFound"; // Import NoResearchFound
import { useRouter } from "next/navigation"; // Import useRouter
import { StatsOverview } from "./components/StatsOverview";
import ResearchSummaryView from "./components/ResearchSummaryView";
import { ScriptIdeasLink, QuickActions } from "./components/DashboardCards";
import { useSidebar } from "../context/SidebarContext";
import { TrendstaData } from "../types/trendsta";
import { Calendar, Loader2 } from "lucide-react";

// Hooks & Transformers
import { useResearch } from "../../hooks/useResearch";
import { buildResearchSummary, transformScriptSuggestion } from "../../lib/transformers";

// New Widgets
import ViralSweetSpotWidget from "./components/widgets/ViralSweetSpotWidget";
import HookLeaderboardWidget from "./components/widgets/HookLeaderboardWidget";
import OpportunityClockWidget from "./components/widgets/OpportunityClockWidget";
import TopicGapsWidget from "./components/widgets/TopicGapsWidget";
import ContentDietWidget from "./components/widgets/ContentDietWidget";
import TopicDominanceWidget from "./components/widgets/TopicDominanceWidget";
import ConsistencyWidget from "./components/widgets/ConsistencyWidget";
import TopHooksView from "./components/TopHooksView";
import KeyMetricsRow from "./components/widgets/KeyMetricsRow";

import { ViralTriggerWidget, ContentGapWidget, HookFormulaWidget } from "./components/widgets/StrategyWidgets";

export const dynamic = 'force-dynamic';

interface DashboardClientProps {
    isGuest: boolean;
}

export default function DashboardClient({ isGuest }: DashboardClientProps) {
    const { isCollapsed } = useSidebar();
    const { data: rawData, isLoading, isError, isNoResearch } = useResearch();
    const router = useRouter(); // Import useRouter

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    // Transformation Logic (Replaces dataLoader.ts)
    // Only attempt to build summary if we have data
    const summaryData = rawData ? buildResearchSummary(rawData.overallStrategy) : null;
    const graphs = rawData?.overallStrategy?.dashboard_graphs;

    // Hooks (safely extract)
    const rawHooks = rawData?.overallStrategy?.hooks || [];
    const hooks = rawHooks.map((h: any) => ({
        rank: h.rank,
        hook: h.hook,
        reelcaption: h.reelcaption,
        sourceusername: h.sourceusername
    }));

    // Prepare Metrics Data - fail gracefully if no data
    const metricsData = summaryData ? {
        best_time: summaryData.posting_strategy?.best_times?.[0] || "10:00 AM",
        best_days: (summaryData.posting_strategy?.best_days || []).join(" & "),
        target_pace: "190+",
        pace_detail: "High Energy Required",
        viral_trigger: summaryData.viral_triggers?.[0]?.trigger || "Unknown",
        trigger_detail: "VS Competitor",
        content_gap: summaryData.content_gap?.gap || "Unknown",
        gap_detail: summaryData.content_gap?.opportunity || "High Demand",
    } : null;

    // Override with specific data if available
    if (metricsData && summaryData?.execution_plan?.production_spec_sheet?.target_wpm) {
        // Extract number from string if possible or use full string
        metricsData.target_pace = summaryData.execution_plan.production_spec_sheet.target_wpm.split(' ')[0] || "190+";
    }

    const renderContent = () => {
        // Loading State
        if (isLoading) {
            return (
                <div className="h-[60vh] flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Loading Dashboard...</p>
                    </div>
                </div>
            );
        }

        // Error State or No Data
        if (isError || !rawData || isNoResearch || !summaryData || !metricsData) {
            return (
                <div className="h-[60vh] flex items-center justify-center">
                    <NoResearchFound onAnalyse={() => router.push('/analysis')} />
                </div>
            );
        }

        // Success State
        return (
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Page Header with Date Toggle */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-theme-primary tracking-tight">
                            Analytics Dashboard
                        </h1>
                        <p className="text-theme-secondary mt-1">Analysis based on research from {formattedDate}</p>
                    </div>

                    {/* Guest Banner */}
                    {isGuest && (
                        <div className="flex items-center gap-4 neu-pressed px-4 py-2 rounded-xl">
                            <div className="text-indigo-600 text-sm font-medium">
                                Viewing as Guest Mode
                            </div>
                            <a href="/signin" className="neu-btn-primary text-xs">
                                Log In to Save
                            </a>
                        </div>
                    )}
                </div>

                {/* Key Metrics Row */}
                <KeyMetricsRow data={metricsData} />

                {/* New Dashboard Graphs Grid */}
                {graphs && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Row 1: Viral Sweet Spot (Wide) & Hook Leaderboard */}
                        <div className="lg:col-span-2 h-[350px]">
                            <ViralSweetSpotWidget data={graphs.scatter_plot_viral_sweet_spot} />
                        </div>
                        <div className="h-[350px]">
                            <HookLeaderboardWidget data={graphs.bar_chart_hook_leaderboard} />
                        </div>

                        {/* Row 2: Topic Gaps (Wide) & Content Diet */}
                        <div className="lg:col-span-2 h-[350px]">
                            <TopicGapsWidget data={graphs.bubble_chart_topic_gaps} />
                        </div>
                        <div className="h-[350px]">
                            <ContentDietWidget data={graphs.pie_chart_content_diet} />
                        </div>

                        {/* Row 3: Topic Dominance & Opportunity Clock */}
                        <div className="lg:col-span-2 h-[350px]">
                            <TopicDominanceWidget data={graphs.treemap_topic_dominance} />
                        </div>
                        <div className="h-[350px]">
                            <OpportunityClockWidget data={graphs.heatmap_opportunity_clock} />
                        </div>


                        {/* Row 4: Consistency & Hook Formula */}
                        <div className="lg:col-span-2 min-h-[350px]">
                            <ConsistencyWidget data={graphs.stacked_bar_consistency} />
                        </div>
                        <div className="min-h-[350px]">
                            <HookFormulaWidget data={summaryData.hook_formula} />
                        </div>
                    </div>
                )}

                {/* Strategy & Top Hooks Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>

                    {/* Left Column: Strategy Widgets (Stacked) */}
                    <div className="space-y-6 flex flex-col h-full">
                        <div className="min-h-[200px] flex-1">
                            <ContentGapWidget data={summaryData.content_gap} />
                        </div>
                        <div className="min-h-[300px] flex-1">
                            <ViralTriggerWidget data={summaryData.viral_triggers} />
                        </div>
                    </div>

                    {/* Right Column: Thief Gallery (Top Hooks) - Takes 2/3 width */}
                    <div className="lg:col-span-2">
                        <TopHooksView hooks={hooks} />
                    </div>
                </div>

                {/* Execution Block (Research Summary) */}
                <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                    <ResearchSummaryView summary={summaryData} />
                </div>

            </div>
        );
    };

    return (
        <div className="min-h-screen relative selection:bg-blue-200">
            <Sidebar />
            <MobileHeader />

            <main className={`relative z-10 transition-all duration-300 ease-in-out p-4 md:p-6 pb-32 ${isCollapsed ? 'md:ml-24' : 'md:ml-72'}`}>
                {renderContent()}
            </main>
        </div>
    );
}
