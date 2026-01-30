"use client";

import React from 'react';
import { Target, Sparkles, Lightbulb, ArrowRight, Zap, AlertTriangle, Fingerprint, BookOpen, Quote, TrendingUp } from 'lucide-react';

// --- Viral Trigger Widget ---
interface ViralTriggerProps {
    data?: {
        trigger: string;
        why_works: string;
        example: string;
    }[];
}

export function ViralTriggerWidget({ data }: ViralTriggerProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl shadow-xl border border-slate-100/50 flex flex-col h-full animate-fadeInUp">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors shrink-0">
                    <Target size={20} className="text-indigo-500" />
                </div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">Viral Triggers</h3>
            </div>

            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                {data.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors shadow-sm group">
                        <div className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100/50 text-indigo-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                {idx + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-slate-800 text-sm mb-1 break-words">{item.trigger}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed mb-2 break-words text-wrap whitespace-normal">{item.why_works}</p>
                                <div className="flex items-start gap-1.5 mt-2 bg-slate-50 p-2 rounded-lg">
                                    <Sparkles size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-[10px] text-slate-600 font-medium italic break-words text-wrap whitespace-normal">"{item.example}"</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Content Gap Widget ---
interface ContentGapProps {
    data?: {
        gap: string;
        opportunity: string;
        evidence: string;
    };
}

export function ContentGapWidget({ data }: ContentGapProps) {
    if (!data || !data.gap) return null;

    return (
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col h-full animate-fadeInUp group hover:border-blue-100 transition-colors">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0">
                    <Target size={20} className="text-blue-500" />
                </div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">Content Gap</h3>
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h4 className="text-lg font-black text-slate-900 leading-tight mb-2 break-words">
                        {data.gap}
                    </h4>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed break-words text-wrap whitespace-normal">
                        {data.opportunity}
                    </p>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 w-fit px-3 py-1.5 rounded-full inline-flex max-w-full">
                        <TrendingUp size={14} className="shrink-0" />
                        <span className="truncate">High Demand, Low Supply</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Hook Formula Widget ---
interface HookFormulaProps {
    data?: {
        pattern: string;
        examples: string[];
        why_works: string;
    };
}

export function HookFormulaWidget({ data }: HookFormulaProps) {
    if (!data || !data.pattern) return null;

    return (
        <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl shadow-xl border border-slate-100/50 flex flex-col h-full animate-fadeInUp group hover:border-fuchsia-100 transition-colors">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-fuchsia-50 flex items-center justify-center group-hover:bg-fuchsia-100 transition-colors shrink-0">
                    <Lightbulb size={20} className="text-fuchsia-500" />
                </div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">Hook Formula</h3>
            </div>

            <div className="flex-1 flex flex-col gap-4">
                {/* Pattern */}
                <div>
                    <span className="text-[10px] font-bold text-fuchsia-500 uppercase tracking-wider mb-1 block">
                        Hook Formula Key
                    </span>
                    <div className="p-3 bg-fuchsia-50/50 rounded-xl border border-fuchsia-100 text-sm font-bold text-slate-800 break-words">
                        {data.pattern}
                    </div>
                </div>

                {/* Why it works */}
                <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">The Psychology</span>
                    <p className="text-xs text-slate-500 leading-relaxed italic break-words text-wrap whitespace-normal">
                        "{data.why_works}"
                    </p>
                </div>

                {/* Example */}
                <div className="mt-auto">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Example</span>
                    {data.examples && data.examples.length > 0 && (
                        <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <Quote size={12} className="text-slate-400 flex-shrink-0 mt-0.5" />
                            <span className="break-words text-wrap whitespace-normal">{data.examples[0]}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
