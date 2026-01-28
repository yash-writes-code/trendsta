"use client";

import React from 'react';
import TopReelsClient from './TopReelsClient';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client for this page
const queryClient = new QueryClient();

export default function TopReelsPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <TopReelsClient />
        </QueryClientProvider>
    );
}
