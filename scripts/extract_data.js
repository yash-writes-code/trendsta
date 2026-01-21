const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const DATA_FILE = 'InstaResearch.xlsx';
const OUTPUT_FILE = 'app/dashboard/data/staticData.ts';

async function extract() {
    try {
        const filePath = path.join(process.cwd(), DATA_FILE);
        const workbook = XLSX.readFile(filePath);

        // Parse Research Summary
        const summarySheetName = workbook.SheetNames.find(n => n.includes('ResearchSummary')) || 'ResearchSummary';
        const summarySheet = workbook.Sheets[summarySheetName];
        const summaryRawString = XLSX.utils.sheet_to_json(summarySheet);
        const summaryRaw = summaryRawString[0] || {};

        const summary = {
            ...summaryRaw,
            postingSchedule: summaryRaw.posting_times || summaryRaw.postingSchedule,
        };

        // Parse Top Reels
        const reelsSheetName = workbook.SheetNames.find(n => n.includes('TopPerformingReels')) || 'TopPerformingReels';
        const reelsSheet = workbook.Sheets[reelsSheetName];
        const reelsRaw = XLSX.utils.sheet_to_json(reelsSheet);

        const topReels = reelsRaw.slice(0, 10).map((row) => ({
            creator: row.ownerUsername || 'Unknown',
            velocityScore: typeof row.velocity_score === 'number' ? row.velocity_score : parseFloat(row.velocity_score || '0'),
            views: (row.videoPlayCount || row.igPlayCount || 0),
            likes: (row.likesCount || 0),
            comments: (row.commentsCount || 0),
            shares: (row.reshareCount || 0),
            caption: row.caption || '',
        }));

        const fileContent = `
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

export const DASHBOARD_STATIC_DATA: DashboardData = {
    summary: ${JSON.stringify(summary, null, 4)},
    topReels: ${JSON.stringify(topReels, null, 4)}
};
`;

        // Ensure directory exists
        const dir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(OUTPUT_FILE, fileContent);
        console.log(`Successfully wrote static data to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error("Error extracting data:", error);
        process.exit(1);
    }
}

extract();
