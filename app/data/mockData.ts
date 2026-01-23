// Data exports for Trendsta Dashboard
// Re-exports real data from Excel file - InstaResearchData.xlsx

import {
    TOP_SCRIPT_IDEAS,
    RESEARCH_SUMMARY_DATA,
    TOP_PERFORMING_REELS,
    TOP_TWEETS,
    LATEST_TWEETS,
    TRENDING_TOPICS_DATA,
    COMPETITOR_DATA,
    type ScriptIdea,
    type Reel,
    type Tweet,
    type ResearchSummary,
    type CompetitorReel
} from "./excelData";

// Research Summary - full data
export const RESEARCH_SUMMARY = {
    generatedAt: RESEARCH_SUMMARY_DATA.generatedAt,
    dailyStrategy: "AI Infrastructure & Analysis",
    targetAudience: "Tech investors and enthusiasts in USA/Canada",
    postingSchedule: "05:00 AM, 12:00 PM, 03:00 PM (Wed/Thu)",
    instagram_insights: RESEARCH_SUMMARY_DATA.instagram_insights,
    twitter_insights: RESEARCH_SUMMARY_DATA.twitter_insights,
    competitor_insights: RESEARCH_SUMMARY_DATA.competitor_insights,
    viral_triggers: RESEARCH_SUMMARY_DATA.viral_triggers,
    content_gap: RESEARCH_SUMMARY_DATA.content_gap,
    posting_times: RESEARCH_SUMMARY_DATA.posting_times,
    hook_formula: RESEARCH_SUMMARY_DATA.hook_formula,
    keyInsights: [
        "Infrastructure content outperforms software content",
        "Tangible innovation creates viral loops",
        "Contrast hooks drive highest engagement",
        "Adopt 'Tech Analyst' persona for authority",
        "Post 1 reel per day on Wed/Thu for peak engagement"
    ]
};

