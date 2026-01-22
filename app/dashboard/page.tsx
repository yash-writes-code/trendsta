"use client"
import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import { DASHBOARD_STATIC_DATA } from "../dashboard/data/staticData";
import { StatsOverview, getTimeOfDay } from "./components/StatsOverview";
import { VelocityChart, EngagementChart } from "./components/ChartsView";
import ResearchSummaryView from "./components/ResearchSummaryView";
import { ScriptIdeasLink, QuickActions } from "./components/DashboardCards";
import { SCRIPT_IDEAS } from "../data/mockData";

import { useSession } from "@/lib/auth-client";
export const dynamic = 'force-dynamic'; // Ensure we read file on each request in dev


export default function DashboardPage() {

    const {
        data: session,
        isPending, //loading state
        error, //error object 
        refetch //refetch the session
    } = useSession();

    console.log(session);

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    // Use Static Data
    const { summary, topReels } = DASHBOARD_STATIC_DATA;

    return (
        <div className="min-h-screen">
            <Sidebar />
            <MobileHeader />

            <main className="md:ml-64 p-4 md:p-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Page Header */}
                    <div className="animate-fadeInUp">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Good {getTimeOfDay().charAt(0).toUpperCase() + getTimeOfDay().slice(1)} Steve
                        </h1>
                        <p className="text-slate-500 mt-1">{formattedDate}</p>
                    </div>

                    {/* Stats Overview */}
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <StatsOverview />
                    </div>

                    {/* Charts Section - Now First as per request: "Charts ... followed by insights" */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        <VelocityChart data={topReels} />
                        <EngagementChart data={topReels} />
                    </div>

                    {/* Research Summary Section */}
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                        <ResearchSummaryView summary={summary} />
                    </div>

                    {/* Script Ideas Link Card */}
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                        <ScriptIdeasLink
                            count={SCRIPT_IDEAS.length}
                            score={SCRIPT_IDEAS[0]?.viralScore || 0}
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="animate-fadeInUp " style={{ animationDelay: '0.5s' }}>
                        <QuickActions reelsCount={topReels.length} />
                    </div>
                </div>
            </main>
        </div>
    );
}
