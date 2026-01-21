import React, { useState } from "react";
import { Play, Eye, Heart, MessageCircle, Share2, Clock, ExternalLink, Zap } from "lucide-react";
import { TOP_REELS } from "../data/mockData";

// Type matching the mock data structure
type Reel = typeof TOP_REELS[0];

function formatTimeAgo(hours: number): string {
    if (hours < 24) {
        return `${hours}h ago`;
    } else if (hours < 168) {
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    } else {
        const weeks = Math.floor(hours / 168);
        return `${weeks}w ago`;
    }
}

export function VelocityBadge({ score }: { score: number }) {
    const getVelocityLevel = (s: number) => {
        if (s >= 5) return { label: "🔥 Hot", className: "score-high" };
        if (s >= 1) return { label: "📈 Rising", className: "score-medium" };
        return { label: "📊 Steady", className: "score-low" };
    };
    const level = getVelocityLevel(score);
    return (
        <span className={`score-badge ${level.className}`}>
            <Zap size={12} />
            {score.toFixed(1)} {level.label}
        </span>
    );
}

interface ReelCardProps {
    reel: Reel;
    index: number;
    onViewDetails: () => void;
}

export default function ReelCard({ reel, index, onViewDetails }: ReelCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="glass-card overflow-hidden hover-glow group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            {/* Thumbnail Image - Clickable link to Instagram */}
            <a
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-[9/16] relative overflow-hidden cursor-pointer"
            >
                <img
                    src={reel.thumbnail}
                    alt={reel.title}
                    className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? "scale-110 brightness-90" : "scale-100 brightness-100"}`}
                />

                {/* Top badges */}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    <div className="px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-full flex items-center gap-1.5 shadow-sm">
                        <Eye size={14} className="text-slate-600" />
                        <span className="text-sm font-semibold text-slate-700">{reel.views}</span>
                    </div>
                    {/* Posted time ago - top right */}
                    <div className="px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-full flex items-center gap-1.5 shadow-sm">
                        <Clock size={12} className="text-slate-500" />
                        <span className="text-xs font-medium text-slate-600">{formatTimeAgo(reel.ageHours)}</span>
                    </div>
                </div>

                {/* Play Icon Overlay */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
                    <div className="w-16 h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl transform transition-transform duration-300 hover:scale-110">
                        <Play size={28} className="text-slate-900 ml-1" fill="currentColor" />
                    </div>
                </div>

                {/* Hover Overlay with Engagement */}
                <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent transition-all duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                    <div className="flex items-center gap-4 text-white/90 text-sm">
                        <span className="flex items-center gap-1">
                            <Heart size={14} className="text-rose-400" />
                            {reel.likes}
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageCircle size={14} className="text-blue-400" />
                            {reel.comments}
                        </span>
                        <span className="flex items-center gap-1">
                            <Share2 size={14} className="text-green-400" />
                            {reel.shares}
                        </span>
                    </div>
                </div>
            </a>

            {/* Card Footer - White area */}
            <div className="p-4">
                {/* Title and Creator */}
                <p className="text-sm font-semibold text-slate-900 line-clamp-2 mb-2">{reel.title}</p>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-500">{reel.creator}</span>
                    {/* Velocity Score */}
                    <VelocityBadge score={reel.velocityScore} />
                </div>

                {/* View Details Button */}
                <button
                    onClick={onViewDetails}
                    className="w-full py-2.5 text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-500 border border-blue-200 hover:border-blue-500 rounded-xl transition-all duration-200"
                >
                    View Details
                </button>
            </div>
        </div>
    );
}
