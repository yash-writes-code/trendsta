import React from 'react';
import { Target, Zap, ArrowRight, Brain, CheckCircle2, TrendingUp } from 'lucide-react';

interface SmartInsightsViewProps {
    insightText: string;
    title: string;
    description: string;
    theme?: 'instagram' | 'twitter' | 'competitor';
}

export default function SmartInsightsView({ insightText, title, description, theme = 'instagram' }: SmartInsightsViewProps) {
    // Parse the insights text
    // Format: "1. Point Title → Evidence: ... → Action: ..." or just numbered lists
    const insights = insightText.split(/\n(?=\d+\.)/).map(line => {
        // Clean up formatting
        const cleanLine = line.trim();
        if (!cleanLine) return null;

        // Extract Number
        const numberMatch = cleanLine.match(/^(\d+)\./);
        const number = numberMatch ? numberMatch[1] : null;

        // Remove number from start
        let content = cleanLine.replace(/^\d+\.\s*/, '');

        // Extract Title, Evidence, Action if using the "→" format
        // Check for Evidence/Action markers
        let titleText = content;
        let evidence = "";
        let action = "";

        if (content.includes("Action:")) {
            const parts = content.split("Action:");
            action = parts[1].trim();
            content = parts[0];
        }

        if (content.includes("Evidence:")) {
            const parts = content.split("Evidence:");
            evidence = parts[1].replace(/→$/, '').trim(); // Remove trailing arrow if present
            titleText = parts[0].replace(/→$/, '').trim();
        }

        // Cleanup arrows from title
        titleText = titleText.replace(/→/g, '').trim();

        return { number, title: titleText, evidence, action };
    }).filter(Boolean);

    // Theme Config
    const themes = {
        instagram: {
            bg: "bg-gradient-to-br from-fuchsia-50 to-pink-50",
            border: "border-pink-100",
            icon: <Target className="text-pink-600" size={24} />,
            accentData: "text-pink-600",
            accentAction: "bg-pink-600",
            lightAction: "bg-pink-50 text-pink-700 border-pink-200"
        },
        twitter: {
            bg: "bg-gradient-to-br from-blue-50 to-sky-50",
            border: "border-blue-100",
            icon: <Brain className="text-blue-600" size={24} />,
            accentData: "text-blue-600",
            accentAction: "bg-blue-600",
            lightAction: "bg-blue-50 text-blue-700 border-blue-200"
        },
        competitor: {
            bg: "bg-gradient-to-br from-indigo-50 to-violet-50",
            border: "border-indigo-100",
            icon: <TrendingUp className="text-indigo-600" size={24} />,
            accentData: "text-indigo-600",
            accentAction: "bg-indigo-600",
            lightAction: "bg-indigo-50 text-indigo-700 border-indigo-200"
        }
    };

    const currentTheme = themes[theme];

    if (!insightText) {
        return (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                <p className="text-slate-400 font-medium">No insights generated yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        {currentTheme.icon}
                        {title}
                    </h2>
                    <p className="text-slate-500 mt-1 max-w-2xl">
                        {description}
                    </p>
                </div>
            </div>

            {/* Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insights.map((insight, idx) => (
                    <div
                        key={idx}
                        className={`
                            relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg
                            bg-white border-slate-200 hover:border-slate-300
                            ${!insight?.action ? 'flex items-center' : ''} 
                        `}
                    >
                        {/* Number Watermark */}
                        <div className="absolute -top-4 -right-4 text-9xl font-black text-slate-100/50 select-none pointer-events-none">
                            {idx + 1}
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            {/* Title */}
                            <h3 className="text-lg font-bold text-slate-800 leading-snug mb-3 pr-8">
                                {insight?.title}
                            </h3>

                            {/* Evidence / Context */}
                            {insight?.evidence && (
                                <div className="mb-6 flex-grow">
                                    <div className="flex gap-2">
                                        <div className={`mt-1.5 w-1 h-1 rounded-full ${currentTheme.accentAction}`} />
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            <span className="font-semibold text-slate-700 uppercase text-[10px] tracking-wider mr-1">Data Signal:</span>
                                            {insight.evidence}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Action Item - The most important part */}
                            {insight?.action && (
                                <div className={`mt-auto p-4 rounded-xl border ${currentTheme.lightAction} relative`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 p-1 rounded-full ${currentTheme.accentAction} text-white`}>
                                            <CheckCircle2 size={12} strokeWidth={4} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold opacity-70 mb-1">Recommended Action</p>
                                            <p className="font-semibold text-sm leading-relaxed">
                                                {insight.action}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Fallback layout if parsing failed to find structure but text exists */}
                            {(!insight?.evidence && !insight?.action) && (
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {insight?.title}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