// Script Ideas from Top3ReelsIdeas
export const SCRIPT_IDEAS = TOP_SCRIPT_IDEAS.map((script) => ({
    id: script.rank,
    rank: script.rank,
    title: script.script_title,
    topicTitle: script.topic_title,
    viralScore: script.viral_potential_score,
    viralLabel: script.viral_potential_score >= 90 ? "Exceptional" : script.viral_potential_score >= 80 ? "Strong" : "Experimental",
    duration: script.estimated_duration,
    targetAudience: script.target_audience,
    emotionalTrigger: script.emotional_trigger,
    hashtags: script.hashtags_all.replace(/#/g, '').split(' '),
    hook: script.script_hook,
    buildup: script.script_buildup,
    value: script.script_value,
    cta: script.script_cta,
    fullText: script.full_text,
    captionFull: script.caption_full,
    whyThisWorks: script.why_this_works,
    contentGap: script.content_gap_addressed
}));

// Top Reels from TopPerformingReels
export const TOP_REELS = TOP_PERFORMING_REELS.map((reel) => ({
    id: reel.rank,
    creator: `@${reel.ownerUsername}`,
    creatorName: reel.ownerFullName,
    title: reel.caption.split("\n")[0].substring(0, 60) + (reel.caption.length > 60 ? "..." : ""),
    fullCaption: reel.caption,
    views: formatNumber(reel.videoPlayCount),
    likes: formatNumber(reel.likesCount),
    comments: formatNumber(reel.commentsCount),
    shares: formatNumber(reel.reshareCount),
    likesRaw: reel.likesCount,
    commentsRaw: reel.commentsCount,
    sharesRaw: reel.reshareCount,
    viewsRaw: reel.videoPlayCount,
    thumbnail: reel.displayUrl,
    trend: reel.hashtags[0] || "Trending",
    velocityScore: reel.velocity_score,
    finalScore: reel.final_score,
    engagementRate: reel.engagement_rate,
    isQualityEngagement: reel.is_quality_engagement,
    hashtags: reel.hashtags,
    url: reel.url,
    ageHours: reel.age_hours,
    ageLabel: reel.age_label,
    timestamp: reel.timestamp,
    duration: reel.videoDuration
}));

// Competitor Reels from CompetitorData
// Competitor Reels from CompetitorData
export const COMPETITORS = COMPETITOR_DATA.map((reel) => ({
    id: reel.rank,
    creator: `@${reel.ownerUsername}`,
    creatorName: reel.ownerFullName,
    title: reel.caption.substring(0, 60) + (reel.caption.length > 60 ? "..." : ""),
    fullCaption: reel.caption,
    views: formatNumber(reel.videoPlayCount),
    likes: formatNumber(reel.likesCount),
    comments: formatNumber(reel.commentsCount),
    shares: "0",
    likesRaw: reel.likesCount,
    commentsRaw: reel.commentsCount,
    sharesRaw: 0,
    viewsRaw: reel.videoPlayCount,
    thumbnail: reel.displayUrl,
    trend: "Competitor",
    velocityScore: reel.velocity_score,
    finalScore: reel.final_score,
    engagementRate: reel.engagement_rate,
    isQualityEngagement: false,
    hashtags: [],
    url: reel.url,
    ageHours: reel.age_hours,
    ageLabel: reel.age_label as "fresh" | "recent" | "established",
    timestamp: reel.timestamp,
    duration: reel.videoDuration
}));

// Group competitors by username
export const COMPETITORS_GROUPED = COMPETITOR_DATA.reduce((acc, reel) => {
    const username = reel.ownerUsername;
    if (!acc[username]) {
        acc[username] = {
            username: username,
            fullName: reel.ownerFullName,
            reels: [],
            totalViews: 0,
            totalLikes: 0,
            avgVelocity: 0,
            avgEngagement: 0
        };
    }
    acc[username].reels.push(reel);
    acc[username].totalViews += reel.videoPlayCount;
    acc[username].totalLikes += reel.likesCount;
    return acc;
}, {} as Record<string, { username: string; fullName: string; reels: CompetitorReel[]; totalViews: number; totalLikes: number; avgVelocity: number; avgEngagement: number }>);

// Calculate averages for competitors
Object.values(COMPETITORS_GROUPED).forEach(competitor => {
    const count = competitor.reels.length;
    competitor.avgVelocity = competitor.reels.reduce((sum, r) => sum + r.velocity_score, 0) / count;
    competitor.avgEngagement = competitor.reels.reduce((sum, r) => sum + r.engagement_rate, 0) / count;
});

// Trending Topics
export const TRENDING_TOPICS = TRENDING_TOPICS_DATA.map((topic) => ({
    rank: topic.rank,
    topic: topic.topic,
    direction: topic.direction,
    tweets: topic.count
}));

// Top Tweets with scores
export const TWEETS = TOP_TWEETS.map((tweet) => ({
    id: tweet.Rank,
    author: tweet.Author.replace("@", ""),
    handle: tweet.Author,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${tweet.Author.replace("@", "")}`,
    content: tweet.Tweet,
    viralKeywords: extractKeywords(tweet.Tweet),
    likes: formatNumber(tweet.Likes),
    retweets: formatNumber(tweet.Replies || 0),
    views: formatNumber(tweet.Views),
    time: tweet.Date,
    score: tweet.Score || 0,
    followers: formatNumber(tweet.Followers),
    url: tweet.URL
}));

// Latest Tweets feed
export const LATEST_TWEETS_FEED = LATEST_TWEETS.map((tweet) => ({
    id: tweet.Rank,
    author: tweet.Author.replace("@", ""),
    handle: tweet.Author,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${tweet.Author.replace("@", "")}`,
    content: tweet.Tweet,
    likes: tweet.Likes,
    views: tweet.Views,
    postedAgo: tweet.Posted_Ago || "Just now",
    media: tweet.Media,
    url: tweet.URL,
    followers: formatNumber(tweet.Followers)
}));

// AI Chat starter
export const AI_CHAT_HISTORY = [
    {
        id: 1,
        role: "assistant" as const,
        content: "Hey! I'm your Trendsta AI consultant. I can help you analyze your scripts, find competitor insights, or rewrite hooks for better engagement. What would you like to work on today?"
    }
];

// Dashboard Stats
export const DASHBOARD_STATS = {
    totalReelsAnalyzed: TOP_PERFORMING_REELS.length + COMPETITOR_DATA.length,
    avgVelocityScore: TOP_PERFORMING_REELS.reduce((sum, r) => sum + r.velocity_score, 0) / TOP_PERFORMING_REELS.length,
    topEngagement: Math.max(...TOP_PERFORMING_REELS.map(r => r.engagement_rate)) * 100,
    scriptsReady: TOP_SCRIPT_IDEAS.length,
    competitorsTracked: Object.keys(COMPETITORS_GROUPED).length
};

// Utility functions
function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
}

function extractKeywords(text: string): string[] {
    const keywords: string[] = [];
    // Extract numbers with context
    const numberMatches = text.match(/\$?\d+[KMB%]?|\d+x|\d+\s?(days?|months?|years?)/gi);
    if (numberMatches) keywords.push(...numberMatches.slice(0, 2));
    // Extract quoted phrases
    const quoteMatches = text.match(/"[^"]+"/g);
    if (quoteMatches) keywords.push(...quoteMatches.slice(0, 1));
    return keywords.slice(0, 3);
}

// Export types
export type { ScriptIdea, Reel, Tweet, ResearchSummary, CompetitorReel };
