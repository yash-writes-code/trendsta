"use client";

import React from "react";
import { BarChart3, TrendingUp } from "lucide-react";

interface ReelData {
    creator: string;
    velocityScore: number;
    views: number;
    likes: number;
    comments: number;
    shares: number;
}

export function VelocityChart({ data }: { data: ReelData[] }) {
    // Take top 6 for chart
    const chartData = data.slice(0, 6).map(reel => ({
        label: reel.creator.substring(0, 10),
        velocity: reel.velocityScore || 0,
        views: reel.views || 0,
    }));

    const maxVelocity = Math.max(...chartData.map(d => d.velocity), 1);

    return (
        <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <BarChart3 size={18} className="text-blue-500" />
                    <h3 className="font-semibold text-slate-900">Velocity Scores</h3>
                </div>
                <span className="text-xs text-slate-500">Top 6 Reels</span>
            </div>

            <div className="chart-container" style={{ display: 'flex', alignItems: 'flex-end', height: '150px', gap: '8px' }}>
                {chartData.map((d, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div
                            className="chart-bar w-full rounded-t-sm transition-all duration-500"
                            style={{
                                height: `${(d.velocity / maxVelocity) * 100}%`,
                                background: d.velocity >= 5 ? 'var(--gradient-success)' :
                                    d.velocity >= 1 ? 'var(--gradient-primary)' :
                                        'var(--gradient-warning)',
                                minHeight: '10px',
                                opacity: 0.8
                            }}
                            title={`${d.velocity.toFixed(1)} velocity`}
                        />
                        <span className="text-xs text-slate-500 truncate w-full text-center">
                            {d.velocity.toFixed(1)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex justify-between mt-2 px-1 gap-2">
                {chartData.map((d, index) => (
                    <span key={index} className="text-xs text-slate-400 truncate flex-1 text-center" title={d.label}>
                        {d.label}
                    </span>
                ))}
            </div>
        </div>
    );
}

export function EngagementChart({ data }: { data: ReelData[] }) {
    // Top 5 reels
    const chartData = data.slice(0, 5);

    // simple normalization helpers
    // Assuming likes can be up to 1M+, comments up to 10k+, shares up to 100k+
    // We want relative bars. We can use max of current set.
    const maxLikes = Math.max(...chartData.map(d => d.likes), 100);
    const maxComments = Math.max(...chartData.map(d => d.comments), 10);
    const maxShares = Math.max(...chartData.map(d => d.shares), 10);

    return (
        <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-emerald-500" />
                    <h3 className="font-semibold text-slate-900">Engagement Breakdown</h3>
                </div>
            </div>

            <div className="space-y-4">
                {chartData.map((d, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="w-24 flex-shrink-0">
                            <p className="text-xs font-medium text-slate-700 truncate" title={d.creator}>{d.creator}</p>
                        </div>
                        <div className="flex-1 flex flex-col gap-1.5">
                            {/* Likes */}
                            <div className="flex items-center gap-2 h-2">
                                <div className="h-full rounded-full bg-rose-400"
                                    style={{ width: `${(d.likes / maxLikes) * 100}%`, minWidth: '2px' }} />
                            </div>
                            {/* Comments */}
                            <div className="flex items-center gap-2 h-2">
                                <div className="h-full rounded-full bg-blue-400"
                                    style={{ width: `${(d.comments / maxComments) * 100}%`, minWidth: '2px' }} />
                            </div>
                            {/* Shares */}
                            <div className="flex items-center gap-2 h-2">
                                <div className="h-full rounded-full bg-emerald-400"
                                    style={{ width: `${(d.shares / maxShares) * 100}%`, minWidth: '2px' }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-6 mt-6 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="text-xs text-slate-500">Likes</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400" />
                    <span className="text-xs text-slate-500">Comments</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-xs text-slate-500">Shares</span>
                </div>
            </div>
        </div>
    );
}
