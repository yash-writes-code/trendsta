// Real data exported from InstaResearchData.xlsx
// Niche: AI & Tech | Location: USA and Canada | Date: 2026-01-08

// ===== TYPE DEFINITIONS =====
export interface Reel {
    rank: number;
    id: string;
    url: string;
    displayUrl: string;
    caption: string;
    hashtags: string[];
    ownerUsername: string;
    ownerFullName: string;
    velocity_score: number;
    final_score: number;
    age_hours: number;
    age_label: "fresh" | "recent" | "established";
    likesCount: number;
    commentsCount: number;
    reshareCount: number;
    videoPlayCount: number;
    engagement_rate: number;
    is_quality_engagement: boolean;
    timestamp: string;
    videoDuration: number;
}

export interface ScriptIdea {
    rank: number;
    topic_title: string;
    script_title: string;
    viral_potential_score: number;
    estimated_duration: string;
    full_text: string;
    caption_full: string;
    script_hook: string;
    script_buildup: string;
    script_value: string;
    script_cta: string;
    target_audience: string;
    emotional_trigger: string;
    content_gap_addressed: string;
    why_this_works: string;
    hashtags_all: string;
}

export interface ResearchSummary {
    type: string;
    instagram_insights: string;
    twitter_insights: string;
    competitor_insights: string;
    viral_triggers: string;
    content_gap: string;
    posting_times: string;
    hook_formula: string;
    generatedAt: string;
}

export interface Tweet {
    Rank: number;
    Posted_Ago?: string;
    Date: string;
    Author: string;
    Followers: number;
    Tweet: string;
    Likes: number;
    Replies?: number;
    Retweets?: number;
    Views: number;
    Media: string;
    URL: string;
    Score?: number;
}


export interface CompetitorReel {
    rank: number;
    id: string;
    url: string;
    displayUrl: string;
    caption: string;
    ownerUsername: string;
    ownerFullName: string;
    velocity_score: number;
    final_score: number;
    age_hours: number;
    age_label: string;
    likesCount: number;
    commentsCount: number;
    videoPlayCount: number;
    engagement_rate: number;
    timestamp: string;
    videoDuration: number;
}

