"use client";

import React from "react";
import { Zap, CheckCircle2, Lightbulb, AlertTriangle, ArrowRight, Sparkles, Target, FlaskConical, Music, Timer } from "lucide-react";

interface ResearchSummaryProps {
    summary: {
        execution_plan?: {
            immediate_action_checklist: string[];
            production_spec_sheet: {
                target_wpm: string;
                target_duration: string;
                audio_mood: string;
            };
            experiment_this: {
                hypothesis: string;
                how_to_test: string;
            };
        };
        viral_triggers?: string;
        content_gap?: string;
        hook_formula?: string;
        [key: string]: any;
    };
}

export default function ResearchSummaryView({ summary }: ResearchSummaryProps) {
    const { execution_plan } = summary;

    if (!execution_plan) return null;

    return (
        <div className="w-full animate-fadeInUp">
            {/* Execution Card */}
            <div className="execution-card p-8 md:p-10 relative overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl">

                {/* Header */}
                <div className="flex items-start gap-4 mb-10 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg">
                        <Zap size={28} className="text-yellow-400 fill-yellow-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Execution Plan</h2>
                        <p className="text-blue-200/80 font-medium text-sm tracking-wide">Immediate tactical actions & Strategy</p>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="relative z-10">

                    {/* Tactical Execution (Full Width) */}
                    <div className="space-y-8">

                        {/* 1. Immediate Action Checklist */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-white/10 pb-2">Immediate Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {execution_plan.immediate_action_checklist.map((action, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/30 transition-colors group">
                                        <div className="min-w-[20px] pt-0.5">
                                            <div className="w-5 h-5 rounded border-2 border-slate-600 group-hover:border-blue-500 transition-colors flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                        <p className="text-slate-200 text-sm font-medium leading-relaxed">{action}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Grid for Specs & Experiment */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* 2. Production Spec Sheet */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-white/10 pb-2">Production Specs</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                            <Timer size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase text-emerald-400 font-bold">Duration & Pace</p>
                                            <p className="text-slate-200 text-xs font-semibold">{execution_plan.production_spec_sheet.target_duration}</p>
                                            <p className="text-slate-400 text-[10px]">{execution_plan.production_spec_sheet.target_wpm}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                                            <Music size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase text-purple-400 font-bold">Audio Mood</p>
                                            <p className="text-slate-200 text-xs font-semibold line-clamp-2">{execution_plan.production_spec_sheet.audio_mood}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Experiment This */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-white/10 pb-2">Active Experiment</h3>
                                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-5 relative overflow-hidden h-full">
                                    <div className="absolute top-0 right-0 p-3 opacity-10">
                                        <FlaskConical size={64} className="text-blue-400" />
                                    </div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="flex gap-4">
                                            <div className="w-0.5 bg-blue-500/50 self-stretch rounded-full" />
                                            <div>
                                                <p className="text-[10px] uppercase text-blue-400 font-bold mb-1">Hypothesis</p>
                                                <p className="text-slate-300 text-sm leading-relaxed italic">"{execution_plan.experiment_this.hypothesis}"</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-0.5 bg-emerald-500/50 self-stretch rounded-full" />
                                            <div>
                                                <p className="text-[10px] uppercase text-emerald-400 font-bold mb-1">Test Protocol</p>
                                                <p className="text-slate-300 text-sm leading-relaxed">{execution_plan.experiment_this.how_to_test}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] -ml-24 -mb-24 pointer-events-none" />
            </div>
        </div>
    );
}
