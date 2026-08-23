import {
  LayoutDashboard,
  Sparkles,
  History,
  CreditCard,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// Single source of truth for the sidebar. Add a route here and it shows up
// in the desktop rail, the tablet compact rail, and the mobile drawer.
export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Generate", href: "/dashboard/generate", icon: Sparkles },
  { label: "History", href: "/dashboard/history", icon: History },
  { label: "Pricing", href: "/dashboard/pricing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];
