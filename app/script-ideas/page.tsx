"use client";

import React, { useState } from "react";
import { FileText, Clock, Target, Hash, ChevronDown, ChevronUp, Copy, Check, Sparkles, Lightbulb, MessageCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import { SCRIPT_IDEAS } from "@/app/data/mockData";

export default function ScriptIdeasPage() {
    const [expandedScript, setExpandedScript] = useState<number | null>(null);
    const [expandedCaptionId, setExpandedCaptionId] = useState<number | null>(null);
    const [copiedSection, setCopiedSection] = useState<string | null>(null);

    const copyToClipboard = (text: string, section: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 2000);
    };

    return (
        <div className="min-h-screen">
            {/* Subtle Top Gradient */}
            <div className="fixed top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

            <Sidebar />
            <MobileHeader />

            <main className="md:ml-64 p-4 md:p-12 relative z-10">
                <div className="max-w-3xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Script Ideas</h1>
                        <p className="text-lg text-slate-500 max-w-xl">
                            Curated script ideas for your next post.
                        </p>
                    </div>

                    {/* Scripts Grid */}
                    <div className="space-y-8">
                        {SCRIPT_IDEAS.map((script) => {
                            const isExpanded = expandedScript === script.id;

                            return (
                                <div
                                    key={script.id}
                                    onClick={() => setExpandedScript(isExpanded ? null : script.id)}
                                    className={`
                                        group relative bg-white rounded-lg border border-slate-200 transition-all duration-200 cursor-pointer text-left
                                        ${isExpanded ? 'shadow-md ring-1 ring-slate-200' : 'hover:border-slate-300'}
                                    `}
                                >
                                    {/* Card Content */}
                                    <div className="p-8">
                                        <div className="flex flex-col gap-6">
                                            {/* Primary: Title */}
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <h2 className="text-xl md:text-2xl font-semibold text-slate-900 leading-tight">
                                                        {script.title}
                                                    </h2>

                                                    {/* Score System - Minimalist */}
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <div className={`text-sm font-medium px-2 py-0.5 rounded
                                                            ${script.viralScore >= 90 ? 'bg-blue-50 text-blue-700' : 'text-slate-400'}
                                                        `}>
                                                            {script.viralLabel}
                                                        </div>
                                                        <span className={`text-lg font-bold
                                                            ${script.viralScore >= 90 ? 'text-blue-600' : 'text-slate-600'}
                                                        `}>
                                                            {script.viralScore}/100
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Secondary: Insight/Hook */}
                                            <div className="relative pl-4 border-l-2 border-slate-200">
                                                <p className="text-lg text-slate-700 font-medium italic leading-relaxed">
                                                    "{script.hook}"
                                                </p>
                                            </div>

                                            {/* Tertiary: Metadata */}
                                            <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                                <span>{script.duration}</span>
                                                <span className="text-slate-300">•</span>
                                                <span>{script.targetAudience}</span>
                                                <span className="text-slate-300">•</span>
                                                <span>{script.emotionalTrigger}</span>
                                            </div>

                                            {/* CTA */}
                                            <div className="pt-2 flex justify-end">
                                                <span className={`
                                                    text-sm font-semibold transition-colors
                                                    ${isExpanded ? 'text-slate-400' : 'text-blue-600 group-hover:text-blue-700'}
                                               `}>
                                                    {isExpanded ? "Close" : "View Full Script →"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className="pt-8 px-8 pb-8 border-t border-slate-100 animate-fadeIn">
                                            {/* Full Script */}
                                            <div className="mb-10">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                                        <MessageCircle size={16} className="text-slate-400" />
                                                        Video Script
                                                    </h3>
                                                    <button
                                                        onClick={() => copyToClipboard(script.fullText, `script-${script.id}`)}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded text-xs font-semibold text-slate-600 transition-colors"
                                                    >
                                                        {copiedSection === `script-${script.id}` ? (
                                                            <><Check size={12} className="text-green-600" /> Copied</>
                                                        ) : (
                                                            <><Copy size={12} /> Copy Script</>
                                                        )}
                                                    </button>
                                                </div>
                                                <div className="p-6 bg-slate-50/50 rounded-lg border border-slate-100">
                                                    <p className="text-slate-800 text-base leading-relaxed whitespace-pre-wrap font-mono text-sm">
                                                        {script.fullText}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Script Breakdown */}
                                            <div className="mb-10">
                                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                    <Target size={16} className="text-slate-400" />
                                                    Structural Breakdown
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-1">
                                                        <span className="text-xs font-bold text-slate-400 uppercase">01 Hook</span>
                                                        <p className="text-slate-700 font-medium">{script.hook}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-xs font-bold text-slate-400 uppercase">02 Buildup</span>
                                                        <p className="text-slate-700 text-sm">{script.buildup}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-xs font-bold text-slate-400 uppercase">03 Value</span>
                                                        <p className="text-slate-700 text-sm">{script.value}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-xs font-bold text-slate-400 uppercase">04 CTA</span>
                                                        <p className="text-slate-700 text-sm">{script.cta}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Strategic Insight */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                                {/* Why This Works */}
                                                <div className="bg-blue-50/30 p-6 rounded-lg border border-blue-100/50">
                                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                        <Lightbulb size={16} className="text-blue-600" />
                                                        Why This Works
                                                    </h3>
                                                    <p className="text-sm text-slate-700 leading-relaxed mb-3">{script.whyThisWorks}</p>

                                                    <div className="pt-3 border-t border-blue-100/50">
                                                        <span className="text-xs font-bold text-blue-700 uppercase">Gap Addressed</span>
                                                        <p className="text-sm text-slate-600">{script.contentGap}</p>
                                                    </div>
                                                </div>

                                                {/* Caption & Hashtags */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                                                            Caption Preview
                                                        </h3>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                copyToClipboard(script.captionFull, `caption-${script.id}`);
                                                            }}
                                                            className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                                                        >
                                                            {copiedSection === `caption-${script.id}` ? "Copied" : "Copy"}
                                                        </button>
                                                    </div>
                                                    <div className="mb-4">
                                                        <p className={`text-sm text-slate-600 leading-relaxed transition-all ${expandedCaptionId === script.id ? '' : 'line-clamp-4'}`}>
                                                            {script.captionFull}
                                                        </p>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setExpandedCaptionId(expandedCaptionId === script.id ? null : script.id);
                                                            }}
                                                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-2 flex items-center gap-1"
                                                        >
                                                            {expandedCaptionId === script.id ? (
                                                                <>Show Less <ChevronUp size={12} /></>
                                                            ) : (
                                                                <>Show More <ChevronDown size={12} /></>
                                                            )}
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {script.hashtags.map((tag, idx) => (
                                                            <span key={idx} className="text-xs text-slate-400 font-medium">#{tag}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