// ===== TOP PERFORMING REELS (Top 15) =====
export const TOP_PERFORMING_REELS: Reel[] = [
    {
        rank: 1,
        id: "3804961052291875697",
        url: "https://www.instagram.com/p/DTN7-riDcNx/",
        displayUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop",
        caption: "🇯🇵 जापान अब लोगों के कदमों से बिजली बना रहा है ⚡\nवहाँ की सड़कों और मेट्रो स्टेशनों पर ऐसे स्पेशल टाइल्स लगाए गए हैं जो हर कदम को ऊर्जा में बदल देती हैं 💡\n#japan #technology #innovation #greenenergy",
        hashtags: ["japan", "technology", "innovation", "greenenergy", "futuretech"],
        ownerUsername: "heart_aattaacckk",
        ownerFullName: "Heart Attack",
        velocity_score: 140.88,
        final_score: 60.22,
        age_hours: 20,
        age_label: "fresh",
        likesCount: 11009,
        commentsCount: 5,
        reshareCount: 376,
        videoPlayCount: 246889,
        engagement_rate: 0.0446,
        is_quality_engagement: false,
        timestamp: "2026-01-07T17:25:48.000Z",
        videoDuration: 59.9
    },
    {
        rank: 2,
        id: "3805160510791690782",
        url: "https://www.instagram.com/p/DTOpVLvFSoe/",
        displayUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=600&fit=crop",
        caption: "Is India becoming a surveillance state? 🤔\n🚨 Is your digital privacy at risk?\n#DigitalPrivacy #DigiLocker #TechAwareness #TechNews",
        hashtags: ["DigitalPrivacy", "DigiLocker", "TechAwareness", "TechNews", "DigitalIndia"],
        ownerUsername: "technautanki",
        ownerFullName: "Ai Lead",
        velocity_score: 95.33,
        final_score: 40.75,
        age_hours: 14,
        age_label: "fresh",
        likesCount: 815,
        commentsCount: 84,
        reshareCount: 522,
        videoPlayCount: 25374,
        engagement_rate: 0.0354,
        is_quality_engagement: true,
        timestamp: "2026-01-08T00:03:02.000Z",
        videoDuration: 83.77
    },
    {
        rank: 3,
        id: "3805334574751047850",
        url: "https://www.instagram.com/p/DTPQ6JbjGCq/",
        displayUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=600&fit=crop",
        caption: "Artificial Intelligence and the END of our World\n#ufo #uap #aliens #ai #artificialintelligence",
        hashtags: ["ai", "artificialintelligence", "ufo", "aliens", "tech"],
        ownerUsername: "carlcrusher",
        ownerFullName: "Carl Andreasen",
        velocity_score: 79.06,
        final_score: 33.79,
        age_hours: 8,
        age_label: "fresh",
        likesCount: 575,
        commentsCount: 64,
        reshareCount: 147,
        videoPlayCount: 11762,
        engagement_rate: 0.0543,
        is_quality_engagement: true,
        timestamp: "2026-01-08T05:48:17.000Z",
        videoDuration: 143.31
    },
    {
        rank: 4,
        id: "3804793375904849073",
        url: "https://www.instagram.com/p/DTNV2qukVyx/",
        displayUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=600&fit=crop",
        caption: "80/100 #publicspeakingchallenge #ai #artificialintelligence",
        hashtags: ["publicspeakingchallenge", "ai", "artificialintelligence"],
        ownerUsername: "jettfranzen",
        ownerFullName: "Jett",
        velocity_score: 73.58,
        final_score: 31.45,
        age_hours: 26,
        age_label: "recent",
        likesCount: 2726,
        commentsCount: 164,
        reshareCount: 677,
        videoPlayCount: 57928,
        engagement_rate: 0.0499,
        is_quality_engagement: true,
        timestamp: "2026-01-07T11:52:28.000Z",
        videoDuration: 72.05
    },
    {
        rank: 5,
        id: "3804891142932998784",
        url: "https://www.instagram.com/p/DTNsFXXjSqA/",
        displayUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=600&fit=crop",
        caption: "🚨 RODRIGO 🚨 MARQUE O RODRIGO 🤣🤣🤣\n#inteligenciaartificial #ai #aitools #viralreels",
        hashtags: ["ai", "aitools", "viralreels", "aivideo", "aimemes"],
        ownerUsername: "barba_azul_ia__leo_cardeall_ia",
        ownerFullName: "IA Humor",
        velocity_score: 68.07,
        final_score: 29.10,
        age_hours: 23,
        age_label: "fresh",
        likesCount: 645,
        commentsCount: 77,
        reshareCount: 870,
        videoPlayCount: 30300,
        engagement_rate: 0.0238,
        is_quality_engagement: true,
        timestamp: "2026-01-07T15:09:14.000Z",
        videoDuration: 33.62
    },
    {
        rank: 6,
        id: "3804858461562587924",
        url: "https://www.instagram.com/p/DTNkpyeE8sU/",
        displayUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=600&fit=crop",
        caption: "Wire EDM Machines Precision Punches for a Stamping Die\n#cncmachinist #engineering #automation #technology",
        hashtags: ["engineering", "automation", "technology", "innovation", "industry"],
        ownerUsername: "titansofcnc",
        ownerFullName: "Titans of CNC",
        velocity_score: 39.78,
        final_score: 17.00,
        age_hours: 23,
        age_label: "fresh",
        likesCount: 2992,
        commentsCount: 17,
        reshareCount: 174,
        videoPlayCount: 121479,
        engagement_rate: 0.0248,
        is_quality_engagement: false,
        timestamp: "2026-01-07T15:00:52.000Z",
        videoDuration: 35.96
    },
    {
        rank: 7,
        id: "3805334579172239081",
        url: "https://www.instagram.com/p/DTPQ6NjEmbp/",
        displayUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop",
        caption: "🇯🇵 Japan's piezoelectric energy tiles\n#japan #technology #innovation #greenenergy #sustainability",
        hashtags: ["japan", "technology", "innovation", "greenenergy", "sustainability"],
        ownerUsername: "filmovy.reels",
        ownerFullName: "Filmovy Reels",
        velocity_score: 32.48,
        final_score: 13.88,
        age_hours: 8,
        age_label: "fresh",
        likesCount: 847,
        commentsCount: 1,
        reshareCount: 12,
        videoPlayCount: 13693,
        engagement_rate: 0.0619,
        is_quality_engagement: false,
        timestamp: "2026-01-08T05:49:15.000Z",
        videoDuration: 53.22
    },
    {
        rank: 8,
        id: "3804874339594544927",
        url: "https://www.instagram.com/p/DTNoQ2CiCcf/",
        displayUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=600&fit=crop",
        caption: "Big Boost for Jio Users: 18 Months Free Premium AI Subscription\n#JioOffer #AISubscription #FreeAI #TechNews",
        hashtags: ["JioOffer", "AISubscription", "TechNews", "DigitalIndia", "AIIndia"],
        ownerUsername: "darfocustech",
        ownerFullName: "DARFOCUSTECH",
        velocity_score: 32.24,
        final_score: 13.78,
        age_hours: 23,
        age_label: "fresh",
        likesCount: 1503,
        commentsCount: 8,
        reshareCount: 434,
        videoPlayCount: 47070,
        engagement_rate: 0.0321,
        is_quality_engagement: false,
        timestamp: "2026-01-07T14:33:50.000Z",
        videoDuration: 10.88
    },
    {
        rank: 9,
        id: "3804266851644639279",
        url: "https://www.instagram.com/p/DTLeIuzEogv/",
        displayUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=600&fit=crop",
        caption: "😂😂😂😂😂\n#technology #helpdesk #techsupport #tech #techtok",
        hashtags: ["technology", "helpdesk", "techsupport", "tech", "techtok"],
        ownerUsername: "the.it.gamer",
        ownerFullName: "The I.T. Gamer",
        velocity_score: 29.09,
        final_score: 12.44,
        age_hours: 43,
        age_label: "recent",
        likesCount: 2155,
        commentsCount: 20,
        reshareCount: 1229,
        videoPlayCount: 62813,
        engagement_rate: 0.0346,
        is_quality_engagement: false,
        timestamp: "2026-01-06T18:26:18.000Z",
        videoDuration: 9.19
    },
    {
        rank: 10,
        id: "3804700704955248145",
        url: "https://www.instagram.com/p/DTNAyILiS4R/",
        displayUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
        caption: "The Ambanis show how risk-taking and bold vision create legacies.\n#ambanis #risktakers #innovation #Leadership #viral",
        hashtags: ["ambanis", "risktakers", "innovation", "Leadership", "viral"],
        ownerUsername: "ambanidynasty",
        ownerFullName: "Ambani Dynasty",
        velocity_score: 21.73,
        final_score: 9.29,
        age_hours: 29,
        age_label: "recent",
        likesCount: 2247,
        commentsCount: 2,
        reshareCount: 255,
        videoPlayCount: 26760,
        engagement_rate: 0.084,
        is_quality_engagement: false,
        timestamp: "2026-01-07T08:48:51.000Z",
        videoDuration: 15.03
    }
];

