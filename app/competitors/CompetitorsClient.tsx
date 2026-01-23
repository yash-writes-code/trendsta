"use client";

import React, { useState, useMemo } from "react";
import { Play, TrendingUp, Users, X, Search, Loader2, Sparkles, LayoutGrid } from "lucide-react";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import ReelCard from "../components/ReelCard";
import ReelModal from "../components/ReelModal";
import SmartInsightsView from "../components/SmartInsightsView";
import { CompetitorResearch, ReelData, ResearchSummary } from "@/app/types/trendsta";

interface CompetitorsClientProps {
    data: CompetitorResearch;
    researchSummary?: ResearchSummary[];
}

type SortField = "velocity" | "views" | "likes" | "engagement";

export default function CompetitorsClient({ data, researchSummary }: CompetitorsClientProps) {
    const [viewMode, setViewMode] = useState<'reels' | 'insights'>('reels');
    const [sortBy, setSortBy] = useState<SortField>("velocity");
    const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
    const [selectedReel, setSelectedReel] = useState<ReelData | null>(null);

    // State for filtering/adding (Visual only)
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Derive Competitors List from Reels
    const competitorsList = useMemo(() => {
        const map = new Map<string, {
            username: string;
            fullName: string;
            reels: ReelData[];
            totalViews: number;
            totalLikes: number;
            avgVelocity: number;
            avgEngagement: number;
        }>();

        if (!data || !data.reels) return [];

        data.reels.forEach(reel => {
            const username = reel.creator || reel.creatorName || "Unknown";
            if (!map.has(username)) {
                map.set(username, {
                    username,
                    fullName: reel.creatorName || username, // Best guess
                    reels: [],
                    totalViews: 0,
                    totalLikes: 0,
                    avgVelocity: 0,
                    avgEngagement: 0
                });
            }
            const comp = map.get(username)!;
            comp.reels.push(reel);
            comp.totalViews += reel.views || 0;
            comp.totalLikes += reel.likes || 0;
            // Aggregates for avg later
        });

        const list = Array.from(map.values()).map(comp => {
            const count = comp.reels.length;
            const totalVelocity = comp.reels.reduce((acc, r) => acc + (r.velocity_score || 0), 0);
            const totalEng = comp.reels.reduce((acc, r) => acc + (r.engagement_rate || 0), 0);

            return {
                ...comp,
                avgVelocity: count > 0 ? totalVelocity / count : 0,
                avgEngagement: count > 0 ? totalEng / count : 0
            };
        });

        return list;

    }, [data]);

    const allReels = data.reels || [];

    const sortedReels = [...allReels].sort((a, b) => {
        switch (sortBy) {
            case "velocity": return (b.velocity_score || 0) - (a.velocity_score || 0);
            case "views": return (b.views || 0) - (a.views || 0);
            case "likes": return (b.likes || 0) - (a.likes || 0);
            case "engagement": return (b.engagement_rate || 0) - (a.engagement_rate || 0);
            default: return 0;
        }
    });

    const filteredReels = selectedCreator
        ? sortedReels.filter(r => (r.creator === selectedCreator || r.creatorName === selectedCreator))
        : sortedReels;

    const handleAddCompetitor = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSearchQuery("");
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <MobileHeader />

            <main className="md:ml-64 p-4 md:p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fadeInUp">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                {viewMode === 'reels' ? 'Competitor Intelligence' : 'Competitor Strategy Analysis'}
                            </h1>
                            <p className="text-slate-500 mt-2">
                                {viewMode === 'reels'
                                    ? `Tracking ${data.summary?.competitorsTracked || 0} competitors and ${data.reels?.length || 0} viral uploads.`
                                    : 'AI breakdown of what your competitors are doing right.'}
                            </p>
                        </div>

                        {/* View Toggle */}
                        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm inline-flex">
                            <button
                                onClick={() => setViewMode('reels')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'reels'
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                <LayoutGrid size={18} />
                                Monitoring
                            </button>
                            <button
                                onClick={() => setViewMode('insights')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'insights'
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                <Sparkles size={18} />
                                AI Insights
                            </button>
                        </div>
                    </div>

                    {viewMode === 'insights' ? (
                        <SmartInsightsView
                            insightText={researchSummary?.[0]?.competitor_insights || ""}
                            title="Competitor Strategy Breakdown"
                            description="Reverse-engineering the top performing strategies in your niche."
                            theme="competitor"
                        />
                    ) : (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Header with Search */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div>
                                    {/* Subheader if needed, or just keep spacing */}
                                </div>

                                {/* Add Competitor Input */}
                                <form onSubmit={handleAddCompetitor} className="flex gap-2 w-full md:w-auto">
                                    <div className="relative flex-1 md:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Enter username (e.g. alexhormozi)"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !searchQuery}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-md"
                                    >
                                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Add'}
                                    </button>
                                </form>
                            </div>

                            {/* Competitor Cards */}
                            <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">Tracked Competitors</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {competitorsList.map((competitor, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedCreator(selectedCreator === competitor.username ? null : competitor.username)}
                                            className={`p-4 rounded-2xl border transition-all cursor-pointer ${selectedCreator === competitor.username
                                                ? 'bg-blue-50 border-blue-200 shadow-md'
                                                : 'bg-white border-slate-200 hover:shadow-lg hover:border-slate-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0">
                                                    {competitor.username[0].toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-slate-900 truncate">@{competitor.username}</p>
                                                    <p className="text-xs text-slate-500 truncate">{competitor.fullName || 'Creator'}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="bg-slate-50 rounded-lg p-2 text-center">
                                                    <p className="text-slate-500 text-xs">Reels</p>
                                                    <p className="font-bold text-slate-900">{competitor.reels.length}</p>
                                                </div>
                                                <div className="bg-slate-50 rounded-lg p-2 text-center">
                                                    <p className="text-slate-500 text-xs">Avg Velocity</p>
                                                    <p className="font-bold text-blue-600">{competitor.avgVelocity.toFixed(1)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {competitorsList.length === 0 && (
                                        <div className="col-span-full py-8 text-center text-slate-500 bg-white border border-slate-200 rounded-xl border-dashed">
                                            No competitors found. Use the search to add more.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sort Controls */}
                            <div className="flex items-center justify-between mb-6 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    {selectedCreator ? `@${selectedCreator}'s Reels` : 'All Competitor Reels'}
                                    <span className="ml-2 text-sm font-normal text-slate-500">({filteredReels.length})</span>
                                </h2>
                                <div className="flex gap-3">
                                    {selectedCreator && (
                                        <button
                                            onClick={() => setSelectedCreator(null)}
                                            className="px-3 py-2 text-sm bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 flex items-center gap-1"
                                        >
                                            <X size={14} /> Clear
                                        </button>
                                    )}
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortField)}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="velocity">Sort by Velocity</option>
                                        <option value="views">Sort by Views</option>
                                        <option value="likes">Sort by Likes</option>
                                        <option value="engagement">Sort by Engagement</option>
                                    </select>
                                </div>
                            </div>

                            {/* Reels Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                                {filteredReels.map((reel, index) => (
                                    <ReelCard
                                        key={reel.id}
                                        reel={reel}
                                        index={index}
                                        onViewDetails={() => setSelectedReel(reel)}
                                    />
                                ))}
                                {filteredReels.length === 0 && (
                                    <div className="col-span-full text-center py-12">
                                        <p className="text-slate-500">No reels found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal for Reel Details */}
            {selectedReel && (
                <ReelModal
                    reel={selectedReel}
                    onClose={() => setSelectedReel(null)}
                />
            )}
        </div>
    );
}
