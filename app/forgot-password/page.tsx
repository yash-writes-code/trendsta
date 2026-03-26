"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            const { error: resetError } = await (authClient as any).requestPasswordReset({
                email,
                redirectTo: "/reset-password",
            });

            if (resetError) {
                console.log(resetError);
                const isNotFound =
                    resetError.status === 404 ||
                    resetError.code === 'USER_NOT_FOUND' ||
                    resetError.message?.toLowerCase().includes("not found") ||
                    resetError.message?.toLowerCase().includes("user not found");

                if (isNotFound) {
                    setError("No account exists for this email address.");
                } else {
                    // Log the actual error to console for debugging if it's something else
                    console.error("Forgot password error:", resetError);
                    setError(resetError.message || "An error occurred");
                }
            } else {
                setIsSuccess(true);
            }
        } catch (err: any) {
            console.error("Forgot password exception:", err);
            const isNotFound =
                err?.status === 404 ||
                err?.code === 'USER_NOT_FOUND' ||
                err?.message?.toLowerCase().includes("not found");

            if (isNotFound) {
                setError("No account exists for this email address.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-lg p-8 sm:p-10"
            >
                <div className="flex items-center justify-center gap-3 mb-10">
                    <Image src="/T_logo.png" alt="Trendsta" width={36} height={36} className="rounded-xl drop-shadow-sm" />
                    <span className="text-3xl font-black text-gray-900 tracking-tighter">Trendsta</span>
                </div>

                <div className="mb-8 text-center">
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 tracking-tight">Reset Password</h1>
                    <p className="text-gray-500 text-sm sm:text-base font-medium">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 text-red-400 text-sm font-semibold text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {isSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-emerald-400 text-center space-y-4"
                    >
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-lg text-emerald-300">Check your inbox</p>
                            <p className="text-sm mt-1 opacity-90">We've sent a password reset link to {email}.</p>
                        </div>
                        <Link href="/signin" className="block mt-4 text-gray-700 font-bold bg-gray-100 hover:bg-gray-200 py-3 rounded-xl transition-all">
                            Back to Sign In
                        </Link>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3.5 sm:py-4 rounded-2xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all font-medium text-sm sm:text-base"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full py-4 rounded-2xl font-black text-white bg-linear-to-r from-orange-500 to-orange-600 shadow-[0_8px_20px_rgba(234,88,12,0.2)] hover:shadow-[0_12px_30px_rgba(234,88,12,0.4)] hover:-translate-y-px active:translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest border border-white/10 text-sm sm:text-base"
                        >
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </button>

                        <div className="text-center pt-4">
                            <Link href="/signin" className="text-xs sm:text-sm text-gray-400 hover:text-gray-900 font-semibold transition-colors">
                                ← Back to Sign In
                            </Link>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