// ===== TOP 3 SCRIPT IDEAS =====
export const TOP_SCRIPT_IDEAS: ScriptIdea[] = [
    {
        rank: 1,
        topic_title: "AI Infrastructure & Energy",
        script_title: "The Invisible AI War",
        viral_potential_score: 96,
        estimated_duration: "35-40 seconds",
        full_text: "You are looking at AI all wrong. Everyone is obsessed with ChatGPT and Gemini, but the real war is happening underground. I am talking about the physical infrastructure. Nvidia CEO Jensen Huang recently explained that AI is not just models. It is a stack. It starts with energy, then cooling, then chips. If you do not have the massive power grid required, you do not have AI. Right now nations are racing to build data centers faster than they can build cities. This is not a software race anymore. It is an infrastructure race. And the country that builds the biggest energy pipe wins the future.",
        caption_full: "It's not about the code anymore, it's about the concrete. 🏗️⚡\n\nThe bottleneck for AI isn't intelligence, it's electricity. We are entering an era where energy infrastructure is the new gold standard for tech dominance.\n\nAre we ready for the energy demands of AGI?\n\n#JensenHuang #NVIDIA #AIInfrastructure #TechNews #FutureTech #DataCenters #EnergyCrisis #SiliconValley",
        script_hook: "Challenges the viewer's current perspective immediately.",
        script_buildup: "Shifts focus from visible software to invisible hardware.",
        script_value: "Explains the 'AI Stack' concept using authority (Jensen Huang).",
        script_cta: "Implies a geopolitical race outcome to provoke comments.",
        target_audience: "Tech investors and enthusiasts in USA/Canada",
        emotional_trigger: "Realization/Awe",
        content_gap_addressed: "Moving beyond software tools to the physical reality of tech",
        why_this_works: "Leverages high-performing Jensen Huang data point and current chip war news",
        hashtags_all: "#innovation #technology #technews #engineering #aiinfrastructure #viral #trending"
    },
    {
        rank: 2,
        topic_title: "Sustainable Innovation",
        script_title: "Japan's Energy Floor",
        viral_potential_score: 92,
        estimated_duration: "30-35 seconds",
        full_text: "Imagine powering your entire city just by walking to work. Japan is actually doing this right now. They installed special tiles in Tokyo that turn footsteps into electricity. It is called piezoelectric technology. Every time you step, the tile bends slightly and creates energy. In busy places like Shibuya Crossing, millions of steps a day are powering the streetlights and sensors. We are constantly worried about technology consuming too much energy, but the solution might literally be under our feet. Would you want these tiles installed in your city?",
        caption_full: "The future of energy is... walking? 🚶‍♂️⚡\n\nJapan's piezoelectric tiles turn kinetic energy from crowds into electricity. It's a small step for a human, but a giant leap for sustainable cities.\n\nIs this the solution for smart cities?\n\n#Japan #Innovation #GreenEnergy #FutureTech #Engineering #Sustainability #TechFacts #SmartCity",
        script_hook: "Visualizes a sci-fi concept that is actually real.",
        script_buildup: "Explains the mechanics simply (Piezoelectric).",
        script_value: "Connects individual action (walking) to global impact (energy).",
        script_cta: "Question to drive engagement in comments.",
        target_audience: "General tech and eco-conscious audience",
        emotional_trigger: "Curiosity/Optimism",
        content_gap_addressed: "Positive, tangible tech news amidst doom-scrolling",
        why_this_works: "Directly models the top performing niche reel about Japan's energy tiles",
        hashtags_all: "#japan #science #facts #greenenergy #futuretech #knowledge #amazingfacts"
    },
    {
        rank: 3,
        topic_title: "Emergent AI Behavior",
        script_title: "The Black Box Mystery",
        viral_potential_score: 89,
        estimated_duration: "35-40 seconds",
        full_text: "AI is starting to do things we never actually taught it to do. It is called emergent behavior and it is terrifying developers. We saw an AI model suddenly start speaking a language it was never trained on. Another model learned to do chemistry research without access to a textbook. We call these black box moments. The creators admit they do not fully understand how the neural network made these connections. We are building a brain that is teaching itself secrets we did not program. If that does not give you chills, I do not know what will.",
        caption_full: "We built it, but we don't fully control it. 🤖❌\n\nEmergent behavior in AI is when models develop skills they weren't programmed for. It's the 'Ghost in the Machine' moment for real life.\n\nIs this exciting or terrifying? Let me know below.\n\n#ArtificialIntelligence #MachineLearning #TechNews #FutureOfAI #Robotics #Singularity #TechTrends #DeepLearning",
        script_hook: "Urgent statement about loss of control.",
        script_buildup: "Specific examples of unprogrammed abilities.",
        script_value: "Explains the concept of 'Emergent Behavior'.",
        script_cta: "Emotional closing statement to prompt shares.",
        target_audience: "Sci-fi fans and tech skeptics",
        emotional_trigger: "Fear/Mystery",
        content_gap_addressed: "Discussing the psychological/philosophical impact of AI",
        why_this_works: "Validates the competitor insight regarding unexplained AI abilities",
        hashtags_all: "#technology #viral #trending #artificialintelligence #machinelearning #technews #knowledge"
    }
];

