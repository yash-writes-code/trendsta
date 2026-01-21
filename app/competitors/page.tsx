"use client";

import React, { useState } from "react";
import { Play, TrendingUp, Users, X, Search, Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import ReelCard from "../components/ReelCard";
import ReelModal from "../components/ReelModal";
import { COMPETITORS, COMPETITORS_GROUPED } from "@/app/data/mockData";

// Type definition for Reel
type Reel = typeof COMPETITORS[0];

type SortField = "velocity" | "views" | "likes" | "engagement";

export default function CompetitorsPage() {
    const [sortBy, setSortBy] = useState<SortField>("velocity");
    const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
    const [selectedReel, setSelectedReel] = useState<Reel | null>(null);

    // State for adding competitor
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [addedCompetitors, setAddedCompetitors] = useState<string[]>([]);

    // Combine initial mock groups with any "added" ones (logic verification: mock data is static, so we'll just "unlock" or "show" them if we were hiding, or just pretend to add one).
    // For this fake demo: We will just show a loading state and then clear the input, maybe showing a success toast. 
    // Since we don't have real "new" data, we can't easily generate NEW content without duplicating.
    // I'll just simulate the network request and maybe duplicate an existing competitor with a new name as a "mock" result if needed, or just say "Competitor Added" and show the existing list if the user implies the list *comes from* there. 
    // "list of competitors will come from there" -> potentially implies the list is empty initially? 
    // But "fake a api call ... and then load the competitor data" suggests loading data.
    // I'll keep the existing mock data displayed for better UX (so it's not empty), and the "Add" button effectively "refreshes" or "adds" a dummy entry.
    // Let's add a dummy entry to `competitorsList` in state.

    const initialCompetitorsList = Object.values(COMPETITORS_GROUPED);
    const [competitorsList, setCompetitorsList] = useState(initialCompetitorsList);

    const handleAddCompetitor = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);

        // Fake API call
        setTimeout(() => {
            setIsLoading(false);
            // Mock adding a competitor
            const newComp = {
                username: searchQuery.replace('@', ''),
                fullName: "New Creator",
                reels: [], // Empty for now or copy some random ones
                totalViews: 150000,
                totalLikes: 12000,
                avgVelocity: 8.5,
                avgEngagement: 0.05
            };
            setCompetitorsList(prev => [...prev, newComp]);
            setSearchQuery("");
            // In a real app we'd fetch their reels here too.
        }, 1500);
    };

    const sortedReels = [...COMPETITORS].sort((a, b) => {
        switch (sortBy) {
            case "velocity": return b.velocityScore - a.velocityScore;
            case "views": return b.viewsRaw - a.viewsRaw;
            case "likes": return b.likesRaw - a.likesRaw;
            case "engagement": return b.engagementRate - a.engagementRate;
            default: return 0;
        }
    });

    const filteredReels = selectedCreator
        ? sortedReels.filter(r => r.creator === `@${selectedCreator}`)
        : sortedReels;

    return (
        <div className="min-h-screen">
            <Sidebar />
            <MobileHeader />

            <main className="md:ml-64 p-4 md:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header with Search */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fadeInUp">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'var(--gradient-primary)' }}>
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900">Competitor Analysis</h1>
                            </div>
                            <p className="text-slate-500">Track and analyze competitor content performance</p>
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
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !searchQuery}
                                className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-md"
                            >
                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Add'}
                            </button>
                        </form>
                    </div>

                    {/* Competitor Cards */}
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Tracked Competitors</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {competitorsList.map((competitor, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedCreator(selectedCreator === competitor.username ? null : competitor.username)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${selectedCreator === competitor.username
                                        ? 'bg-blue-50 border-blue-300 shadow-md'
                                        : 'bg-white border-blue-100 hover:shadow-lg hover:border-blue-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
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
                                            <p className="font-bold text-slate-800">{competitor.reels.length}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-2 text-center">
                                            <p className="text-slate-500 text-xs">Avg Velocity</p>
                                            <p className="font-bold text-blue-600">{competitor.avgVelocity.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sort Controls */}
                    <div className="flex items-center justify-between mb-6 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
                        <h2 className="text-lg font-semibold text-slate-800">
                            {selectedCreator ? `@${selectedCreator}'s Reels` : 'All Competitor Reels'}
                            <span className="ml-2 text-sm font-normal text-slate-500">({filteredReels.length})</span>
                        </h2>
                        <div className="flex gap-3">
                            {selectedCreator && (
                                <button
                                    onClick={() => setSelectedCreator(null)}
                                    className="px-3 py-2 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 flex items-center gap-1"
                                >
                                    <X size={14} /> Clear
                                </button>
                            )}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortField)}
                                className="px-4 py-2 bg-white border border-blue-100 rounded-xl text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            </main>

            {/* Modal for Reel Details */}
            {selectedReel && (
                <ReelModal
                    reel={selectedReel as any} // Cast to any or compatible type if strict checks fail due to small mock data diffs, but structure is same.
                    onClose={() => setSelectedReel(null)}
                />
            )}
        </div>
    );
}
