import * as XLSX from 'xlsx';
import path from 'path';

const DATA_FILE = 'InstaResearch.xlsx';

export interface DashboardData {
    summary: {
        trendAnalysis?: string;
        contentGap?: string;
        viralTriggers?: string;
        executionPlan?: string;
        postingSchedule?: string;
        instagram_insights?: string;
        [key: string]: any;
    };
    topReels: Array<{
        creator: string;
        velocityScore: number;
        views: number;
        likes: number;
        comments: number;
        shares: number;
        caption: string;
    }>;
}

export async function getDashboardData(): Promise<DashboardData> {
    try {
        const filePath = path.join(process.cwd(), DATA_FILE);
        const workbook = XLSX.readFile(filePath);

        // Parse Research Summary
        // We try to find the sheet even with slight name variations just in case
        const summarySheetName = workbook.SheetNames.find(n => n.includes('ResearchSummary')) || 'ResearchSummary';
        const summarySheet = workbook.Sheets[summarySheetName];
        const summaryRawString = XLSX.utils.sheet_to_json(summarySheet);
        const summaryRaw = summaryRawString[0] as any || {};

        // Map summary keys to our expected structure if possible, 
        // otherwise pass through raw keys like instagram_insights
        const summary = {
            ...summaryRaw,
            postingSchedule: summaryRaw.posting_times || summaryRaw.postingSchedule,
        };

        // Parse Top Reels
        const reelsSheetName = workbook.SheetNames.find(n => n.includes('TopPerformingReels')) || 'TopPerformingReels';
        const reelsSheet = workbook.Sheets[reelsSheetName];
        const reelsRaw = XLSX.utils.sheet_to_json(reelsSheet);

        // Map reels data
        const topReels = reelsRaw.slice(0, 10).map((row: any) => ({
            creator: row.ownerUsername || 'Unknown',
            velocityScore: typeof row.velocity_score === 'number' ? row.velocity_score : parseFloat(row.velocity_score || '0'),
            views: (row.videoPlayCount || row.igPlayCount || 0),
            likes: (row.likesCount || 0),
            comments: (row.commentsCount || 0),
            shares: (row.reshareCount || 0),
            caption: row.caption || '',
        }));

        return {
            summary,
            topReels
        };
    } catch (error) {
        console.error("Error reading dashboard data:", error);
        // Return empty/fallback data so the page doesn't crash
        return {
            summary: {},
            topReels: []
        };
    }
}
