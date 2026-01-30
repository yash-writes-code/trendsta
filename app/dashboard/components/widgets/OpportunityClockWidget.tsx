"use client";

import React from 'react';
import { Clock, TrendingUp, AlertCircle } from 'lucide-react';

interface TimeSlot {
    day: string;
    time: string;
    heat_score: number;
    source: string;
}

interface OpportunityClockProps {
    data: {
        insight: string;
        top_slots: TimeSlot[];
    };
}

export default function OpportunityClockWidget({ data }: OpportunityClockProps) {
    return (
        <div className="bg-gradient-to-br from-white to-slate-50 p-5 md:p-6 rounded-3xl shadow-xl border border-slate-100/50 flex flex-col h-full animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Opportunity Clock</h3>
                    <div className="animate-pulse w-2 h-2 rounded-full bg-amber-500"></div>
                </div>
                <p className="text-xs text-slate-500 leading-snug">{data.insight}</p>
            </div>

            <div className="flex-1 flex flex-col gap-3">
                {data.top_slots.map((slot, index) => {
                    const isUser = slot.source === 'User Data';
                    return (
                        <div key={index} className={`relative overflow-hidden rounded-xl p-3 flex items-center justify-between border transition-all hover:scale-[1.01] cursor-default
                            ${isUser ? 'bg-indigo-50 border-indigo-100' : 'bg-violet-50 border-violet-100'}
                        `}>
                            {/* Background Elements */}
                            <div className={`absolute right-0 top-0 w-20 h-20 rounded-full blur-xl opacity-20 -mr-4 -mt-4 ${isUser ? 'bg-indigo-400' : 'bg-violet-400'}`}></div>

                            <div className="flex items-center gap-3 relative z-10 min-w-0 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-indigo-100 text-indigo-600' : 'bg-violet-100 text-violet-600'}`}>
                                    <Clock size={14} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className={`text-xs font-bold truncate ${isUser ? 'text-indigo-900' : 'text-violet-900'}`}>{slot.day} @ {slot.time}</h4>
                                    <p className={`text-[9px] font-medium uppercase tracking-wider truncate ${isUser ? 'text-indigo-600' : 'text-violet-600'}`}>
                                        {isUser ? 'Your Prime Time' : 'Competitor Spike'}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right relative z-10 flex-shrink-0 pl-2">
                                <div className={`text-lg font-black ${isUser ? 'text-indigo-500' : 'text-violet-500'}`}>
                                    {slot.heat_score}
                                </div>
                                <div className={`text-[9px] font-medium ${isUser ? 'text-indigo-400' : 'text-violet-400'}`}>Score</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
