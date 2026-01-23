import React from 'react';
import CompetitorsClient from './CompetitorsClient';
import { getTrendstaData } from '../lib/dataLoader';

export default function CompetitorsPage() {
    const data = getTrendstaData();
    const competitorResearch = data.competitor_research || { reels: [], summary: {}, top_hooks: [], top_captions: [] };
    const researchSummary = data.llm_research_summary || [];

    return <CompetitorsClient data={competitorResearch} researchSummary={researchSummary} />;
}
