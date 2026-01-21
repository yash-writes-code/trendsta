"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Target, Sparkles, TrendingUp, Users, Zap, BrainCircuit, Quote, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

interface ResearchSummaryProps {
    summary: {
        instagram_insights?: string;
        twitter_insights?: string;
        competitor_insights?: string;
        content_gap?: string;
        viral_triggers?: string;
        execution_plan?: string;
        postingSchedule?: string;
        hook_formula?: string;
        [key: string]: any;
    };
}

// --- Parsing Helpers ---

interface InsightItem {
    main: string;
    evidence?: string;
    action?: string;
}

const parseInsights = (text?: string): InsightItem[] => {
    if (!text) return [];
    const items = text.split(/\d+\.\s+/).filter(Boolean);

    return items.map(item => {
        const parts = item.split(/→|->/);
        let main = parts[0].trim();
        let evidence = "";
        let action = "";

        parts.slice(1).forEach(part => {
            const p = part.trim();
            if (p.startsWith("Evidence:")) {
                evidence = p.replace("Evidence:", "").trim();
            } else if (p.startsWith("Action:")) {
                action = p.replace("Action:", "").trim();
            }
        });

        return { main, evidence, action };
    });
};

const parseKeyValues = (text?: string) => {
    if (!text) return [];
    return text.split("\n").map(line => {
        const [key, value] = line.split(":").map(s => s.trim());
        if (!value) return null;
        return { key, value };
    }).filter(Boolean) as { key: string, value: string }[];
};

// --- Sub-Components ---

const ConfidenceBadge = () => (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 uppercase tracking-widest">
        <CheckCircle2 size={12} />
        <span>Confidence: High</span>
    </div>
);

