"use client";

import React from 'react';
import DashboardClient from './DashboardClient';
import { OnboardingGuard } from '../components/OnboardingGuard';

export default function DashboardPage() {
    return (
        <OnboardingGuard>
            <DashboardClient />
        </OnboardingGuard>
    );
}
