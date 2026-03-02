"use client";

/**
 * ReferralTracker
 *
 * Invisible client component that:
 * 1. Reads ?ref=<code> from the URL
 * 2. Persists it in a cookie (30-day expiry) so it survives the sign-up redirect
 * 3. If the user is already authenticated, immediately calls /api/referral/track
 * 4. If not authenticated, the cookie is read & posted on the next mount where session is available
 */

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const COOKIE_NAME = "trendsta_ref";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const LOG = "[ReferralTracker]";

function getRefCookie(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${COOKIE_NAME}=`));
    const value = match ? decodeURIComponent(match.split("=")[1]) : null;
    console.log(`${LOG} getRefCookie →`, value ?? "(none)");
    return value;
}

function setRefCookie(code: string) {
    console.log(`${LOG} setRefCookie →`, code);
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(code)}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
}

function clearRefCookie() {
    console.log(`${LOG} clearRefCookie`);
    document.cookie = `${COOKIE_NAME}=; max-age=0; path=/`;
}

async function trackReferral(ref: string) {
    console.log(`${LOG} trackReferral called with ref="${ref}"`);
    try {
        const res = await fetch("/api/referral/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ref }),
        });
        const data = await res.json();
        console.log(`${LOG} /api/referral/track response:`, res.status, data);

        if (res.ok && (data.status === "ok" || data.status === "already_set")) {
            clearRefCookie();
            console.log(`${LOG} tracking successful (status="${data.status}"), cookie cleared`);
        } else {
            console.warn(`${LOG} tracking returned unexpected status:`, data.status ?? data.error);
        }
    } catch (err) {
        console.error(`${LOG} fetch to /api/referral/track threw:`, err);
    }
}

export default function ReferralTracker() {
    const searchParams = useSearchParams();
    const { data: session } = useSession();

    // Step 1: Capture ref from URL into cookie
    useEffect(() => {
        const refParam = searchParams?.get("ref");
        console.log(`${LOG} [URL effect] searchParams ref=`, refParam ?? "(none)");
        if (refParam) {
            setRefCookie(refParam);
            console.log(`${LOG} ref param found in URL, stored in cookie`);
        } else {
            console.log(`${LOG} no ref param in URL`);
        }
    }, [searchParams]);

    // Step 2: When session is available, send the ref to the API
    useEffect(() => {
        console.log(`${LOG} [Session effect] session user=`, session?.user?.id ?? "(not authenticated)");

        if (!session?.user) {
            console.log(`${LOG} no session yet — waiting for auth before tracking`);
            return;
        }

        const refFromUrl = searchParams?.get("ref");
        const refFromCookie = getRefCookie();
        const ref = refFromUrl || refFromCookie;

        console.log(`${LOG} refFromUrl="${refFromUrl}", refFromCookie="${refFromCookie}", effective ref="${ref}"`);

        if (ref) {
            trackReferral(ref);
        } else {
            console.log(`${LOG} no ref to track for user ${session.user.id}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user?.id]);

    return null; // renders nothing
}