const InsightRow = ({ item, idx }: { item: InsightItem, idx: number }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="group border-l-2 border-slate-100 pl-6 py-2 hover:border-slate-300 transition-colors">
            <h4 className="font-semibold text-slate-900 text-lg mb-2">
                {item.main}
            </h4>

            {item.action && (
                <div className="flex items-start gap-2 mb-3">
                    <ArrowRight size={16} className="text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-slate-700 font-medium">{item.action}</p>
                </div>
            )}

            {item.evidence && (
                <div>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-xs font-semibold text-slate-400 hover:text-slate-600 uppercase tracking-wider flex items-center gap-1"
                    >
                        {isOpen ? "Hide Evidence" : "View Evidence"}
                        {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                    {isOpen && (
                        <p className="mt-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed italic">
                            {item.evidence}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default function ResearchSummaryView({ summary }: ResearchSummaryProps) {
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    // Data Parsing
    const allInsta = parseInsights(summary.instagram_insights || summary.instagram_summary_research);
    const execSummary = allInsta.slice(0, 3); // Top 3 for Big Summary
    const strategies = [...allInsta.slice(3), ...parseInsights(summary.twitter_insights)];
    const competitorInsights = parseInsights(summary.competitor_insights);
    const postingDetails = parseKeyValues(summary.postingSchedule || summary.posting_times);
    const hookDetails = parseKeyValues(summary.hook_formula);

    return (
        <div className="max-w-5xl mx-auto space-y-16 py-8 font-sans animate-fadeIn container bg-white px-8 rounded-2xl">

            {/* 1. Research Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-slate-400">Research Memo</h2>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-sm font-medium text-slate-400">{today}</span>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-bold text-slate-900">
                        Strategic Analysis
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Audience</p>
                        <p className="text-sm font-semibold text-slate-700">Creators & Growth</p>
                    </div>
                    <ConfidenceBadge />
                </div>
            </header>

            {/* 2. Executive Summary - The "What did we learn" */}
            <section>
                <div className="flex items-center gap-2 mb-8">
                    <Sparkles size={20} className="text-slate-900" />
                    <h3 className="text-lg font-bold uppercase tracking-widest text-slate-900">Executive Summary</h3>
                </div>

                <ul className="space-y-8">
                    {execSummary.map((item, idx) => (
                        <li key={idx} className="relative flex items-start gap-4 group">
                            <div className="pt-1 shrink-0">
                                <ArrowRight className="text-slate-800 group-hover:text-blue-600 transition-colors" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl  text-slate-900 leading-tight mb-3">
                                    {item.main}
                                </h2>
                                <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-blue-600 pl-4 py-1">
                                    <span className="font-bold text-blue-700 uppercase text-xs tracking-wider block mb-1">Action</span>
                                    {item.action || "See strategies below for details."}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            <hr className="border-slate-100" />

            {/* 4. Strategic Recommendations */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4">
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">Strategic<br />Recommendations</h3>
                    <p className="text-slate-500 leading-relaxed">
                        Tactical moves derived from cross-platform signals. Implement these to align with current algorithmic trends.
                    </p>
                </div>
                <div className="lg:col-span-8 space-y-8">
                    {strategies.length > 0 ? strategies.map((item, idx) => (
                        <InsightRow key={idx} item={item} idx={idx} />
                    )) : (
                        <p className="text-slate-400 italic">No additional strategic signals found today.</p>
                    )}
                </div>
            </section>

            <hr className="border-slate-100" />

            {/* 5. Competitor & Gap Analysis */}
            <section>
                <div className="flex items-center gap-2 mb-8">
                    <Target size={20} className="text-slate-900" />
                    <h3 className="text-lg font-bold uppercase tracking-widest text-slate-900">Competitive Landscape</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left: Gaps */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-white text-rose-600 rounded">
                                <AlertTriangle size={16} />
                            </div>
                            <h4 className="font-bold text-rose-500 uppercase tracking-wider text-sm">Critical Gaps</h4>
                        </div>
                        {summary.content_gap ? (
                            <div className="bg-rose-50/50 p-6 rounded-xl border border-rose-100 space-y-4">
                                {parseInsights(summary.content_gap).map((item, idx) => (
                                    <div key={idx}>
                                        <p className="text-black text-lg leading-snug mb-1">{item.main}</p>
                                        <p className="text-rose-700/80 text-sm leading-relaxed">{item.evidence || item.action}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400">No content gaps detected.</p>
                        )}
                    </div>

                    {/* Right: Competitor Moves */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded">
                                <Users size={16} />
                            </div>
                            <h4 className="font-bold text-indigo-700 uppercase tracking-wider text-sm">Competitor Moves</h4>
                        </div>
                        <div className="space-y-6">
                            {competitorInsights.map((item, idx) => (
                                <div key={idx} className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                    <p className="font-semibold text-slate-800 mb-2">{item.main}</p>
                                    <div className="flex gap-2">
                                        <div className="w-1 bg-indigo-500 rounded-full shrink-0" />
                                        <p className="text-sm text-slate-600">{item.action || item.evidence}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Execution Plan */}
            <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                {/* Decorative BG */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                            <Zap size={24} className="text-yellow-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Execution Plan</h2>
                            <p className="text-slate-400 font-medium">Immediate tactical actions</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        {/* Posting Schedule */}
                        <div className="lg:col-span-3">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Posting Window</h4>
                            <div className="space-y-4 border-xl border-white">
                                {postingDetails.map((detail, idx) => (
                                    <div key={idx} className="flex items-baseline justify-between group ">
                                        <span className="text-slate-400 font-medium">{detail.key}</span>
                                        <span className="text-md text-white group-hover:text-blue-400 transition-colors text-right">{detail.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hook Formulas */}
                        <div className="lg:col-span-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Hook Frameworks</h4>
                            <div className="grid gap-4">
                                {hookDetails.map((detail, idx) => (
                                    <div key={idx} className="bg-white/5 border border-white/5 p-5 rounded-xl hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Lightbulb size={14} className="text-yellow-400" />
                                            <span className="text-xs font-bold text-slate-300 uppercase">{detail.key}</span>
                                        </div>
                                        <p className="text-lg font-medium text-white leading-snug">"{detail.value}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
