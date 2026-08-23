"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  History,
  CreditCard,
  Settings,
  BrainCircuit,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Generate", href: "/dashboard/generate", icon: Sparkles },
  { label: "History", href: "/dashboard/history", icon: History },
  { label: "Pricing", href: "/dashboard/pricing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-indigo-600"
        >
          <BrainCircuit className="w-6 h-6" />
          <span className="font-bold text-lg text-slate-900 tracking-tight">
            Soclik
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} className="block relative">
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-indigo-50 border border-indigo-100 rounded-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-indigo-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-slate-400"}`}
                />
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors text-left">
          <Avatar className="w-9 h-9 border border-slate-200">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-slate-900 truncate">
              John Doe
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-500 hover:bg-slate-100 text-[10px] px-1.5 py-0 h-4"
              >
                Free Plan
              </Badge>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
