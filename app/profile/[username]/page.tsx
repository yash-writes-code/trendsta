"use client"
import React, { useState, useEffect, use } from 'react';
import {
  Lock, TrendingUp, Users, Activity,
  Target, ChevronRight, Sparkles, BarChart2, PieChart,
  Check, X, Info, Clock, Terminal, Magnet,
  Mic, Calendar, DollarSign, Loader2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface ConversionNudge {
  target_section: string;
  copy: string;
}

interface AnalysisData {
  meta: {
    creator_handle: string;
    total_reels_analyzed: number;
    average_views: number;
    follower_count: number;
    report_tier: string;
  };
  sidebar_scoring: {
    visibility_tier: string;
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
      visibility_tier: string;
      current_ratio: number;
      industry_target_ratio: number;
      missed_views_calculated: { value: number; visibility_tier: string };
    };
    llm_diagnostic: {
      visibility_tier: string;
      strengths: Array<{ title: string; description: string; impact_level: string }>;
      critical_flaws: Array<{ title: string; description: string; impact_level: string }>;
    };
    performance_funnel: {
      visibility_tier: string;
      viral_percentage: number;
      above_average_percentage: number;
      average_percentage: number;
      underperforming_percentage: number;
    };
    topic_performance_ladder: {
      visibility_tier: string;
      topics: Array<{
        topic_label: string;
        multiplier_score: string;
        visibility_tier: string;
        percentile: { value: number; visibility_tier: string };
      }>;
      unlock_teaser: string;
    };
    hook_power_analysis: {
      visibility_tier: string;
      top_hook: { text: string; views: number; score: number; visibility_tier: string };
      worst_hook: { text: string; views: number; score: number; visibility_tier: string };
      leaderboard: { visibility_tier: string; frameworks: string[]; teaser_copy: string };
    };
    wpm_consistency_band: {
      visibility_tier: string;
      min_wpm: number;
      max_wpm: number;
      is_pace_a_problem: boolean;
      band_interpretation: { value: string; visibility_tier: string };
    };
    duration_sweet_spot: {
      visibility_tier: string;
      dead_zone_range: string;
      optimal_zones: string[];
      duration_fix: { value: string; visibility_tier: string };
    };
    ad_immunity_advantage: {
      visibility_tier: string;
      organic_baseline: string;
      sponsored_multiplier: string;
      ad_insight: { value: string; visibility_tier: string };
    };
    audience_engagement_map: {
      visibility_tier: string;
      segments: Array<{ segment_name: string; percentage: number }>;
      teaser_copy: string;
    };
  };
  generated_ai_scripts: {
    visibility_tier: string;
    teaser_copy: string;
    scripts: Array<{
      topic: string;
      suggested_duration_sec: number;
      hook: string;
      body: string;
      cta: string;
    }>;
  };
  conversion_nudges: ConversionNudge[];
}

const ActionableFixList = ({
  clearFixes,
  blurredFix,
}: {
  clearFixes: string[];
  blurredFix?: string;
}) => (
  <div className="mt-6 pt-6 border-t border-gray-100">
    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
      <Check className="w-4 h-4 text-green-500" /> How to fix this:
    </h4>
    <ul className="space-y-3">
      {clearFixes.map((fix, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0"></span>
          <span>{fix}</span>
        </li>
      ))}
      {blurredFix && (
        <li className="relative mt-2">
          <div className="flex items-start gap-3 text-sm text-gray-600 blur-xs opacity-40 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0"></span>
            <span>{blurredFix}</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Link
              href="/pricing"
              className="bg-gray-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform"
            >
              <Lock className="w-3 h-3" /> Unlock Fix
            </Link>
          </div>
        </li>
      )}
    </ul>
  </div>
);

