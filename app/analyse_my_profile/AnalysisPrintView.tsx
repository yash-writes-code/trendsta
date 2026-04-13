"use client";
import React from "react";

// Mirrors the AnalysisData interface from page.tsx
interface AnalysisData {
  meta: {
    creator_handle: string;
    total_reels_analyzed: number;
    average_views: number;
    follower_count: number;
    report_tier: string;
  };
  sidebar_scoring: {
    virality_score: number;
    virality_label: string;
    virality_context: string;
    issues_found_count: number;
    metrics: {
      content_metrics_percentage: number;
      reach_efficiency: { status_label: string; percentage?: number };
      wpm_consistency: { status_label: string };
      snippet_duration: { status_label: string };
      ad_immunity: { status_label: string };
    };
    hook_power_percentage: number;
    ai_readiness_percentage: number;
  };
  main_analysis: {
    reach_efficiency_crisis: {
      current_ratio: number;
      industry_target_ratio: number;
      missed_views_calculated: { value: number };
    };
    llm_diagnostic: {
      strengths: Array<{ title: string; description: string; impact_level: string }>;
      critical_flaws: Array<{ title: string; description: string; impact_level: string }>;
    };
    performance_funnel: {
      viral_percentage: number;
      above_average_percentage: number;
      average_percentage: number;
      underperforming_percentage: number;
    };
    topic_performance_ladder: {
      topics: Array<{
        topic_label: string;
        multiplier_score: string;
        percentile: { value: number };
      }>;
    };
    hook_power_analysis: {
      top_hook: { text: string; views: number; score: number };
      worst_hook: { text: string; views: number; score: number };
    };
    wpm_consistency_band: {
      min_wpm: number;
      max_wpm: number;
      is_pace_a_problem: boolean;
      band_interpretation: { value: string };
    };
    duration_sweet_spot: {
      dead_zone_range: string;
      optimal_zones: string[];
    };
    audience_engagement_map: {
      segments: Array<{ segment_name: string; percentage: number }>;
    };
  };
}

interface Props {
  data: AnalysisData;
  printRef: React.RefObject<HTMLDivElement>;
}

const fmt = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "k";
  return String(n);
};
const fmtComma = (n: number) => new Intl.NumberFormat("en-US").format(n);

/* ── tiny reusable bits ──────────────────────────────────── */
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2
    style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#6b7280",
      marginBottom: 10,
      display: "flex",
      alignItems: "center",
      gap: 6,
    }}
  >
    <span
      style={{
        display: "inline-block",
        width: 3,
        height: 12,
        background: "#f97316",
        borderRadius: 2,
      }}
    />
    {children}
  </h2>
);

const Card = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      padding: "14px 16px",
      ...style,
    }}
  >
    {children}
  </div>
);

const Badge = ({
  children,
  color = "#f97316",
  bg = "#fff7ed",
}: {
  children: React.ReactNode;
  color?: string;
  bg?: string;
}) => (
  <span
    style={{
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color,
      background: bg,
      border: `1px solid ${color}33`,
      borderRadius: 99,
      padding: "2px 8px",
    }}
  >
    {children}
  </span>
);

