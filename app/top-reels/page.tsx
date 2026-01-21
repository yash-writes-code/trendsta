"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { TOP_REELS } from "../data/mockData";
import { Play, Eye, Heart, MessageCircle, Share2, TrendingUp, Zap, X, Menu, Clock, ExternalLink } from "lucide-react";

import MobileHeader from "../components/MobileHeader";
import ReelCard, { VelocityBadge } from "../components/ReelCard";
import ReelModal from "../components/ReelModal";

// ReelModal and formatTimeAgo removed - imported from components/ReelModal
// Imports update is separate


// Filter Button
function FilterButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${active
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
                }`}
        >
            {children}
        </button>
    );
}

// Main Top Reels Page
export default function TopReelsPage() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [selectedReel, setSelectedReel] = useState<typeof TOP_REELS[0] | null>(null);

    const filters = [
        { id: "all", label: "All" },
        { id: "startup", label: "Startups" },
        { id: "business", label: "Business" },
        { id: "buildinpublic", label: "Build in Public" },
    ];

    const filteredReels = activeFilter === "all"
        ? TOP_REELS
        : TOP_REELS.filter(reel =>
            reel.hashtags.some(tag =>
                tag.toLowerCase().includes(activeFilter.toLowerCase())
            )
        );

    return (
        <div className="min-h-screen">
            <Sidebar />
            <MobileHeader />

            <main className="md:ml-64 p-4 md:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Page Header */}
                    <div className="animate-fadeInUp">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-3">
                            {/* <Play className="text-blue-500" /> */}
                            Top Reels
                        </h1>
                        <p className="text-slate-500 mt-2">
                            Viral content from top creators in your niche
                        </p>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <div className="stat-card">
                            <p className="text-2xl font-bold text-slate-900">{TOP_REELS.length}</p>
                            <p className="text-xs text-slate-500">Trending Reels</p>
                        </div>
                        <div className="stat-card">
                            <p className="text-2xl font-bold text-emerald-600">28.7</p>
                            <p className="text-xs text-slate-500">Top Velocity</p>
                        </div>
                        <div className="stat-card">
                            <p className="text-2xl font-bold text-slate-900">192K</p>
                            <p className="text-xs text-slate-500">Max Views</p>
                        </div>
                        <div className="stat-card">
                            <p className="text-2xl font-bold text-slate-900">3.2K</p>
                            <p className="text-xs text-slate-500">Avg Shares</p>
                        </div>
                    </div>

                    {/* Filter Tags */}
                    <div className="flex flex-wrap gap-2 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
                        {filters.map((filter) => (
                            <FilterButton
                                key={filter.id}
                                active={activeFilter === filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                            >
                                {filter.label}
                            </FilterButton>
                        ))}
                    </div>

                    {/* Reels Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
                        {filteredReels.map((reel, index) => (
                            <ReelCard
                                key={reel.id}
                                reel={reel}
                                index={index}
                                onViewDetails={() => setSelectedReel(reel)}
                            />
                        ))}
                    </div>

                    {filteredReels.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-500">No reels found for this filter.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            {selectedReel && (
                <ReelModal
                    reel={selectedReel}
                    onClose={() => setSelectedReel(null)}
                />
            )}
        </div>
    );
}
