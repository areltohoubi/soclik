"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Zap,
  Music2,
  Loader2,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/components/Icons";
import { useAuth } from "@/app/context/AuthContext";
import { createClient } from "@/lib/supabase/supabaseClient";

// ============================================================================
// CONSTANTS
// ============================================================================

// Crédits du plan Free tels que définis dans plans (seed SQL, section 28).
// Utilisé uniquement en repli quand l'utilisateur n'a pas d'abonnement actif
// enregistré — à garder synchronisé si la grille tarifaire change.
const DEFAULT_FREE_PLAN_CREDITS = 5;

// Doit rester synchronisé avec PLATFORMS dans app/generate/page.tsx.
// TikTok n'a pas d'icône dédiée dans components/Icons pour l'instant — un
// icône générique (Music2) est utilisé en attendant.
const PLATFORMS: { label: string; icon: React.ReactNode }[] = [
  { label: "Instagram", icon: <InstagramIcon className="w-4 h-4" /> },
  { label: "LinkedIn", icon: <LinkedInIcon className="w-4 h-4" /> },
  { label: "X", icon: <TwitterIcon className="w-4 h-4" /> },
  { label: "Facebook", icon: <FacebookIcon className="w-4 h-4" /> },
  { label: "TikTok", icon: <Music2 className="w-4 h-4" /> },
];

const PLATFORM_ICON: Record<string, React.ReactNode> = {
  Instagram: <InstagramIcon className="w-4 h-4 text-pink-600" />,
  Facebook: <FacebookIcon className="w-4 h-4 text-blue-600" />,
  LinkedIn: <LinkedInIcon className="w-4 h-4 text-blue-700" />,
  X: <TwitterIcon className="w-4 h-4 text-slate-800" />,
  TikTok: <Music2 className="w-4 h-4 text-slate-800" />,
};

const STATUS_STYLE: Record<string, string> = {
  generated: "bg-slate-50 text-slate-600 border-slate-200",
  edited: "bg-blue-50 text-blue-700 border-blue-200",
  archived: "bg-amber-50 text-amber-700 border-amber-200",
};

const STATUS_LABEL: Record<string, string> = {
  generated: "Generated",
  edited: "Edited",
  archived: "Archived",
};

// Animations
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
} as const;

// ============================================================================
// TYPES
// ============================================================================

interface RecentPost {
  id: string;
  hook: string | null;
  content: string | null;
  caption: string | null;
  status: string;
  created_at: string;
  generation: { platform: string } | null;
}