/* ── The hidden printable component ─────────────────────── */
export const AnalysisPrintView = React.forwardRef<HTMLDivElement, { data: AnalysisData }>(
  ({ data }, ref) => {
    const score = data.sidebar_scoring.virality_score;
    const segments = data.main_analysis.audience_engagement_map.segments;
    const s0 = segments[0]?.percentage ?? 40;
    const s1 = segments[1]?.percentage ?? 35;

    return (
      <div
        ref={ref}
        id="print-area"
        style={{
          fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
          color: "#111827",
          background: "#fafafa",
        }}
      >
        {/* ── PAGE 1 ─────────────────────────────────────── */}
        <div
          style={{
            width: "100%",
            minHeight: "297mm",
            padding: "20mm 16mm",
            background: "#fafafa",
            boxSizing: "border-box",
            pageBreakAfter: "always",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: "2px solid #f97316",
              paddingBottom: 14,
              marginBottom: 20,
            }}
          >
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#111827", lineHeight: 1 }}>
                Trendsta
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>
                Free Profile Analysis Report
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 2 }}
              >
                {data.meta.creator_handle}
              </div>
              <div style={{ fontSize: 10, color: "#9ca3af" }}>
               
                {fmt(data.meta.average_views)} views
              </div>
              <div style={{ fontSize: 10, color: "#9ca3af" }}>
                Generated {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            </div>
          </div>

          {/* Score + Key Metrics row */}
          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            {/* Virality score circle */}
            <Card style={{ width: 160, flexShrink: 0, textAlign: "center", padding: "18px 12px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b7280", marginBottom: 8 }}>
                Virality Score
              </div>
              {/* SVG donut */}
              <svg viewBox="0 0 100 100" width={80} height={80} style={{ margin: "0 auto", display: "block" }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 251.2} 251.2`}
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="55" textAnchor="middle" fontSize="22" fontWeight="900" fill="#f97316">
                  {score}
                </text>
              </svg>
              <Badge>{data.sidebar_scoring.virality_label}</Badge>
              <div style={{ fontSize: 9, color: "#6b7280", marginTop: 8, lineHeight: 1.4 }}>
                {data.sidebar_scoring.virality_context}
              </div>
            </Card>

            {/* Score breakdown */}
            <Card style={{ flex: 1 }}>
              <SectionTitle>Score Breakdown</SectionTitle>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <tbody>
                  {[
                    ["Content Metrics", data.sidebar_scoring.metrics.content_metrics_percentage + "%"],
                    ["Hook Power", data.sidebar_scoring.hook_power_percentage + "%"],
                    ["AI Readiness", data.sidebar_scoring.ai_readiness_percentage + "%"],
                    ["Reach Efficiency", `${data.sidebar_scoring.metrics.reach_efficiency.status_label} (${data.sidebar_scoring.metrics.reach_efficiency.percentage ?? "—"}%)`],
                    ["WPM Consistency", data.sidebar_scoring.metrics.wpm_consistency.status_label],
                    ["Snippet Duration", data.sidebar_scoring.metrics.snippet_duration.status_label],
                    ["Ad Immunity", data.sidebar_scoring.metrics.ad_immunity.status_label],
                  ].map(([label, val], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "5px 0", color: "#374151", fontWeight: 600 }}>{label}</td>
                      <td style={{ padding: "5px 0", textAlign: "right", color: "#f97316", fontWeight: 700 }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: 10, padding: "6px 10px", background: "#fef3c7", borderRadius: 6, fontSize: 10, color: "#92400e", fontWeight: 600 }}>
                ⚠ {data.sidebar_scoring.issues_found_count} critical issues detected in this profile.
              </div>
            </Card>
          </div>

          {/* Reach Efficiency */}
          <Card style={{ marginBottom: 16 }}>
            <SectionTitle>Reach Efficiency Crisis</SectionTitle>
            <p style={{ fontSize: 11, color: "#4b5563", lineHeight: 1.6, marginBottom: 10 }}>
              You have <strong style={{ color: "#111827" }}>{fmt(data.meta.follower_count)} followers</strong> but your Reach Ratio is only{" "}
              <strong style={{ color: "#f97316" }}>{data.main_analysis.reach_efficiency_crisis.current_ratio}x</strong>. You are leaving ~
              <strong style={{ color: "#f97316" }}>{fmtComma(data.main_analysis.reach_efficiency_crisis.missed_views_calculated.value)}</strong> views on the table per reel.
            </p>
            {/* Progress bar */}
            <div style={{ fontSize: 9, display: "flex", justifyContent: "space-between", color: "#9ca3af", marginBottom: 4 }}>
              <span>Current: {Math.round(data.main_analysis.reach_efficiency_crisis.current_ratio * 100)}%</span>
              <span>Industry target: {Math.round(data.main_analysis.reach_efficiency_crisis.industry_target_ratio * 100)}%+</span>
            </div>
            <div style={{ height: 10, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  background: "#f97316",
                  borderRadius: 99,
                  width: Math.min(((data.main_analysis.reach_efficiency_crisis.current_ratio / data.main_analysis.reach_efficiency_crisis.industry_target_ratio) * 100), 100) + "%",
                }}
              />
            </div>
            <div style={{ marginTop: 10, fontSize: 10, color: "#374151" }}>
              <strong>Fix: </strong>Follower utilisation is too low relative to your niche. Review pacing and hook structure to reclaim suppressed reach.
            </div>
          </Card>

          {/* Mid-page CTAs */}
          <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
            <a href="https://trendsta.in/pricing" target="_blank" rel="noopener noreferrer" style={{ flex: 1, textDecoration: "none", background: "#fff", border: "1px solid #f97316", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>👥 Analyse Competitors</span>
              <span style={{ fontSize: 14, color: "#f97316", fontWeight: 900 }}>→</span>
            </a>
            <a href="https://trendsta.in/pricing" target="_blank" rel="noopener noreferrer" style={{ flex: 1, textDecoration: "none", background: "#fff", border: "1px solid #f97316", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>📝 Get Script Ideas</span>
              <span style={{ fontSize: 14, color: "#f97316", fontWeight: 900 }}>→</span>
            </a>
            <a href="https://trendsta.in/pricing" target="_blank" rel="noopener noreferrer" style={{ flex: 1, textDecoration: "none", background: "#fff", border: "1px solid #f97316", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>🎯 Niche Analysis</span>
              <span style={{ fontSize: 14, color: "#f97316", fontWeight: 900 }}>→</span>
            </a>
          </div>

          {/* LLM Diagnostic */}
          <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
            <Card style={{ flex: 1, borderLeft: "3px solid #d1d5db" }}>
              <SectionTitle>What You're Doing Right</SectionTitle>
              {data.main_analysis.llm_diagnostic.strengths.map((s, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#111827", marginBottom: 2 }}>
                    {s.title}
                    <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, color: "#16a34a", background: "#dcfce7", borderRadius: 99, padding: "1px 6px" }}>
                      {s.impact_level}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: "#6b7280", lineHeight: 1.5 }}>{s.description}</div>
                </div>
              ))}
            </Card>
            <Card style={{ flex: 1, borderLeft: "3px solid #f97316" }}>
              <SectionTitle>Critical Flaws</SectionTitle>
              {data.main_analysis.llm_diagnostic.critical_flaws.map((f, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#111827", marginBottom: 2 }}>
                    {f.title}
                    <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, color: "#dc2626", background: "#fee2e2", borderRadius: 99, padding: "1px 6px" }}>
                      {f.impact_level}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: "#6b7280", lineHeight: 1.5 }}>{f.description}</div>
                </div>
              ))}
            </Card>
          </div>
        </div>

        {/* ── PAGE 2 ─────────────────────────────────────── */}
        <div
          style={{
            width: "100%",
            minHeight: "297mm",
            padding: "20mm 16mm",
            background: "#fafafa",
            boxSizing: "border-box",
          }}
        >
          {/* Continuation header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 9,
              color: "#9ca3af",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: 8,
              marginBottom: 18,
            }}
          >
            <span style={{ fontWeight: 700, color: "#f97316" }}>Trendsta — Free Profile Analysis</span>
            <span>@{data.meta.creator_handle}</span>
          </div>

          {/* Topics full width */}
          <Card style={{ marginBottom: 16 }}>
            <SectionTitle>Topic Performance Ladder</SectionTitle>
            {data.main_analysis.topic_performance_ladder.topics.map((t, i) => {
              const colors = ["#f97316", "#fb923c", "#d1d5db", "#e5e7eb"];
              return (
                <div key={i} style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 90, fontSize: 10, fontWeight: 600, color: "#374151", flexShrink: 0 }}>{t.topic_label}</span>
                  <div style={{ flex: 1, height: 8, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: colors[i] ?? colors[0], borderRadius: 99, width: t.percentile.value + "%" }} />
                  </div>
                  <span style={{ width: 32, fontSize: 10, fontWeight: 700, color: "#111827", textAlign: "right", flexShrink: 0 }}>{t.multiplier_score}</span>
                </div>
              );
            })}
          </Card>

          {/* Hook Power + Audience side-by-side */}
          <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
            {/* Hooks */}
            <Card style={{ flex: 1 }}>
              <SectionTitle>Hook Power Analysis</SectionTitle>
              {[
                { label: "Top Hook", hook: data.main_analysis.hook_power_analysis.top_hook, accent: "#f97316" },
                { label: "Worst Hook", hook: data.main_analysis.hook_power_analysis.worst_hook, accent: "#9ca3af" },
              ].map(({ label, hook, accent }, i) => (
                <div key={i} style={{ marginBottom: 10, padding: "8px 10px", background: "#f9fafb", borderRadius: 8, borderLeft: `3px solid ${accent}` }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: accent, textTransform: "uppercase", marginBottom: 4 }}>
                    {label} · {fmt(hook.views)} views · Score {hook.score}/100
                  </div>
                  <div style={{ fontSize: 10, color: "#374151", fontStyle: "italic" }}>"{hook.text}..."</div>
                </div>
              ))}
              <div style={{ fontSize: 10, color: "#374151" }}>
                <strong>Fix: </strong>Avoid Q&A interview-style hooks. Favour controversial or direct-benefit openers.
              </div>
            </Card>

            {/* Audience */}
            <Card style={{ flex: 1 }}>
              <SectionTitle>Audience Engagement Map</SectionTitle>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: `conic-gradient(#f97316 0% ${s0}%, #fdba74 ${s0}% ${s0+s1}%, #e5e7eb ${s0+s1}% 100%)`,
                    border: "1px solid #e5e7eb",
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1 }}>
                  {segments.map((seg, i) => {
                    const colors = ["#f97316", "#fdba74", "#9ca3af"];
                    return (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors[i] ?? "#e5e7eb", display: "inline-block" }} />
                          {seg.segment_name}
                        </span>
                        <span style={{ color: "#111827", fontWeight: 700 }}>{seg.percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ fontSize: 10, color: "#374151" }}>
                <strong>Fix: </strong>Prioritise content aimed at your top 2 audience segments.
              </div>
            </Card>
          </div>

          {/* WPM + Duration side-by-side */}
          <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
            <Card style={{ flex: 1 }}>
              <SectionTitle>WPM Consistency Band</SectionTitle>
              <div style={{ fontSize: 11, color: "#374151", marginBottom: 8 }}>
                Your pace range: <strong style={{ color: "#f97316" }}>{data.main_analysis.wpm_consistency_band.min_wpm}–{data.main_analysis.wpm_consistency_band.max_wpm} WPM</strong>
              </div>
              <div style={{ padding: "6px 10px", background: data.main_analysis.wpm_consistency_band.is_pace_a_problem ? "#fff7ed" : "#f0fdf4", borderRadius: 6, fontSize: 10, color: "#374151" }}>
                Pace is <strong>{data.main_analysis.wpm_consistency_band.is_pace_a_problem ? "A problem" : "NOT the problem"}</strong>. {data.main_analysis.wpm_consistency_band.band_interpretation.value.split(",")[1] ?? data.main_analysis.wpm_consistency_band.band_interpretation.value}
              </div>
            </Card>
            <Card style={{ flex: 1 }}>
              <SectionTitle>Duration Sweet Spot</SectionTitle>
              <p style={{ fontSize: 11, color: "#4b5563", lineHeight: 1.6, marginBottom: 8 }}>
                There is a <strong>"Dead Zone"</strong> in your content length. Videos between{" "}
                <strong style={{ color: "#f97316" }}>{data.main_analysis.duration_sweet_spot.dead_zone_range}s</strong> severely underperform.
              </p>
              <div style={{ fontSize: 10, color: "#374151" }}>
                <strong>Optimal zones: </strong>{data.main_analysis.duration_sweet_spot.optimal_zones.join(", ")}s
              </div>
            </Card>
          </div>

          {/* CTA Banner */}
          <div style={{ background: "#2B2B2B", borderRadius: 10, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                Ready to fix your {data.sidebar_scoring.issues_found_count} critical issues?
              </div>
              <div style={{ color: "#9ca3af", fontSize: 10 }}>
                This is a sample. Unlock your customized roadmap and AI scripts.
              </div>
            </div>
            <div>
              <a href="https://trendsta.in/pricing" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#f97316", color: "white", padding: "10px 16px", borderRadius: 8, textDecoration: "none", fontSize: 11, fontWeight: 700 }}>
                Get Full Report Now →
              </a>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 9,
              color: "#9ca3af",
            }}
          >
            <span>
              This is a free-tier analysis. Visit{" "}
              <a href="https://trendsta.in/pricing" target="_blank" rel="noopener noreferrer" style={{ color: "#f97316", textDecoration: "none", fontWeight: 700 }}>
                trendsta.in/pricing
              </a>{" "}
              for the complete breakdown.
            </span>
            <span style={{ fontWeight: 700, color: "#f97316" }}>Trendsta</span>
          </div>
        </div>
      </div>
    );
  }
);
AnalysisPrintView.displayName = "AnalysisPrintView";