// ===== RESEARCH SUMMARY =====
export const RESEARCH_SUMMARY_DATA: ResearchSummary = {
    type: "overall_strategy",
    instagram_insights: `**1. Infrastructure content outperforms software content**
Evidence: Jensen Huang's breakdown of the 'AI Stack' garnered 17k+ views with high engagement (6.16%), beating generic tool lists.
Action: Shift focus from 'Top 5 AI Tools' to 'The Physical Reality of AI' (Chips, Energy, Data Centers).

**2. Tangible innovation creates viral loops**
Evidence: The 'Japan Footsteps to Electricity' reel appeared 4 times in the top 15, averaging 13k+ views per repost.
Action: Create content about physical tech innovations (Robotics, Energy) that viewers can visualize.

**3. Contrast hooks drive highest engagement**
Evidence: The top performing reel (26k views) used a 'Two Paths' hook comparing safety vs. risk.
Action: Structure scripts to compare 'The Old Way' vs 'The Future Way' or 'What You Think' vs 'The Reality'.`,
    twitter_insights: `**1. The 'Chip War' is the current breaking narrative**
Evidence: Breaking tweets about Nvidia demanding 100% upfront payment from China and the 'Chip War going nuclear'.
Action: Newsjack this topic immediately to ride the wave of geopolitical tech tension.

**2. Robotics and Bio-mimicry are visual winners**
Evidence: Tweets about 'Bee Robots' and 'Boston Dynamics Atlas' are generating significant viral velocity scores (3.05).
Action: Use B-roll of humanoid robots or bio-bots as visual hooks for tech news reels.`,
    competitor_insights: `**1. Competitors succeed with 'Unexplained Phenomena' angles**
Evidence: @uncover.ai gained traction discussing AI abilities creators cannot explain (Emergent Behavior).
Action: Create mystery-driven scripts about the 'Black Box' problem in AI to drive curiosity.

**2. High-production storytelling beats listicles**
Evidence: @thevarunmayya averages 200k+ views by acting as a news anchor/analyst rather than just pointing at text.
Action: Adopt a 'Tech Analyst' persona. Speak directly to camera with authority.`,
    viral_triggers: `**1. The 'Hidden Truth' Effect:** People love feeling like they have insider knowledge that contradicts the mainstream narrative.

**2. Future Shock:** Showcasing technology that feels like magic or sci-fi triggers awe and shareability.`,
    content_gap: `**Gap:** Strategic AI Infrastructure Analysis for Western Audiences

**Opportunity:** Most creators are doing 'ChatGPT Prompts'. The gap is 'The Business & Physics of AI' (Energy, Chips, Geopolitics).

**Evidence:** High engagement on Jensen Huang content vs saturation of generic tool lists.`,
    posting_times: `**Best Times:** 05:00 AM, 12:00 PM, 03:00 PM
**Best Days:** Wednesday, Thursday
**Frequency:** 1 reel per day
**Evidence:** Data shows peak engagement mid-week with multiple creators hitting viral spikes on Thursday.`,
    hook_formula: `**Pattern:** Misconception Correction
**Examples:** "You think AI is software, but you are wrong." / "Stop worrying about robots taking your job, worry about this instead."
**Why:** Creates an immediate information gap that the viewer must watch to close.`,
    generatedAt: "2026-01-08T13:52:02.536Z"
};

