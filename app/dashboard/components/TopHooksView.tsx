"use client";

import React from 'react';
import { Bookmark, ExternalLink } from 'lucide-react';

interface HookItem {
    rank: number;
    hook: string;
    reelcaption: string;
    sourceusername: string;
}

interface TopHooksProps {
    hooks: HookItem[];
}

export default function TopHooksView({ hooks }: TopHooksProps) {
    if (!hooks || hooks.length === 0) return null;

    return (
        <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl shadow-xl border border-slate-100/50 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Bookmark size={18} className="text-slate-400" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Thief's Gallery</h3>
                </div>
                <span className="text-[10px] bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-bold uppercase tracking-wide border border-amber-100">
                    Top Performing Hooks
                </span>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <div className="col-span-1 text-center">Rank</div>
                    <div className="col-span-8">Hook Strategy</div>
                    <div className="col-span-3">Source</div>
                </div>

                {hooks.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-4 items-center p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md hover:border-indigo-100 transition-all group">
                        <div className="col-span-1 flex justify-center">
                            {idx < 3 ? (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${idx === 0 ? 'bg-yellow-400 shadow-yellow-200' :
                                    idx === 1 ? 'bg-slate-300' :
                                        'bg-amber-600'
                                    }`}>
                                    {item.rank}
                                </div>
                            ) : (
                                <span className="text-slate-400 font-bold">#{item.rank}</span>
                            )}
                        </div>
                        <div className="col-span-8">
                            <p className="text-sm font-semibold text-slate-800 leading-relaxed group-hover:text-indigo-600 transition-colors">
                                "{item.hook}"
                            </p>
                            <p className="text-xs text-slate-400 mt-1 truncate">
                                {item.reelcaption}
                            </p>
                        </div>
                        <div className="col-span-3 flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                @{item.sourceusername}
                            </span>
                            {/* Placeholder for link if we had it, keeping visuals clean */}
                            {/* <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                <ExternalLink size={16} />
                            </button> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
