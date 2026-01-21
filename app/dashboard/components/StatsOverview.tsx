import { Sparkles, Clock, Users, Zap } from "lucide-react";

export function StatsOverview() {
    const stats = [
        { label: "Scripts Ready", value: "3", icon: Sparkles, color: "var(--gradient-primary)" },
        { label: "Viral Score Avg", value: "92", icon: Zap, color: "var(--gradient-success)" },
        { label: "Target Audience", value: "Non-tech", icon: Users, color: "var(--gradient-info)" },
        { label: "Best Time", value: "6-9 PM", icon: Clock, color: "var(--gradient-warning)" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <div key={stat.label} className="stat-card hover-glow">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: stat.color }}
                        >
                            <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            <p className="text-xs text-slate-500">{stat.label}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Helper for Time of Day
export function getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
}