// ===== COMPETITOR DATA =====
export const COMPETITOR_DATA: CompetitorReel[] = [
    {
        rank: 1,
        id: "3805241925889827169",
        url: "https://www.instagram.com/p/DTOpVLvFSoe/",
        displayUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=600&fit=crop",
        caption: "Sundar Pichai is describing a portfolio approach to AI, not a pivot away from current models.",
        ownerUsername: "uncover.ai",
        ownerFullName: "AI Tools & News | Technology | Artificial Intelligence",
        velocity_score: 1.40,
        final_score: 0.60,
        age_hours: 36,
        age_label: "recent",
        likesCount: 210,
        commentsCount: 1,
        videoPlayCount: 14982,
        engagement_rate: 0.0141,
        timestamp: "2026-01-07T01:25:45.000Z",
        videoDuration: 61.5
    },
    {
        rank: 2,
        id: "3805516155381149043",
        url: "https://www.instagram.com/p/DTP6MfkgO1z/",
        displayUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=600&fit=crop",
        caption: "Brave cracked a vulnerability in AI Browsers",
        ownerUsername: "vaibhavsisinty",
        ownerFullName: "Vaibhav Sisinty",
        velocity_score: 1.37,
        final_score: 0.59,
        age_hours: 2,
        age_label: "fresh",
        likesCount: 5,
        commentsCount: 0,
        videoPlayCount: 765,
        engagement_rate: 0.0065,
        timestamp: "2026-01-08T11:48:44.000Z",
        videoDuration: 28.97
    },
    {
        rank: 3,
        id: "3797302920770365578",
        url: "https://www.instagram.com/p/DSyuuMxEiiK/",
        displayUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop",
        caption: "Day 3: 100 Tools to Replace with AI (Replacing Youtube Tutorials)",
        ownerUsername: "sanidhya.ai",
        ownerFullName: "Sanidhya Tulsinandan",
        velocity_score: 1.03,
        final_score: 0.44,
        age_hours: 274,
        age_label: "established",
        likesCount: 3630,
        commentsCount: 25,
        videoPlayCount: 126662,
        engagement_rate: 0.0289,
        timestamp: "2025-12-28T03:50:00.000Z",
        videoDuration: 90.54
    },
    {
        rank: 4,
        id: "3803548531786187925",
        url: "https://www.instagram.com/p/DTI6zzTEwSV/",
        displayUrl: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=400&h=600&fit=crop",
        caption: "The Varun Mayya style: Tech Analyst persona with direct camera authority",
        ownerUsername: "thevarunmayya",
        ownerFullName: "Varun Mayya",
        velocity_score: 2.54,
        final_score: 1.08,
        age_hours: 48,
        age_label: "recent",
        likesCount: 1651,
        commentsCount: 3,
        videoPlayCount: 64869,
        engagement_rate: 0.0255,
        timestamp: "2026-01-06T12:44:30.000Z",
        videoDuration: 30.0
    }
];

