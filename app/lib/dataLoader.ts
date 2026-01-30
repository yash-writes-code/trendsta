import finalDataset from '../../finaldataset.json';
import baapDataset from '../../baap file.json';
import { TrendstaData, ReelData, ScriptIdea } from '../types/trendsta';

// Define sources
const sourceFinal = finalDataset as any;
const sourceBaap = baapDataset as any;

// Helper to map Baap reels to ReelData interface
const mapBaapReel = (r: any): ReelData => ({
    id: r.id || String(Math.random()),
    url: r.url || "",
    thumbnail: r.thumbnail || "",
    creator: r.creator || "Unknown",
    creatorName: r.creatorName || r.creator || "Unknown",
    creatorFollowers: r.creatorFollowers || 0,
    rank: r.rank || 0,

    // Map Scores
    velocity_score: r.finalScore || r.viralScore || 0,
    final_score: r.finalScore || 0,

    // Age & Timestamp
    age_hours: r.ageInDays ? r.ageInDays * 24 : 24,
    age_label: r.age_label || "recent",
    postedAt: r.timestamp || new Date().toISOString(),
    postDay: r.postDay || "",

    // Engagement Stats
    engagement_rate: r.engagementRate || 0,
    comment_to_like_ratio: r.commentRatio || 0,
    is_quality_engagement: r.isQualityEngagement || false,
    views_over_expected: r.views_over_expected || 0,
    is_punching_above_weight: r.is_punching_above_weight || false,

    // Hashtags
    found_in_hashtags: r.foundInHashtags || [],
    hashtag_appearances: r.hashtagAppearances || 0,
    is_cross_hashtag_viral: r.isCrossHashtagViral || false,
    hashtags: r.hashtags || [],
    hashtagCount: r.hashtags?.length || 0,

    // Content
    caption: r.caption || "",
    captionHook: r.spokenHook || r.caption?.substring(0, 50) || "",
    spokenHook: r.spokenHook || "",
    hasTranscript: r.hasTranscript || false,
    transcript: r.transcript || "",
    wordsPerMinute: r.wordsPerMinute || 0,
    detectedLanguage: r.detectedLanguage || "en",
    captionLength: r.caption?.length || 0,
    duration: r.duration || 0,

    // Metrics
    views: r.views || 0,
    likes: r.likes || 0,
    comments: r.commentsCount ?? (Array.isArray(r.comments) ? r.comments.length : 0),
    shares: r.shares || 0,
    saves: r.saves || 0,

    // Audio
    audio: r.audio || { songName: "Original Audio", artistName: "Unknown", isOriginal: true },

    performanceScore: r.performanceScore || 1
});

// Helper to map Baap scripts to ScriptIdea interface
const mapBaapScript = (s: any): ScriptIdea => ({
    type: "video_script",
    rank: s.rank || 0,
    topic_title: s.topic_title || "",
    script_title: s.script_title || "",
    viral_potential_score: s.viral_potential_score || 0,
    estimated_duration: s.estimated_duration || "",
    full_text: s.full_script || "",
    script_word_count: s.full_script ? s.full_script.split(' ').length : 0,
    script_hook: s.script_breakdown?.hook || "",
    script_buildup: s.script_breakdown?.buildup || "",
    script_value: s.script_breakdown?.value || "",
    script_cta: s.script_breakdown?.cta || "",
    caption_full: s.caption?.full_caption || "",
    caption_first_line: s.caption?.first_line_hook || "",
    hashtags_primary: (s.hashtags?.primary || []).join(" "),
    hashtags_niche: "", // Not explicitly in source
    hashtags_trending: (s.hashtags?.trending || []).join(" "),
    hashtags_all: [...(s.hashtags?.primary || []), ...(s.hashtags?.trending || [])].join(" "),
    hashtags_count: ((s.hashtags?.primary || []).length + (s.hashtags?.trending || []).length),
    target_audience: s.metadata?.target_audience || "",
    emotional_trigger: s.metadata?.emotional_trigger || "",
    content_gap_addressed: s.metadata?.content_gap_addressed || "",
    why_this_works: s.metadata?.why_this_works || "",
    competitor_reference: "", // Not explicitly in source
    visual_storyboard: {
        opening_frame: s.visual_storyboard?.opening_frame || "",
        main_visual_style: s.visual_storyboard?.main_visual_style || "",
        b_roll_suggestions: typeof s.visual_storyboard?.b_roll_suggestions === 'string'
            ? [s.visual_storyboard.b_roll_suggestions]
            : (s.visual_storyboard?.b_roll_suggestions || [])
    },
    audio_vibe: s.audio_vibe || "",
    generatedAt: new Date().toISOString()
});


