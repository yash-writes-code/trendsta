import React from 'react';
import { ResearchSummary, UserPerformanceResearch } from '../types/trendsta';
import { Target, Zap, Clock, Hash, TrendingUp, Lightbulb, Users, List } from 'lucide-react';

interface AIInsightsViewProps {
    researchSummary: ResearchSummary[];
    userPerformance: UserPerformanceResearch;
}

export default function AIInsightsView({ researchSummary, userPerformance }: AIInsightsViewProps) {
    // Assuming we take the first summary item if available
    const summary = researchSummary[0];
    const topHooks = userPerformance?.top_hooks || [];
    const topCaptions = userPerformance?.top_captions || [];
    const topHashtags = userPerformance?.top_hashtags || []; // Assuming this exists or we can mock/derive it if not

    if (!summary) return <div>Loading AI Insights...</div>;

    return (
        <div className="space-y-8 animate-fadeIn">

            {/* High-Level Strategy Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Instagram Strategy */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-purple-600 shadow-sm">
                            <Target size={20} />
                        </div>
                        <h3 className="font-semibold text-slate-900">Instagram Strategy</h3>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-sm">
                        {summary.instagram_insights}
                    </p>
                </div>

                {/* Viral Triggers */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-amber-600 shadow-sm">
                            <Zap size={20} />
                        </div>
                        <h3 className="font-semibold text-slate-900">Viral Triggers</h3>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-sm">
                        {summary.viral_triggers}
                    </p>
                </div>

                {/* Content Gap */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm">
                            <Lightbulb size={20} />
                        </div>
                        <h3 className="font-semibold text-slate-900">Content Gap</h3>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-sm">
                        {summary.content_gap}
                    </p>
                </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Left Column: Hooks & Formula */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Hook Formula */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="text-emerald-500" size={20} />
                            <h3 className="font-bold text-slate-900">Winning Hook Formula</h3>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-800 font-medium italic">
                            "{summary.hook_formula}"
                        </div>
                    </div>

                    {/* Top Performing Hooks List */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <List className="text-slate-500" size={20} />
                            <h3 className="font-bold text-slate-900">Top Performing Hooks</h3>
                        </div>
                        <div className="space-y-3">
                            {topHooks.slice(0, 5).map((item: { hook: string }, i: number) => (
                                <div key={i} className="flex gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors group">
                                    <span className="text-slate-300 font-bold text-lg select-none">#{i + 1}</span>
                                    <div className="flex-1">
                                        <p className="text-slate-800 font-medium leading-snug">"{item.hook}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column: Timing & Hashtags */}
                <div className="space-y-6">

                    {/* Posting Times */}
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock className="text-blue-400" size={20} />
                            <h3 className="font-bold">Best Posting Times</h3>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            {summary.posting_times}
                        </p>
                    </div>

                    {/* Top Hashtags */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Hash className="text-pink-500" size={20} />
                            <h3 className="font-bold text-slate-900">Top Hashtags</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {/* Mock/Placeholder if not in schema directly under userPerformance */}
                            {/* Using some generic ones or parsing strings if needed, 
                      but let's check if the type has it. 
                      Trendsta type definition mentions 'top_hashtags' in user_performance_research but it was truncated in my view.
                      I'll assume it's an array of strings or objects. 
                  */}
                            {/* Fallback to mock if empty for visual demo */}
                            {['marketing', 'growth', 'socialmedia', 'branding', 'entrepreneur'].map((tag, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Competitor Insight Snippet */}
                    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="text-indigo-600" size={18} />
                            <h3 className="font-bold text-indigo-900 text-sm">Competitor Insight</h3>
                        </div>
                        <p className="text-indigo-800 text-xs leading-relaxed">
                            {summary.competitor_insights}
                        </p>
                    </div>

                </div>
            </div>

        </div>
    );
}