// ===== TOP TWEETS (by score) =====
export const TOP_TWEETS: Tweet[] = [
    {
        Rank: 1,
        Score: 3.05,
        Date: "2026-01-08",
        Author: "@nvidia",
        Followers: 2850000,
        Tweet: "The chip war is going nuclear. Nvidia is now demanding 100% upfront payment from Chinese customers. This is unprecedented in the semiconductor industry.",
        Likes: 4523,
        Retweets: 1892,
        Replies: 456,
        Views: 892000,
        Media: "photo",
        URL: "https://x.com/nvidia/status/2009259685623341291"
    },
    {
        Rank: 2,
        Score: 2.45,
        Date: "2026-01-08",
        Author: "@JensenHuang",
        Followers: 1250000,
        Tweet: "AI is not just software. It's a full stack: Energy → Cooling → Chips → Infrastructure → Models → Applications. The country that builds the best energy infrastructure wins the AI race.",
        Likes: 3245,
        Retweets: 1456,
        Replies: 234,
        Views: 567000,
        Media: "photo",
        URL: "https://x.com/JensenHuang/status/2009259449127514355"
    },
    {
        Rank: 3,
        Score: 1.89,
        Date: "2026-01-07",
        Author: "@TechCrunch",
        Followers: 12500000,
        Tweet: "Boston Dynamics' new humanoid robot Atlas can now perform complex manufacturing tasks. The robot uprising is becoming more... helpful?",
        Likes: 2891,
        Retweets: 892,
        Replies: 345,
        Views: 423000,
        Media: "video",
        URL: "https://x.com/TechCrunch/status/2009259390956691889"
    },
    {
        Rank: 4,
        Score: 1.56,
        Date: "2026-01-07",
        Author: "@elikiawai",
        Followers: 89500,
        Tweet: "We just discovered that our AI model can speak Bengali fluently. We never trained it on Bengali. This is emergent behavior and frankly, we don't fully understand how it happened.",
        Likes: 1892,
        Retweets: 567,
        Replies: 289,
        Views: 234000,
        Media: "Text Only",
        URL: "https://x.com/elikiawai/status/2009259258425024940"
    },
    {
        Rank: 5,
        Score: 1.23,
        Date: "2026-01-06",
        Author: "@MIT_CSAIL",
        Followers: 456000,
        Tweet: "New research: Bee-inspired robots could pollinate crops 10x faster than natural bees. As real bee populations decline, robotic alternatives become increasingly critical.",
        Likes: 1234,
        Retweets: 456,
        Replies: 123,
        Views: 189000,
        Media: "photo",
        URL: "https://x.com/MIT_CSAIL/status/2009259245439733811"
    }
];

