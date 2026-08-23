import {
  Sparkles,
  Send,
  Gauge,
  TrendingUp,
  Camera,
  Users,
  Briefcase,
  X as XIcon,
  Music2,
  type LucideIcon,
} from "lucide-react";

export const currentUser = {
  name: "Alex Morgan",
  initials: "AM",
  plan: "Free" as const,
  email: "alex@lumen.app",
};

// ---------------------------------------------------------------------------
// Platforms — generic, license-safe glyphs (not brand wordmarks) paired with
// each platform's recognizable accent color. The platform name is always
// shown alongside the icon, so exact logo fidelity isn't load-bearing.
// ---------------------------------------------------------------------------
export type PlatformId = "instagram" | "facebook" | "linkedin" | "x" | "tiktok";

export interface Platform {
  id: PlatformId;
  name: string;
  icon: LucideIcon;
  fg: string; // icon / text color
  tint: string; // badge background
}

export const platforms: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Camera,
    fg: "#DB2777",
    tint: "#FDF2F8",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Users,
    fg: "#2563EB",
    tint: "#EFF6FF",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Briefcase,
    fg: "#0369A1",
    tint: "#EFF8FF",
  },
  { id: "x", name: "X", icon: XIcon, fg: "#18181B", tint: "#F4F4F5" },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music2,
    fg: "#0F766E",
    tint: "#F0FDFA",
  },
];

export function getPlatform(id: PlatformId): Platform {
  return platforms.find((p) => p.id === id)!;
}

// ---------------------------------------------------------------------------
// Stats row
// ---------------------------------------------------------------------------
export interface StatItem {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: string;
  progress?: { value: number; max: number };
}

export const stats: StatItem[] = [
  {
    id: "generated",
    label: "Content generated",
    value: "128",
    icon: Sparkles,
    delta: "+24 this month",
  },
  {
    id: "published",
    label: "Published",
    value: "86",
    icon: Send,
    delta: "+12 this month",
  },
  {
    id: "credits",
    label: "Remaining credits",
    value: "42",
    icon: Gauge,
    progress: { value: 42, max: 100 },
  },
  {
    id: "engagement",
    label: "Engagement",
    value: "+18.4%",
    icon: TrendingUp,
    delta: "vs. last month",
  },
];

// ---------------------------------------------------------------------------
// Recent content
// ---------------------------------------------------------------------------
export type ContentStatus = "generated" | "scheduled" | "published";

export interface ContentItem {
  id: string;
  platform: PlatformId;
  title: string;
  date: string;
  status: ContentStatus;
}

export const recentContent: ContentItem[] = [
  {
    id: "c1",
    platform: "instagram",
    title: "5 tips to grow your audience organically",
    date: "Today",
    status: "generated",
  },
  {
    id: "c2",
    platform: "linkedin",
    title: "How AI is changing content creation",
    date: "Yesterday",
    status: "published",
  },
  {
    id: "c3",
    platform: "tiktok",
    title: "Behind the scenes: our new product drop",
    date: "2 days ago",
    status: "scheduled",
  },
  {
    id: "c4",
    platform: "x",
    title: "A short thread on staying consistent with brand voice",
    date: "3 days ago",
    status: "published",
  },
  {
    id: "c5",
    platform: "facebook",
    title: "Weekend sale — 20% off everything",
    date: "4 days ago",
    status: "generated",
  },
];

// ---------------------------------------------------------------------------
// Weekly activity (content pieces generated per day)
// ---------------------------------------------------------------------------
export const weeklyActivity = [
  { day: "Mon", value: 3 },
  { day: "Tue", value: 7 },
  { day: "Wed", value: 4 },
  { day: "Thu", value: 9 },
  { day: "Fri", value: 8 },
  { day: "Sat", value: 5 },
  { day: "Sun", value: 9 },
];
