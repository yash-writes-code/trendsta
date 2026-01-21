"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Play, Hash, Sparkles, User, TrendingUp, Users, FileText } from "lucide-react";
import Image from "next/image";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/top-reels", label: "Instagram Reels", icon: Play },
    { href: "/competitors", label: "Competitors", icon: Users },
    { href: "/script-ideas", label: "Script Ideas", icon: FileText },
    { href: "/twitter-insights", label: "Twitter Insights", icon: Hash },
    { href: "/ai-consultant", label: "AI Consultant", icon: Sparkles },
];


export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-64 bg-neutral-50 opacity-80 border-r border-blue-100 h-screen fixed left-0 top-0 z-50">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">

                <div className="relative w-60 h-20 rounded-xl overflow-hidden">
                    <a href="/"><Image src="/logo3.png" width={200} height={200} alt="Trendsta Logo" className="object-cover" /></a>
                </div>
                {/* <span className="font-bold text-slate-900 tracking-tight text-xl">
                    Trendsta
                </span> */}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? "bg-blue-50 text-blue-600 border border-blue-200"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 opacity-50 hover:opacity-100"
                                }`}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Stats Summary */}
            <div className="px-4 py-4 border-t border-slate-100">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <p className="text-xs text-slate-500 mb-2">Today&apos;s Focus</p>
                    <p className="text-sm font-semibold text-slate-900 mb-1">Build in Public</p>
                    <p className="text-xs text-slate-500">3 scripts ready</p>
                </div>
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-all duration-200">
                    <div className="avatar-ring">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <User size={18} />
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">Creator Pro</p>
                        <p className="text-xs text-slate-500">Free Plan</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