// ─── Loading state with typewriter hints ────────────────────────────────────
const loadingHints = [
  'Scanning reels for reach patterns...',
  'Correlating duration vs engagement...',
  'Running LLM diagnostics on hooks...',
  'Mapping audience segments...',
  'Calculating virality score...',
  'Almost there — finalising report...',
];

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);

  const [data, setData] = useState<AnalysisData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const [animatedOffset, setAnimatedOffset] = useState(125.6);
  const [hintIndex, setHintIndex] = useState(0);

  const pollRef = React.useRef<NodeJS.Timeout | null>(null);
  const hintRef = React.useRef<NodeJS.Timeout | null>(null);

  // Cycle loading hints
  useEffect(() => {
    if (data || notFound) return;
    hintRef.current = setInterval(() => {
      setHintIndex(i => (i + 1) % loadingHints.length);
    }, 3500);
    return () => { if (hintRef.current) clearInterval(hintRef.current); };
  }, [data, notFound]);

  // Fetch + poll
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/profile_analysis/${username}`, { cache: 'no-store' });

        if (res.status === 202) {
          // Not ready yet — keep polling
          return;
        }

        if (res.ok) {
          const result = await res.json();
          if (result.ready && result.analysis) {
            const payload = result.analysis;
            setData(Array.isArray(payload) ? payload[0] : payload);
            if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
          }
          return;
        }

        // Any other non-ok response → not found
        setNotFound(true);
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      } catch (err) {
        console.error('Error fetching analysis:', err);
      }
    };

    fetchData();
    pollRef.current = setInterval(fetchData, 10000);

    return () => {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    };
  }, [username]);

  // Animate gauge on data load
  useEffect(() => {
    if (data) {
      const finalOffset = 125.6 - (125.6 * (data.sidebar_scoring.virality_score / 100));
      setTimeout(() => setAnimatedOffset(finalOffset), 100);
    }
  }, [data]);

  // Typing effect for terminal
  useEffect(() => {
    if (!data) return;
    const text = `> Analyzing ${data.meta.creator_handle}...\n> Scanning ${data.meta.total_reels_analyzed} recent reels...\n> Correlating reach vs duration...\n> \n> [REACH EFFICIENCY CRISIS DETECTED]`;
    let i = 0;
    const typing = setInterval(() => {
      setTerminalText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(typing);
    }, 30);
    return () => clearInterval(typing);
  }, [data]);

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
    body { font-family: 'DM Sans', sans-serif; }
    .font-serif-brand { font-family: 'Playfair Display', serif; }
  `;

  // ── Not found ────────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center font-sans p-4">
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
        <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold font-serif-brand text-gray-900 mb-2">Report Not Found</h2>
        <p className="text-gray-500 text-sm text-center max-w-xs">
          No analysis exists for <span className="font-bold text-gray-700">@{username}</span>.
          Ask an admin to trigger one.
        </p>
      </div>
    );
  }

  // ── Loading / polling ────────────────────────────────────────────────────
  if (!data) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center font-sans">
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold font-serif-brand text-gray-900 mb-2">
          Generating Analysis for @{username}
        </h2>
        <p className="text-gray-400 text-sm font-medium transition-all duration-500">
          {loadingHints[hintIndex]}
        </p>
        <p className="text-gray-300 text-xs mt-4">This page updates automatically — no need to refresh.</p>
      </div>
    );
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return num.toString();
  };
  const formatComma = (num: number) => new Intl.NumberFormat('en-US').format(num);
  const getNudge = (target: string) => {
    const nudge = data.conversion_nudges.find(n => n.target_section === target);
    return nudge ? nudge.copy : null;
  };

  const missedViewsNudge = getNudge('missed_views');
  const hookNudge = getNudge('hook_leaderboard');
  const adImmunityNudge = getNudge('ad_immunity');

  const segments = data.main_analysis.audience_engagement_map.segments;
  const s0 = segments[0]?.percentage || 40;
  const s1 = segments[1]?.percentage || 35;

  const hoverClasses = "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(249,115,22,0.25)] hover:border-orange-500/30";

  

  // ── Full render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-orange-500/30 pb-20">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      <div className="max-w-[1280px] mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8 items-start">

        {/* LEFT — SCORING SIDEBAR */}
        <aside className="w-full md:w-[340px] bg-white rounded-3xl p-6 shadow-sm border border-gray-200 md:sticky md:top-8 flex-shrink-0">

          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-bold font-serif-brand text-gray-900 mb-8">Virality Score</h2>

            <div className="relative w-48 h-28 flex flex-col items-center">
              <div className="absolute top-0 w-48 h-24">
                <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                  <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f1f5f9" strokeWidth="8" strokeLinecap="round" />
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="8"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: 125.6,
                      strokeDashoffset: animatedOffset,
                      transition: 'stroke-dashoffset 1.5s ease-out'
                    }}
                    filter="url(#glow)"
                  />
                </svg>
              </div>
              <div className="absolute top-8 text-center w-full">
                <span className="text-5xl font-black text-orange-500 font-serif-brand tracking-tighter">
                  {data.sidebar_scoring.virality_score < 40
                    ? (50 + Math.floor(Math.random() * 10))
                    : data.sidebar_scoring.virality_score}
                </span>
                <span className="text-xl text-gray-400 font-bold">/100</span>
              </div>
            </div>

            <div className="text-center w-full mb-4">
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2">
                {data.sidebar_scoring.virality_label}
              </span>
              <p className="text-xs text-gray-600 font-medium leading-relaxed px-2 border-t border-gray-50 pt-3">
                {data.sidebar_scoring.virality_context}
              </p>
            </div>
            <p className="text-sm text-gray-500 font-medium mt-2 bg-gray-100 px-3 py-1 rounded-full">{data.sidebar_scoring.issues_found_count} Issues Found</p>
          </div>

          <div className="w-full h-px bg-gray-100 mb-6"></div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Content Metrics</span>
                <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">{data.sidebar_scoring.metrics.content_metrics_percentage}%</span>
              </div>
              <ul className="space-y-4">
                <li className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3"><Info className="w-4 h-4 text-orange-500" /><span className="text-gray-700 font-medium">Reach Efficiency</span></div>
                  <span className="text-[10px] font-bold bg-orange-50 border border-orange-200 text-orange-600 px-2 py-0.5 rounded-full">{data.sidebar_scoring.metrics.reach_efficiency.status_label} ({data.sidebar_scoring.metrics.reach_efficiency.percentage}%)</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3"><Check className="w-4 h-4 text-gray-400" /><span className="text-gray-700 font-medium">WPM Consistency</span></div>
                  <span className="text-[10px] font-bold border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">{data.sidebar_scoring.metrics.wpm_consistency.status_label}</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3"><Info className="w-4 h-4 text-orange-500" /><span className="text-gray-700 font-medium">Snippet Duration</span></div>
                  <span className="text-[10px] font-bold bg-orange-50 border border-orange-200 text-orange-600 px-2 py-0.5 rounded-full">{data.sidebar_scoring.metrics.snippet_duration.status_label}</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3"><Check className="w-4 h-4 text-gray-400" /><span className="text-gray-700 font-medium">Ad Immunity</span></div>
                  <span className="text-[10px] font-bold border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">{data.sidebar_scoring.metrics.ad_immunity.status_label}</span>
                </li>
              </ul>
            </div>

            <div className="w-full h-px bg-gray-100"></div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hook Power</span>
              <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">{data.sidebar_scoring.hook_power_percentage}%</span>
            </div>
            <div className="w-full h-px bg-gray-100"></div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">AI Readiness</span>
              <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">{data.sidebar_scoring.ai_readiness_percentage}%</span>
            </div>
          </div>

          <Link
            href="/pricing"
            className="w-full mt-8 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all shadow-[0_8px_20px_rgba(15,23,42,0.2)] hover:shadow-[0_12px_25px_rgba(15,23,42,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2 text-[15px]"
          >
            Unlock Full Report <Lock className="w-4 h-4" />
          </Link>
        </aside>

        {/* RIGHT — MAIN CONTENT */}
        <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col gap-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-serif-brand tracking-tight mb-1">
                Deep Analysis
              </h1>
              <p className="text-sm font-bold text-gray-500 flex items-center gap-2 uppercase tracking-wide">
                Target: {data.meta.creator_handle} <span className="w-1 h-1 rounded-full bg-gray-300"></span> Avg Views: {formatNumber(data.meta.average_views)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex bg-orange-50 border border-orange-200 px-4 py-2 rounded-full text-sm font-bold text-orange-600 shadow-sm">
                {data.sidebar_scoring.issues_found_count} Critical Issues Detected
              </div>
             
            </div>
          </div>

          {/* Reach Efficiency Crisis */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" /> Reach Efficiency Crisis
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              You have {formatNumber(data.meta.follower_count)} followers, but your <strong>Reach Ratio is only {data.main_analysis.reach_efficiency_crisis.current_ratio}x</strong>. You are leaving ~{formatComma(data.main_analysis.reach_efficiency_crisis.missed_views_calculated.value)} views on the table per reel because of algorithm suppression.
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 relative overflow-hidden">
              <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase">
                <span>Current: {Math.round(data.main_analysis.reach_efficiency_crisis.current_ratio * 100)}%</span>
                <span>Industry Target: {Math.round(data.main_analysis.reach_efficiency_crisis.industry_target_ratio * 100)}%+</span>
              </div>
              <div className="w-full relative mb-6">
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                  <div className="h-full bg-orange-500 rounded-full relative" style={{ width: ((data.main_analysis.reach_efficiency_crisis.current_ratio / data.main_analysis.reach_efficiency_crisis.industry_target_ratio) * 100) + '%' }}>
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>
                  </div>
                </div>
                <div className="absolute top-0 left-[70%] h-6 w-1 bg-gray-800 -mt-1 rounded-full shadow-md"></div>
              </div>
              <h3 className="text-center text-2xl font-bold text-gray-900 font-serif-brand mb-2">Follower Utilization is too low.</h3>
            </div>
            <ActionableFixList
              clearFixes={[
                `Your follower utilization is too low relative to your niche. You are leaving ~${formatComma(data.main_analysis.reach_efficiency_crisis.missed_views_calculated.value)} views on the table.`,
                "Algorithm suppression is restricting your reach because of sub-optimal pacing."
              ]}
              blurredFix={missedViewsNudge || "Unlock the exact pacing tweaks to reclaim your missing views."}
            />
          </div>

          {/* LLM Diagnostic */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                  <Terminal className="text-gray-700 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 font-serif-brand">LLM Diagnostic Summary</h3>
                  <p className="text-gray-500 text-sm">Our model reverse-engineered your top and bottom performers.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gray-300"></div>
                <h4 className="flex items-center gap-2 text-gray-800 font-bold mb-4 font-serif-brand text-lg">What You're Doing Right</h4>
                <ul className="space-y-4">
                  {data.main_analysis.llm_diagnostic.strengths.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <strong className="text-gray-800">{item.title}</strong>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.impact_level === 'High' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{item.impact_level} Impact</span>
                        </div>
                        {item.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
                <h4 className="flex items-center gap-2 text-gray-800 font-bold mb-4 font-serif-brand text-lg">Critical Flaws</h4>
                <ul className="space-y-4">
                  {data.main_analysis.llm_diagnostic.critical_flaws.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <strong className="text-gray-800">{item.title}</strong>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.impact_level === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{item.impact_level} Impact</span>
                        </div>
                        {item.description}
                      </div>
                    </li>
                  ))}
                </ul>
                <ActionableFixList
                  clearFixes={["Stop placing CTAs in your descriptions. Transition to direct verbal hooks."]}
                  blurredFix="Replicate the 'Forbidden Information' interview framework to eliminate Q&A friction."
                />
              </div>
            </div>
          </div>

          {/* Topic Performance Ladder */}
          <div className={"bg-white rounded-2xl p-6 shadow-sm border border-gray-200 group relative overflow-hidden " + hoverClasses}>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-orange-500" /> Topic Performance Ladder
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.main_analysis.topic_performance_ladder.topics.map((item, i) => {
                const colors = ['bg-orange-500', 'bg-orange-400', 'bg-gray-300', 'bg-gray-200'];
                return (
                  <div key={i} className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-700">{item.topic_label}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={"h-full rounded-full " + (colors[i] || colors[0])} style={{ width: item.percentile.value + '%' }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400">Percentile</span>
                      <span className="text-sm font-black text-gray-900">{item.multiplier_score}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <ActionableFixList
              clearFixes={["Double down on top ranking topics to sustain the high reach multiplier."]}
              blurredFix={data.main_analysis.topic_performance_ladder.unlock_teaser}
            />
          </div>

          {/* Audience + Hook Power */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={"bg-white rounded-2xl p-6 shadow-sm border border-gray-200 group relative overflow-hidden " + hoverClasses}>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-orange-500" /> Audience Engagement Map
              </h2>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 shadow-inner flex-shrink-0 border border-gray-100 rounded-full" style={{ background: `conic-gradient(#f97316 0% ${s0}%, #fdba74 ${s0}% ${s0 + s1}%, #cbd5e1 ${s0 + s1}% 100%)` }}></div>
                <div className="space-y-3 w-full">
                  {segments.map((seg, i) => {
                    const colors = ['bg-orange-500', 'bg-orange-300', 'bg-gray-300'];
                    return (
                      <div key={i} className="flex items-center justify-between text-xs font-bold text-gray-600">
                        <span className="flex items-center gap-2"><span className={"w-2 h-2 rounded-full " + (colors[i] || 'bg-gray-200')}></span> {seg.segment_name}</span>
                        <span className="text-gray-900">{seg.percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <ActionableFixList
                clearFixes={["Prioritize content geared towards top 2 audience segments which drive the most engagement."]}
                blurredFix={data.main_analysis.audience_engagement_map.teaser_copy}
              />
            </div>

            <div className={"bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative group " + hoverClasses}>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Magnet className="w-4 h-4 text-orange-500" /> Hook Power Analysis
              </h2>
              <div className="flex flex-col gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-orange-500 uppercase block mb-1">Top Hook ({formatNumber(data.main_analysis.hook_power_analysis.top_hook.views)} Views)</span>
                    <span className="text-gray-800 text-sm font-medium">"{data.main_analysis.hook_power_analysis.top_hook.text}..."</span>
                  </div>
                  <div className="text-right"><span className="text-lg font-black text-gray-900 font-serif-brand">{data.main_analysis.hook_power_analysis.top_hook.score}/100</span></div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between opacity-70">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Worst Hook ({formatNumber(data.main_analysis.hook_power_analysis.worst_hook.views)} Views)</span>
                    <span className="text-gray-600 text-sm">"{data.main_analysis.hook_power_analysis.worst_hook.text}..."</span>
                  </div>
                  <div className="text-right"><span className="text-lg font-black text-gray-500 font-serif-brand">{data.main_analysis.hook_power_analysis.worst_hook.score}/100</span></div>
                </div>
                {hookNudge && <p className="text-xs font-bold text-orange-600 text-center bg-orange-50 py-1 rounded-lg">{hookNudge}</p>}
              </div>
              <ActionableFixList
                clearFixes={["Avoid the Q&A specific interview hook structures like your lowest performing hook."]}
                blurredFix={data.main_analysis.hook_power_analysis.leaderboard.teaser_copy}
              />
            </div>
          </div>

          {/* WPM + Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={"bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative group flex flex-col justify-between " + hoverClasses}>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Mic className="w-4 h-4 text-orange-500" /> WPM Consistency Band
              </h2>
              <div className="flex-1 flex flex-col justify-center">
                <div className="relative h-16 w-full flex items-center justify-center mb-4 mt-4">
                  <div className="w-full h-6 bg-gradient-to-r from-gray-100 via-orange-100 to-gray-100 rounded-full relative border border-gray-200">
                    <div className="absolute left-[50%] w-[25%] h-12 -top-3 bg-white border-2 border-orange-500 rounded-lg flex items-center justify-center shadow-md z-10 translate-x-[-12%]">
                      <span className="text-[10px] font-black text-gray-900 leading-tight text-center">{data.main_analysis.wpm_consistency_band.min_wpm}-{data.main_analysis.wpm_consistency_band.max_wpm}<br />WPM</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 w-full flex justify-between text-[10px] font-bold text-gray-400">
                    <span>150 WPM (Slow)</span><span>300 WPM (Fast)</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-center mt-3">
                  <p className="text-sm font-medium text-gray-700">
                    Pace is <span className="font-bold text-orange-500">{data.main_analysis.wpm_consistency_band.is_pace_a_problem ? 'A' : 'NOT'}</span> the problem. {data.main_analysis.wpm_consistency_band.band_interpretation.value.split(',')[1] || data.main_analysis.wpm_consistency_band.band_interpretation.value}
                  </p>
                </div>
              </div>
            </div>

            <div className={"bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative group " + hoverClasses}>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" /> Duration Sweet Spot
              </h2>
              <p className="text-gray-600 text-sm mb-6">There is a <strong>"Dead Zone"</strong> in your content length. Videos between {data.main_analysis.duration_sweet_spot.dead_zone_range} seconds severely underperform.</p>
              <div className="h-20 flex items-end gap-1 px-4 border-b border-gray-200 mb-2 relative">
                <div className="w-1/3 flex justify-center"><div className="w-8 h-12 bg-gray-200 rounded-t-sm"></div></div>
                <div className="w-1/3 flex justify-center relative">
                  <div className="absolute -top-6 text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">Dead Zone</div>
                  <div className="w-8 h-4 bg-orange-400 rounded-t-sm opacity-50"></div>
                </div>
                <div className="w-1/3 flex justify-center"><div className="w-8 h-16 bg-gray-800 rounded-t-sm"></div></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase px-4 mb-4">
                <span className="w-1/3 text-center">Under 30s</span>
                <span className="w-1/3 text-center text-orange-500">{data.main_analysis.duration_sweet_spot.dead_zone_range}</span>
                <span className="w-1/3 text-center">{data.main_analysis.duration_sweet_spot.optimal_zones[0]}</span>
              </div>
              <ActionableFixList
                clearFixes={[`Push content past ${data.main_analysis.duration_sweet_spot.optimal_zones[1]} as those durations out-perform.`]}
                blurredFix={data.main_analysis.duration_sweet_spot.duration_fix.value}
              />
            </div>
          </div>

          {/* AI Scripts CTA */}
          <div className="mb-8">
            <Link
              href="/pricing"
              className="p-6 relative bg-gray-900 flex flex-col justify-center text-center rounded-2xl overflow-hidden cursor-pointer hover:shadow-[0_8px_30px_rgba(15,23,42,0.3)] transition-all hover:-translate-y-1 block"
            >
              <div className="absolute inset-0 blur-[6px] opacity-20 p-6 select-none pointer-events-none text-left flex flex-col gap-4">
                {data.generated_ai_scripts.scripts.map((script, idx) => (
                  <div key={idx} className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <p className="text-orange-400 text-xs font-bold mb-1">[{script.topic} • {script.suggested_duration_sec}s]</p>
                    <p className="text-white text-sm font-bold mb-2">Hook: {script.hook}</p>
                    <p className="text-gray-400 text-xs mb-2">{script.body}</p>
                    <p className="text-orange-300 text-xs font-medium">CTA: {script.cta}</p>
                  </div>
                ))}
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 mx-auto rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 border border-orange-500/20">
                  <Sparkles className="text-orange-400 w-6 h-6" />
                </div>
                <h4 className="text-xl md:text-2xl font-black text-white mb-2 font-serif-brand">Generate AI Scripts</h4>
                <p className="text-gray-400 text-xs md:text-sm mb-6 max-w-sm mx-auto">{data.generated_ai_scripts.teaser_copy}</p>
                <span className="py-3 px-4 text-sm bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-[0_0_15px_rgba(249,115,22,0.4)] w-full flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Let AI Write My Next Reels
                </span>
              </div>
            </Link>
          </div>

        </main>
      </div>
    </div>
  );
}
