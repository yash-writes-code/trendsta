"use client";

import React from 'react';
import CompetitorsClient from './CompetitorsClient';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client for this page
const queryClient = new QueryClient();

export default function CompetitorsPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <CompetitorsClient />
        </QueryClientProvider>
    );
}
