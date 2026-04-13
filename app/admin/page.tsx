"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles, AlertTriangle, ExternalLink, RefreshCw, Instagram } from 'lucide-react';

export default function AdminPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    const [instagramUsername, setInstagramUsername] = useState('');
    const [reelsToScrape, setReelsToScrape] = useState(3);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // duplicate state: username that already exists
    const [duplicateUsername, setDuplicateUsername] = useState('');

    useEffect(() => {
        if (!isPending && (!session || (session.user as any).role !== 'ADMIN')) {
            router.push('/signin');
        }
    }, [session, isPending, router]);

    const submitTrigger = async (username: string, reels: number, force = false) => {
        setLoading(true);
        setError('');
        setDuplicateUsername('');

        try {
            const res = await fetch('/api/admin/analyse_profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instagramUsername: username,
                    reelsToScrape: reels,
                    force,
                }),
            });

            const data = await res.json();

            if (res.status === 200 && data.exists) {
                // A completed record already exists
                setDuplicateUsername(username);
                setLoading(false);
                return;
            }

            if (res.status === 202 && data.triggered) {
                // Redirect — polling happens on the profile page
                router.push(`/profile/${username}`);
                return;
            }

            setError(data.error || `Unexpected response (${res.status})`);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Network error. Please try again.');
            setLoading(false);
        }
    };

    const handleGenerate = () => {
        if (!instagramUsername.trim()) return;
        submitTrigger(instagramUsername.trim(), reelsToScrape);
    };

    const handleRetrigger = () => {
        submitTrigger(duplicateUsername, reelsToScrape, true);
    };

    const handleViewExisting = () => {
        router.push(`/profile/${duplicateUsername}`);
    };

    if (isPending) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@700;800&display=swap');
                body { font-family: 'DM Sans', sans-serif; }
                .font-serif-brand { font-family: 'Playfair Display', serif; }
                .glow-orange { box-shadow: 0 0 40px -10px rgba(249,115,22,0.35); }
                input[type=range]::-webkit-slider-thumb { accent-color: #f97316; }
            `}} />

            <div className="w-full max-w-lg">

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" /> Admin Console
                    </div>
                    <h1 className="text-4xl font-black font-serif-brand text-white tracking-tight mb-2">
                        Profile Analysis
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Trigger an n8n analysis for any Instagram account.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 glow-orange backdrop-blur-sm">

                    {/* Username Input */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Instagram Username
                        </label>
                        <div className="relative">
                            {/* <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" /> */}
                            <input
                                type="text"
                                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 focus:outline-none transition-all font-medium text-white placeholder:text-gray-600 text-sm"
                                placeholder="theyashg"
                                value={instagramUsername}
                                onChange={e => {
                                    setInstagramUsername(e.target.value);
                                    setDuplicateUsername('');
                                    setError('');
                                }}
                                onKeyDown={e => e.key === 'Enter' && !loading && handleGenerate()}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Reels to Scrape */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Reels to Scrape
                            </label>
                            <span className="text-sm font-black text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-lg min-w-[2.5rem] text-center">
                                {reelsToScrape}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={20}
                            step={1}
                            value={reelsToScrape}
                            onChange={e => setReelsToScrape(Number(e.target.value))}
                            disabled={loading}
                            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-orange-500 disabled:opacity-40"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-gray-600 mt-1.5">
                            <span>1 (Fast)</span>
                            <span>20 (Deep)</span>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                            <p className="text-sm text-red-300 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Duplicate Warning */}
                    {duplicateUsername && (
                        <div className="mb-5 bg-amber-500/10 border border-amber-500/25 rounded-xl p-4">
                            <div className="flex items-start gap-3 mb-4">
                                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-amber-300">Analysis already exists</p>
                                    <p className="text-xs text-amber-500/80 mt-0.5">
                                        A completed report for <span className="font-bold text-amber-400">@{duplicateUsername}</span> is already in the database.
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={handleViewExisting}
                                    className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-2.5 rounded-xl text-xs transition-all"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" /> View Report
                                </button>
                                <button
                                    onClick={handleRetrigger}
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-bold py-2.5 rounded-xl text-xs transition-all disabled:opacity-50"
                                >
                                    {loading
                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        : <RefreshCw className="w-3.5 h-3.5" />
                                    }
                                    Re-trigger
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    {!duplicateUsername && (
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !instagramUsername.trim()}
                            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl flex justify-center items-center gap-2.5 text-sm transition-all shadow-[0_8px_24px_-6px_rgba(249,115,22,0.5)] hover:shadow-[0_12px_28px_-6px_rgba(249,115,22,0.6)] hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Triggering Analysis...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Run Analysis
                                </>
                            )}
                        </button>
                    )}
                </div>

                <p className="text-center text-xs text-gray-600 mt-6">
                    Results are saved to <code className="text-gray-500">AdminProfileAnalysis</code> and viewable at{' '}
                    <span className="text-gray-400">/profile/[username]</span>
                </p>
            </div>
        </div>
    );
}
