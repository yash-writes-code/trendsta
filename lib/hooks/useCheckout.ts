"use client";

import { useState } from "react";

interface CheckoutOptions {
    productId: string;
    userEmail: string;
    userName?: string;
    userId?: string;
    source?: string;
}

interface UseCheckoutReturn {
    initiateCheckout: (options: CheckoutOptions) => Promise<void>;
    isProcessing: boolean;
    error: string | null;
    clearError: () => void;
}

/**
 * Shared hook that calls POST /api/checkout and redirects the user
 * to the Dodo Payments hosted checkout page.
 *
 * Used by:
 *  - app/subscription/page.tsx  (plan & bundle purchases)
 *  - app/signup/page.tsx        (post-signup redirect when ?plan= is present)
 */
export function useCheckout(): UseCheckoutReturn {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initiateCheckout = async ({
        productId,
        userEmail,
        userName,
        userId,
        source = "checkout",
    }: CheckoutOptions) => {
        setIsProcessing(true);
        setError(null);

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    email: userEmail,
                    name: userName,
                    metadata: {
                        ...(userId ? { userId } : {}),
                        source,
                    },
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to initiate checkout");
            }

            const { checkout_url } = await res.json();
            if (!checkout_url) throw new Error("No checkout URL returned");

            window.location.href = checkout_url;
            // Note: isProcessing intentionally stays true during the redirect
        } catch (err: any) {
            console.error("useCheckout error:", err);
            setError(err.message || "Failed to start checkout");
            setIsProcessing(false);
        }
    };

    const clearError = () => setError(null);

    return { initiateCheckout, isProcessing, error, clearError };
}
