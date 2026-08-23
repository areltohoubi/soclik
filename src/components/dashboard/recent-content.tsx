"use client";

import { motion } from "framer-motion";
import {
  MoreHorizontal,
  CameraIcon,
  FactoryIcon,
  LampFloorIcon,
  X,
  Music2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const recentItems = [
  {
    id: 1,
    platform: "Instagram",
    title: "5 Tips to grow your audience",
    date: "Today",
    status: "Generated",
    statusColor: "bg-blue-100 text-blue-700",
    icon: CameraIcon,
  },
  {
    id: 2,
    platform: "LinkedIn",
    title: "How AI is changing content creation",
    date: "Yesterday",
    status: "Published",
    statusColor: "bg-emerald-100 text-emerald-700",
    icon: LampFloorIcon,
  },
  {
    id: 3,
    platform: "Facebook",
    title: "Behind the scenes of our product",
    date: "2 days ago",
    status: "Draft",
    statusColor: "bg-slate-100 text-slate-600",
    icon: FactoryIcon,
  },
  {
    id: 4,
    platform: "X",
    title: "Quick tip: Consistency beats perfection",
    date: "3 days ago",
    status: "Generated",
    statusColor: "bg-blue-100 text-blue-700",
    icon: X,
  },
  {
    id: 5,
    platform: "TikTok",
    title: "Hook ideas for short-form video",
    date: "4 days ago",
    status: "Published",
    statusColor: "bg-emerald-100 text-emerald-700",
    icon: Music2,
  },
];

export function RecentContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">
            Recent Content
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-indigo-600 hover:text-indigo-700"
          >
            View all
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-lg p-2 hover:bg-slate-50 transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                  <item.icon className="h-4 w-4 text-slate-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500">{item.date}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={`${item.statusColor} font-medium`}
                >
                  {item.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
