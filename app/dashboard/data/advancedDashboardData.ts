
import { Sparkles, TrendingUp, Users, Zap, Clock, Bookmark, AlertTriangle } from "lucide-react";

// --- Script Lab Data ---
export const SCRIPT_LAB_DATA = [
    {
        id: 1,
        title: "The AI Bubble Burst",
        viralScore: 94,
        hook: "Stop investing in AI tools. The bubble just burst, and nobody noticed.",
        whyThisWorks: "Contrarian take + Urgency. Challenges the current hype cycle immediately.",
        emotionalTrigger: "Fear of Missing Out / Fear of Loss",
        wordCount: 110,
        duration: "45s",
        contentGap: "Critical Analysis",
        value: "Explains why infrastructure > software layers for long term hold.",
        status: "ready"
    },
    {
        id: 2,
        title: "Coding is Dead?",
        viralScore: 88,
        hook: "If you are learning Python in 2026, you are already behind.",
        whyThisWorks: "Negative Frame + Specificity (Python). Triggers defensive engagement from devs.",
        emotionalTrigger: "Insecurity / Debate",
        wordCount: 125,
        duration: "52s",
        contentGap: "Career Futurology",
        value: "Pivot to 'System Architecture' instead of syntax memorization.",
        status: "draft"
    }
];

// --- Performance Doctor Data ---
export const PERFORMANCE_DATA = {
    viewGoal: "15,000",
    transcriptCoverage: 98.5,
    wpmData: [
        { wpm: 120, views: 2500 },
        { wpm: 135, views: 4200 },
        { wpm: 145, views: 8900 }, // Sweet spot
        { wpm: 150, views: 12500 }, // Peak
        { wpm: 160, views: 6000 }, // Too fast
        { wpm: 170, views: 3000 }
    ],
    velocityData: [
        { day: "Mon", velocity: 1.2 },
        { day: "Tue", velocity: 1.8 },
        { day: "Wed", velocity: 4.5 }, // Spikes
        { day: "Thu", velocity: 3.2 },
        { day: "Fri", velocity: 2.1 },
    ],
    punchingAboveWeight: [
        {
            id: 101,
            title: "Hardware > Software",
            views: "24.5K",
            avgViews: "8K",
            multiplier: "3.1x",
            reason: "Visual Hook + Fast Paced Editing"
        }
    ]
};

// --- Spy Glass Data ---
export const SPY_GLASS_DATA = {
    heatmap: [
        { day: "Mon", hour: 9, value: 20 },
        { day: "Mon", hour: 13, value: 60 },
        { day: "Mon", hour: 18, value: 40 },
        { day: "Tue", hour: 9, value: 30 },
        { day: "Tue", hour: 13, value: 85 }, // Hot
        { day: "Tue", hour: 18, value: 70 },
        { day: "Wed", hour: 13, value: 95 }, // Very Hot
        { day: "Wed", hour: 18, value: 90 },
        { day: "Thu", hour: 13, value: 80 },
        { day: "Fri", hour: 13, value: 65 },
    ],
    formatBreakdown: [
        { label: "Talking Head", value: 45, color: "#3b82f6" },
        { label: "Screen Share", value: 30, color: "#10b981" },
        { label: "Green Screen", value: 15, color: "#f59e0b" },
        { label: "Cinematic", value: 10, color: "#6366f1" }
    ],
    powerWords: [
        { text: "Secret", weight: 50 },
        { text: "Banned", weight: 35 },
        { text: "Exposed", weight: 45 },
        { text: "Free", weight: 40 },
        { text: "Mistake", weight: 30 },
        { text: "Warning", weight: 25 },
        { text: "Tutorial", weight: 20 },
    ],
    thiefGallery: [
        { creator: "@hormozi", hook: "I lost $100M doing this one thing..." },
        { creator: "@masse", hook: "Stop drinking coffee before 9am." },
        { creator: "@chemteacher", hook: "Do not mix these two household items." },
        { creator: "@techguy", hook: "This setting is draining your battery." }
    ],
    viralTriggers: [
        { title: "The Death Narrative", desc: "Declaring a popular tool/method 'dead' creates immediate curiosity." },
        { title: "The Us vs Them", desc: "Creating a tribe mentality (e.g. Designers vs Developers)." }
    ],
    highSignalTweets: [
        { author: "@levelsio", content: "Ship fast. Fix later.", bookmarks: 1205 },
        { author: "@shl", content: "Design is how it works, not how it looks.", bookmarks: 890 },
        { author: "@rauchg", content: "Next.js 15 is going to be wild.", bookmarks: 650 }
    ]
};