interface DashboardData {
  creditsBalance: number;
  planName: string | null;
  planCredits: number;
  totalPosts: number;
  postsThisMonth: number;
  savedPosts: number;
  savedThisMonth: number;
  creditsUsedThisMonth: number;
  recentPosts: RecentPost[];
  weeklyActivity: { label: string; count: number }[];
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "there";

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  const loadDashboard = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setLoadError(null);

    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const [
        balanceRes,
        subscriptionRes,
        totalPostsRes,
        postsThisMonthRes,
        savedPostsRes,
        savedThisMonthRes,
        creditsUsedRes,
        recentPostsRes,
        weeklyRes,
      ] = await Promise.all([
        supabase
          .from("credit_balances")
          .select("balance")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("subscriptions")
          .select("plan:plans(name, credits)")
          .eq("user_id", user.id)
          .eq("status", "active")
          .order("started_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("generated_posts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("generated_posts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", startOfMonth.toISOString()),
        supabase
          .from("saved_posts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("saved_posts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", startOfMonth.toISOString()),
        supabase
          .from("credit_transactions")
          .select("amount")
          .eq("user_id", user.id)
          .eq("type", "generation")
          .gte("created_at", startOfMonth.toISOString()),
        supabase
          .from("generated_posts")
          .select(
            "id, hook, content, caption, status, created_at, generation:generations(platform)",
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("generated_posts")
          .select("created_at")
          .eq("user_id", user.id)
          .gte("created_at", sevenDaysAgo.toISOString()),
      ]);

      const firstError =
        balanceRes.error ||
        subscriptionRes.error ||
        totalPostsRes.error ||
        postsThisMonthRes.error ||
        savedPostsRes.error ||
        savedThisMonthRes.error ||
        creditsUsedRes.error ||
        recentPostsRes.error ||
        weeklyRes.error;
      if (firstError) throw firstError;

      const creditsUsedThisMonth = (creditsUsedRes.data ?? []).reduce(
        (sum, t) => sum + Math.abs(t.amount),
        0,
      );

      // Répartit les posts des 7 derniers jours par jour civil.
      const buckets = Array(7).fill(0);
      (weeklyRes.data ?? []).forEach((row) => {
        const d = new Date(row.created_at);
        const diffDays = Math.floor(
          (d.getTime() - sevenDaysAgo.getTime()) / 86_400_000,
        );
        if (diffDays >= 0 && diffDays < 7) buckets[diffDays]++;
      });
      const weeklyActivity = buckets.map((count, i) => {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        return {
          label: d.toLocaleDateString(undefined, { weekday: "narrow" }),
          count,
        };
      });

      const plan = subscriptionRes.data?.plan as
        | { name: string; credits: number }
        | { name: string; credits: number }[]
        | null;
      const planResolved = Array.isArray(plan) ? plan[0] : plan;

      setData({
        creditsBalance: balanceRes.data?.balance ?? 0,
        planName: planResolved?.name ?? "Free",
        planCredits: planResolved?.credits ?? DEFAULT_FREE_PLAN_CREDITS,
        totalPosts: totalPostsRes.count ?? 0,
        postsThisMonth: postsThisMonthRes.count ?? 0,
        savedPosts: savedPostsRes.count ?? 0,
        savedThisMonth: savedThisMonthRes.count ?? 0,
        creditsUsedThisMonth,
        recentPosts: (recentPostsRes.data as unknown as RecentPost[]) ?? [],
        weeklyActivity,
      });
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setLoadError("Could not load your dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (isLoading) {
    return <div className="p-8">Vérification de la session...</div>;
  }

  const creditsPercent = data
    ? Math.min(
        100,
        Math.round((data.creditsBalance / Math.max(data.planCredits, 1)) * 100),
      )
    : 0;
  const maxActivity = data
    ? Math.max(...data.weeklyActivity.map((d) => d.count), 1)
    : 1;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* 1. HEADER & MAIN CTA */}
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              {greeting}, {displayName} 👋
            </h1>
            <button
              onClick={logout}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Sign out
            </button>
          </div>
          <p className="text-slate-500 mt-1">
            Create content that keeps your brand active and growing.
          </p>
        </div>
        <Button
          onClick={() => router.push("/generate")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm gap-2 w-full sm:w-auto h-11 px-6"
        >
          <Sparkles className="w-4 h-4" />
          Generate Content
        </Button>
      </motion.div>

      {/* 2. QUICK GENERATION CARD */}
      <motion.div variants={item}>
        <Card className="relative overflow-hidden border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-white to-white shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 p-32 bg-indigo-100/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="relative z-10">
            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 mb-3 border-none">
              Quick Start
            </Badge>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Create your next viral post
            </h2>
            <p className="text-slate-500 max-w-lg">
              Tell us about your idea, select your platform, and let our AI
              handle the copywriting, hashtags, and formatting.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/generate")}
            className="relative z-10 w-full md:w-auto border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 gap-2 h-11 group"
          >
            Start from scratch
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Card>
      </motion.div>

      {loadError ? (
        <motion.div variants={item}>
          <Card className="p-6 border-red-100 bg-red-50 flex items-center gap-3 text-red-600 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {loadError}
          </Card>
        </motion.div>
      ) : (
        <>
          {/* 3. STATS */}
          <motion.div
            variants={item}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <StatCard
              title="Content Generated"
              value={loading ? null : String(data?.totalPosts ?? 0)}
              trend={
                loading ? null : `+${data?.postsThisMonth ?? 0} this month`
              }
            />
            <StatCard
              title="Saved Posts"
              value={loading ? null : String(data?.savedPosts ?? 0)}
              trend={
                loading ? null : `+${data?.savedThisMonth ?? 0} this month`
              }
              icon={<Bookmark className="w-3.5 h-3.5 text-indigo-500" />}
            />
            <Card className="p-5 shadow-sm border-slate-200 flex flex-col justify-between">
              <p className="text-sm font-medium text-slate-500">
                Remaining Credits
              </p>
              {loading ? (
                <div className="h-6 w-16 bg-slate-100 rounded animate-pulse mt-2" />
              ) : (
                <>
                  <div className="mt-2 flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {data?.creditsBalance}
                    </h3>
                    <span className="text-sm text-slate-500">
                      of {data?.planCredits} · {data?.planName}
                    </span>
                  </div>
                  <Progress
                    value={creditsPercent}
                    className="h-1.5 mt-4 bg-slate-100 [&>div]:bg-indigo-500"
                  />
                  {data && data.creditsBalance <= 2 && (
                    <button
                      onClick={() => router.push("/billing")}
                      className="text-xs text-indigo-600 hover:text-indigo-700 mt-2 text-left"
                    >
                      Running low — buy more credits →
                    </button>
                  )}
                </>
              )}
            </Card>
            <StatCard
              title="Credits Used"
              value={loading ? null : String(data?.creditsUsedThisMonth ?? 0)}
              trend="this month"
              icon={<Zap className="w-3.5 h-3.5 text-amber-500" />}
            />
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 4. RECENT CONTENT */}
            <motion.div variants={item} className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Recent Content
                </h3>
                <button
                  onClick={() => router.push("/history")}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View all
                </button>
              </div>
              <Card className="border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                  <div className="p-8 flex justify-center text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : !data || data.recentPosts.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    <Inbox className="w-8 h-8 mx-auto mb-2" />
                    No content generated yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {data.recentPosts.map((post) => (
                      <RecentContentRow
                        key={post.id}
                        platform={
                          PLATFORM_ICON[post.generation?.platform ?? ""] ?? (
                            <Sparkles className="w-4 h-4 text-slate-500" />
                          )
                        }
                        title={
                          post.hook ||
                          post.content ||
                          post.caption ||
                          "Untitled post"
                        }
                        date={new Date(post.created_at).toLocaleDateString(
                          undefined,
                          {
                            day: "numeric",
                            month: "short",
                          },
                        )}
                        status={post.status}
                        onClick={() => router.push("/history")}
                      />
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>

            {/* 5. SIDE COLUMN */}
            <motion.div variants={item} className="space-y-8">
              {/* Platforms */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  Create for
                </h3>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <PlatformBadge
                      key={p.label}
                      icon={p.icon}
                      label={p.label === "X" ? "X (Twitter)" : p.label}
                      onClick={() =>
                        router.push(
                          `/generate?platform=${encodeURIComponent(p.label)}`,
                        )
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Activity Chart */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  Activity — last 7 days
                </h3>
                <Card className="p-5 border-slate-200 shadow-sm">
                  {loading ? (
                    <div className="h-24 flex items-center justify-center text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  ) : (
                    <div className="flex items-end justify-between h-24 gap-2">
                      {(data?.weeklyActivity ?? []).map((d, i) => {
                        const heightPct = Math.round(
                          (d.count / maxActivity) * 100,
                        );
                        return (
                          <div
                            key={i}
                            className="w-full flex flex-col items-center gap-2"
                          >
                            <div className="w-full bg-slate-100 rounded-sm relative overflow-hidden h-full flex items-end">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${heightPct}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className="w-full bg-indigo-500 rounded-sm min-h-[2px]"
                                title={`${d.count} post(s)`}
                              />
                            </div>
                            <span className="text-[10px] font-medium text-slate-400">
                              {d.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
}

/* --- SUB-COMPONENTS --- */

function StatCard({
  title,
  value,
  trend,
  icon,
}: {
  title: string;
  value: string | null;
  trend: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="p-5 shadow-sm border-slate-200">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <div className="mt-2">
        {value === null ? (
          <div className="h-8 w-12 bg-slate-100 rounded animate-pulse" />
        ) : (
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        )}
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-sm">
        {icon ?? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
        <span className="text-slate-500 font-medium">{trend ?? "\u00A0"}</span>
      </div>
    </Card>
  );
}

function RecentContentRow({
  platform,
  title,
  date,
  status,
  onClick,
}: {
  platform: React.ReactNode;
  title: string;
  date: string;
  status: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group cursor-pointer"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
          {platform}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors truncate max-w-xs">
            {title}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Badge
          variant="outline"
          className={`font-normal ${STATUS_STYLE[status] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}
        >
          {STATUS_LABEL[status] ?? status}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-slate-400 hover:text-indigo-600"
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function PlatformBadge({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
    >
      {icon}
      {label}
    </button>
  );
}