export const getTrendstaData = (): TrendstaData => {
    // 1. Get Base Data reliably
    let baseData: TrendstaData;

    if (Array.isArray(sourceFinal)) {
        baseData = sourceFinal[0];
    } else {
        baseData = sourceFinal;
    }

    // Safety check
    if (!baseData) {
        console.error("Critical: Base Data failed to load.");
        baseData = {} as TrendstaData;
    }

    // 2. Extract Reels from Baap file
    // Handle array structure of baap file
    const baapRoot = Array.isArray(sourceBaap) ? sourceBaap[0] : sourceBaap;

    const rawBaapReels = baapRoot.niche_research_json?.reels || [];
    const mappedReels = rawBaapReels.map(mapBaapReel);

    // 3. Extract Instagram Insights from Baap file (overall_strategy)
    const baapStrategy = baapRoot.overall_strategy || {};

    const insightsArray = baapStrategy.instagram_niche_insights || [];

    // 4. Format for SmartInsightsView ("Instagram Strategy Blueprint")
    // Parser expects: "1. Title → Evidence: ... → Action: ..."
    const smartInsightsString = insightsArray
        .map((i: any, idx: number) => `${idx + 1}. ${i.insight} → Evidence: ${i.evidence} → Action: ${i.action}`)
        .join('\n');

    // 5. Format for ResearchSummaryView ("Execution Plan")
    // Parser expects: "Key: Value" lines
    const researchViewString = insightsArray
        .map((i: any) => `Insight: ${i.insight}\nAction: ${i.action}\nEvidence: ${i.evidence}`)
        .join('\n');

    // --- Competitor Data Migration ---
    // A. Reels
    // User requested "competitor_research_json", but file analysis suggests "user_research_json" might contain the target reels.
    // robust fallback to ensure data loads.
    const baapCompetitorReels = baapRoot.competitor_research_json?.reels || baapRoot.user_research_json?.reels || [];
    const mappedCompetitorReels = baapCompetitorReels.map(mapBaapReel);

    // B. AI Insights (competitor_reverse_engineering)
    // Corrected Path: baap -> overall_strategy -> competitor_reverse_engineering
    const baapCompInsights = baapRoot.overall_strategy?.competitor_reverse_engineering || [];

    // Format for SmartInsightsView (Competitor Theme)
    // Map: Tactic -> Title, Why -> Evidence, Diff -> Action
    // Parser expects: "1. Title → Evidence: ... → Action: ..."
    const competitorInsightsString = baapCompInsights
        .map((i: any, idx: number) => `${idx + 1}. [${i.competitor_name || 'Competitor'}] ${i.tactic_observed} → Evidence: ${i.why_it_worked} → Action: ${i.differentiation_plan}`)
        .join('\n');

    // E. Viral Triggers & Content Gap
    const viralTriggers = baapStrategy.viral_triggers || [];
    const viralTriggersString = viralTriggers.map((v: any) => `• ${v.trigger}: ${v.why_works}`).join("\n\n");

    const contentGap = baapStrategy.content_gap || {};
    const contentGapString = contentGap.gap
        ? `Gap: ${contentGap.gap}\n\nOpportunity: ${contentGap.opportunity}`
        : "";

    // 6. Return merged data

    // C. Script Ideas
    let baapScripts = baapRoot.script_suggestion || baapRoot.script_suggestions || [];

    // Ensure it's an array (handle single object case)
    if (!Array.isArray(baapScripts)) {
        baapScripts = [baapScripts];
    }

    const mappedScripts = baapScripts.map(mapBaapScript);

    return {
        ...baseData,
        // Override Niche Research Reels
        niche_research: {
            ...(baseData.niche_research || {}),
            reels: mappedReels
        },
        // Override Competitor Research Reels
        competitor_research: {
            ...(baseData.competitor_research || {}),
            reels: mappedCompetitorReels
        },
        // Override Script Ideas
        LLM_script_ideas: mappedScripts.length > 0 ? mappedScripts : (baseData.LLM_script_ideas || []),

        // Override Summary Fields
        llm_research_summary: (baseData.llm_research_summary || []).map(summary => ({
            ...summary,
            // Instagram Insights
            posting_times: researchViewString || summary.posting_times,
            instagram_insights: smartInsightsString || summary.instagram_insights,
            // Competitor Insights
            competitor_insights: competitorInsightsString || summary.competitor_insights,
            // New Fields - Pass Raw Structured Data
            viral_triggers: baapStrategy.viral_triggers || [],
            content_gap: baapStrategy.content_gap || {},
            hook_formula: baapStrategy.viral_hook_formula || {},

            // Map structured execution plan
            execution_plan: (baapRoot.overall_strategy && baapRoot.overall_strategy.execution_plan) ? {
                immediate_action_checklist: baapRoot.overall_strategy.execution_plan.immediate_action_checklist || [],
                production_spec_sheet: baapRoot.overall_strategy.execution_plan.production_spec_sheet || {},
                experiment_this: baapRoot.overall_strategy.execution_plan.experiment_this || {}
            } : summary.execution_plan,

        })),

        // Dashboard Graphs
        dashboard_graphs: baapStrategy.dashboard_graphs,

        // Top Hooks
        hooks: (baapRoot.hooks || baapStrategy.hooks || []).map((h: any) => ({
            rank: h.rank,
            hook: h.hook,
            reelcaption: h.reelcaption,
            sourceusername: h.sourceusername
        })),
    };
};
