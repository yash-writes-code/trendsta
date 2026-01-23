import React from 'react';
import { ResearchSummary, UserPerformanceResearch } from '../types/trendsta';
import SmartInsightsView from './SmartInsightsView';

interface AIInsightsViewProps {
    researchSummary: ResearchSummary[];
    userPerformance: UserPerformanceResearch;
}

export default function AIInsightsView({ researchSummary }: AIInsightsViewProps) {
    const summary = researchSummary[0];

    return (
        <SmartInsightsView
            insightText={summary?.instagram_insights || ""}
            title="Instagram Strategy Blueprint"
            description="AI-generated tactical plan based on your recent performance and niche data."
            theme="instagram"
        />
    );
}
