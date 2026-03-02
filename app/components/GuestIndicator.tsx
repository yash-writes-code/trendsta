"use client";

import React from 'react';
import Link from 'next/link';
import { useSession } from "@/lib/auth-client";
import { ArrowRight, UserCircle } from 'lucide-react';

export default function GuestIndicator() {
    const { data: session } = useSession();

    // Do not render if user is logged in
    if (session?.user) {
        return null;
    }

    return (
        <div className="w-full mb-8 animate-fadeIn">
            <div className="relative overflow-hidden rounded-2xl glass-panel p-6 border-indigo-500/20 dark:border-indigo-500/30">
                {/* Background decorative elements - adjusted opacity for light mode */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 mt-1">
                            <UserCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-theme-primary">
                                Viewing in Guest Mode
                            </h3>
                            <p className="text-theme-secondary mt-1 max-w-xl text-sm leading-relaxed">
                                You are exploring a preview of our analysis capabilities. Log in to save your research, access personalized insights, and unlock full potential.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <Link
                            href="/signup"
                            className="w-full sm:w-auto group relative px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <span>Get your own analysis now</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="/signin"
                            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-indigo-500/30 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-medium transition-all text-center"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