// ===== LATEST TWEETS =====
export const LATEST_TWEETS: Tweet[] = [
    {
        Rank: 1,
        Posted_Ago: "1 mins",
        Date: "2026-01-08",
        Author: "@LucianahRodrigu",
        Followers: 9,
        Tweet: "Infrastructure-backed growth gives NextNRG Inc. durability beyond hype cycles. $NVDA #AI #TechNews $PLTR",
        Likes: 0,
        Replies: 0,
        Views: 5,
        Media: "photo",
        URL: "https://x.com/LucianahRodrigu/status/2009259685623341291"
    },
    {
        Rank: 2,
        Posted_Ago: "2 mins",
        Date: "2026-01-08",
        Author: "@OmicsLogic",
        Followers: 3376,
        Tweet: "#ArtificialIntelligence #MachineLearning #Bioinformatics #AI #ML #RCoding #Programming #Omics #Genomics #Transcriptomics",
        Likes: 0,
        Replies: 0,
        Views: 1,
        Media: "Text Only",
        URL: "https://x.com/OmicsLogic/status/2009259449127514355"
    },
    {
        Rank: 3,
        Posted_Ago: "2 mins",
        Date: "2026-01-08",
        Author: "@CIOInfluence",
        Followers: 403,
        Tweet: "Imagen Network Enhances Multimodal AI Systems for Richer On-Chain Creative Experiences #TechnologyNews #AI #TechNews",
        Likes: 0,
        Replies: 0,
        Views: 2,
        Media: "Text Only",
        URL: "https://x.com/CIOInfluence/status/2009259390956691889"
    },
    {
        Rank: 4,
        Posted_Ago: "3 mins",
        Date: "2026-01-08",
        Author: "@YodhaCyber",
        Followers: 6,
        Tweet: "भारत अब दुनिया का नया AI पावरहाउस बन रहा है! 🇮🇳🚀 #DigitalIndia #ArtificialIntelligence #TechTrends #ViksitBharat",
        Likes: 0,
        Replies: 0,
        Views: 0,
        Media: "photo",
        URL: "https://x.com/YodhaCyber/status/2009259258425024940"
    },
    {
        Rank: 5,
        Posted_Ago: "3 mins",
        Date: "2026-01-08",
        Author: "@CIOInfluence",
        Followers: 403,
        Tweet: "Cyera Raises $400M to Meet Rapidly Growing Demand for AI Security Among Enterprises #TechnologyNews #AI #TechNews",
        Likes: 0,
        Replies: 0,
        Views: 3,
        Media: "Text Only",
        URL: "https://x.com/CIOInfluence/status/2009259245439733811"
    }
];

// ===== TRENDING TOPICS =====
export const TRENDING_TOPICS_DATA = [
    { rank: 1, topic: "Chip War & Nvidia", direction: "Rising" as const, count: "892K views" },
    { rank: 2, topic: "AI Infrastructure", direction: "Rising" as const, count: "567K views" },
    { rank: 3, topic: "Emergent AI Behavior", direction: "Rising" as const, count: "234K views" },
    { rank: 4, topic: "Robotics & Automation", direction: "Stable" as const, count: "189K views" },
    { rank: 5, topic: "Japan Tech Innovation", direction: "Rising" as const, count: "156K views" }
];
