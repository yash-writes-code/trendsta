"use client";

import React from 'react';
import { Clock, Zap, Target, AlertTriangle, Car, TrendingUp } from 'lucide-react';

interface KeyMetricsRowProps {
    data: {
        best_time: string;
        best_days: string;
        target_pace: string;
        pace_detail: string;
        viral_trigger: string;
        trigger_detail: string;
        content_gap: string;
        gap_detail: string;
    }
}

export default function KeyMetricsRow({ data }: KeyMetricsRowProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-fadeInUp">
            {/* 1. BEST TIME TO POST (Green Theme) */}
            <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5 md:p-6 group transition-all hover:scale-[1.01] hover:shadow-md hover:border-emerald-200">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl -mr-6 -mt-6"></div>

                <div className="relative z-10">
                    <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-2 opacity-80 truncate">Best Time to Post</h3>
                    <div className="flex flex-wrap items-baseline gap-2 mb-2">
                        <span className="text-2xl md:text-3xl font-black text-slate-900">{data.best_time}</span>
                        <span className="text-xs text-slate-500 font-medium">(2 PM)</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600">
                        <Clock size={12} className="text-emerald-500 shrink-0" />
                        <span className="text-xs font-bold truncate">{data.best_days}</span>
                    </div>
                </div>

                {/* Left Side Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-2xl"></div>
            </div>

            {/* 2. TARGET PACE (Purple Theme) */}
            <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5 md:p-6 group transition-all hover:scale-[1.01] hover:shadow-md hover:border-purple-200">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full blur-2xl -mr-6 -mt-6"></div>

                <div className="relative z-10">
                    <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-2 opacity-80 truncate">Target Pace</h3>
                    <div className="flex flex-wrap items-baseline gap-2 mb-2">
                        <span className="text-2xl md:text-3xl font-black text-slate-900">{data.target_pace}</span>
                        <span className="text-xs text-slate-500 font-medium">WPM</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                        <Zap size={12} className="text-purple-500 shrink-0" />
                        <span className="text-xs font-bold truncate">{data.pace_detail}</span>
                    </div>
                </div>

                {/* Left Side Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-l-2xl"></div>
            </div>

            {/* 3. TOP VIRAL TRIGGER (Red Theme) */}
            <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5 md:p-6 group transition-all hover:scale-[1.01] hover:shadow-md hover:border-rose-200">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full blur-2xl -mr-6 -mt-6"></div>

                <div className="relative z-10">
                    <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-2 opacity-80 truncate">Top Viral Trigger</h3>
                    <div className="mb-2">
                        <span className="text-lg md:text-xl font-black text-slate-900 leading-tight block break-words">{data.viral_trigger}</span>
                    </div>
                    <div className="flex items-center gap-2 text-rose-600">
                        <AlertTriangle size={12} className="text-rose-500 shrink-0" />
                        <span className="text-xs font-bold line-clamp-1 break-all">{data.trigger_detail}</span>
                    </div>
                </div>

                {/* Left Side Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-l-2xl"></div>
            </div>

            {/* 4. CONTENT GAP (Blue Theme) */}
            <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5 md:p-6 group transition-all hover:scale-[1.01] hover:shadow-md hover:border-blue-200">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -mr-6 -mt-6"></div>

                <div className="relative z-10">
                    <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-2 opacity-80 truncate">Content Gap</h3>
                    <div className="mb-2">
                        <span className="text-lg md:text-xl font-black text-slate-900 leading-tight block break-words">{data.content_gap}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600">
                        <Car size={12} className="text-blue-500 shrink-0" />
                        <span className="text-xs font-bold line-clamp-1 break-all">{data.gap_detail}</span>
                    </div>
                </div>

                {/* Left Side Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-2xl"></div>
            </div>
        </div>
    );
}
