"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Users, DollarSign, Link as LinkIcon } from "lucide-react";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import { useSidebar } from "../context/SidebarContext";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface Commission {
    id: string;
    referredUserId: string;
    commissionPct: string;
    amount: string;
    currency: string;
    status: "PENDING" | "PAID" | "CANCELLED";
    createdAt: string;
}

interface EarningsByCurrency {
    currency: string;
    total: string;
}

interface ReferralData {
    referralCode: string;
    referralLink: string;
    totalReferrals: number;
    earningsByCurrency: EarningsByCurrency[];
    commissions: Commission[];
}

export default function ReferralPage() {
    const { isCollapsed } = useSidebar();
    const { data: session } = useSession();
    const router = useRouter();

    const [data, setData] = useState<ReferralData | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (session === undefined) return; // still loading auth
        if (!session?.user) {
            router.push("/signin");
            return;
        }
        fetchReferralData();
    }, [session]);

    async function fetchReferralData() {
        try {
            const res = await fetch("/api/referral");
            if (!res.ok) throw new Error("Failed to fetch");
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.log("error in fetchReffereal", err);

        } finally {
            setLoading(false);
        }
    }

    async function copyLink() {
        if (!data?.referralLink) return;
        await navigator.clipboard.writeText(data.referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const statusColors: Record<string, string> = {
        PENDING: "bg-amber-500/20 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/40",
        PAID: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        CANCELLED: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    };

    /** Format a major-unit amount with the right currency symbol */
    function formatAmount(amount: string, currency: string) {
        const num = Number(amount);
        try {
            return new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: currency || "USD",
                minimumFractionDigits: 2,
            }).format(num);
        } catch {
            return `${currency} ${num.toFixed(2)}`;
        }
    }

    return (
        <div className="min-h-screen relative selection:bg-blue-200">
            <Sidebar />
            <MobileHeader />

            <main
                className={`transition-all duration-300 ${isCollapsed ? "md:ml-20" : "md:ml-64"
                    } min-h-screen`}
            >
                <div className="max-w-4xl mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                            <LinkIcon className="w-4 h-4" />
                            <span>Affiliate Programme</span>
                        </div>
                        <h1 className="text-3xl font-bold text-theme-primary">Referrals</h1>
                        <p className="text-sm text-theme-secondary mt-1">
                            Share your link. Earn 10% commission when your friend makes their first purchase.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fadeIn">
                            {/* Referral Link Card */}
                            <div className="glass-panel p-6">
                                <h2 className="text-sm font-bold text-theme-muted uppercase tracking-wider mb-4">
                                    Your Referral Link
                                </h2>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1 px-4 py-3 rounded-xl border text-sm text-theme-secondary font-mono truncate"
                                        style={{ backgroundColor: "var(--glass-surface)", borderColor: "var(--glass-border)" }}>
                                        {data?.referralLink ?? "Generating…"}
                                    </div>
                                    <button
                                        onClick={copyLink}
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shrink-0"
                                    >
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                        {copied ? "Copied!" : "Copy Link"}
                                    </button>
                                </div>
                                <p className="text-xs text-theme-muted mt-3">
                                    Share this link anywhere. The person who clicks it gets tracked — no paid plan required on your end.
                                </p>
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="glass-panel p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-theme-muted font-bold uppercase tracking-wider">Total Referrals</p>
                                        <p className="text-3xl font-black text-theme-primary">{data?.totalReferrals ?? 0}</p>
                                    </div>
                                </div>

                                <div className="glass-panel p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <DollarSign className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-theme-muted font-bold uppercase tracking-wider mb-1">Total Earned</p>
                                        {!data?.earningsByCurrency || data.earningsByCurrency.length === 0 ? (
                                            <p className="text-3xl font-black text-emerald-500">—</p>
                                        ) : (
                                            <div className="flex flex-col gap-0.5">
                                                {data.earningsByCurrency.map(({ currency, total }) => (
                                                    <p key={currency} className="text-2xl font-black text-emerald-500">
                                                        {formatAmount(total, currency)}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                        <p className="text-[10px] text-theme-muted mt-1">Pending payout</p>
                                    </div>
                                </div>
                            </div>

                            {/* Commission Table */}
                            <div className="glass-panel overflow-hidden">
                                <div className="p-6 border-b" style={{ borderColor: "var(--glass-border)" }}>
                                    <h2 className="text-sm font-bold text-theme-muted uppercase tracking-wider">
                                        Commission History
                                    </h2>
                                </div>

                                {!data?.commissions || data.commissions.length === 0 ? (
                                    <div className="text-center py-16 text-theme-muted">
                                        <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                        <p className="font-semibold">No commissions yet</p>
                                        <p className="text-sm mt-1 opacity-70">Share your link to start earning</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b text-left text-xs text-theme-muted uppercase tracking-wider"
                                                    style={{ borderColor: "var(--glass-border)" }}>
                                                    <th className="px-6 py-3 font-bold">Date</th>
                                                    <th className="px-6 py-3 font-bold">Amount</th>
                                                    <th className="px-6 py-3 font-bold">Rate</th>
                                                    <th className="px-6 py-3 font-bold">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.commissions.map((c) => (
                                                    <tr key={c.id} className="border-b last:border-0"
                                                        style={{ borderColor: "var(--glass-border)" }}>
                                                        <td className="px-6 py-4 text-theme-secondary">
                                                            {new Date(c.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 font-semibold text-theme-primary">
                                                            {formatAmount(c.amount, c.currency)}
                                                        </td>
                                                        <td className="px-6 py-4 text-theme-secondary">
                                                            {Number(c.commissionPct).toFixed(0)}%
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusColors[c.status]}`}>
                                                                {c.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* How it works */}
                            <div className="glass-panel p-6">
                                <h2 className="text-sm font-bold text-theme-muted uppercase tracking-wider mb-5">How It Works</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    {[
                                        { step: "1", title: "Share Your Link", desc: "Copy your unique referral link and share it with anyone — friends, audience, social media." },
                                        { step: "2", title: "They Sign Up", desc: "When someone visits Trendsta via your link, they're automatically tagged as your referral." },
                                        { step: "3", title: "You Earn 10%", desc: "When they make their first purchase, you earn 10% commission — recorded instantly." },
                                    ].map((item) => (
                                        <div key={item.step} className="flex flex-col items-center text-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-black text-blue-500">
                                                {item.step}
                                            </div>
                                            <p className="font-semibold text-theme-primary text-sm">{item.title}</p>
                                            <p className="text-xs text-theme-secondary leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
