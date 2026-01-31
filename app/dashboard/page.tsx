
import React from 'react';
import DashboardClient from './DashboardClient';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {

    // Check session for guest mode injection
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const isGuest = !session?.user;

    return <DashboardClient isGuest={isGuest} />;
}
