"use client";

import { useState, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();


    // better-auth might pass token, or might extract from URL query param automatically.
    // If not, we can read it: const token = searchParams.get("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = searchParams.get("token") || undefined;
            const { error } = await authClient.resetPassword({
                newPassword: password,
                ...(token ? { token } : {}),
            });

            if (error) {
                setError(error.message || "An error occurred");
            } else {
                setIsSuccess(true);
                setTimeout(() => {
                    router.push("/signin");
                }, 3000);
            }
        } catch (err) {
            setError("An error occurred. The link might be expired.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 tracking-tight">Create New Password</h1>
                <p className="text-gray-500 text-sm sm:text-base font-medium">
                    Enter your new secure password below.
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
                        <p className="font-bold text-lg text-emerald-300">Password Changed!</p>
                        <p className="text-sm mt-1 opacity-90">Redirecting to sign in...</p>
                    </div>
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3.5 pr-12 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all font-medium text-sm sm:text-base"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-5 py-3.5 pr-12 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all font-medium text-sm sm:text-base"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !password || !confirmPassword}
                        className="w-full py-4 mt-2 rounded-2xl font-black text-white bg-linear-to-r from-orange-500 to-orange-600 shadow-[0_8px_20px_rgba(234,88,12,0.2)] hover:shadow-[0_12px_30px_rgba(234,88,12,0.4)] hover:-translate-y-px active:translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest border border-white/10 text-sm sm:text-base"
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            )}
        </motion.div>
    );
}

export default function ResetPassword() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-4">
            <Suspense fallback={<div className="text-gray-500 text-center">Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
