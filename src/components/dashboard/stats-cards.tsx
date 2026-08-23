"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { stats } from "@/lib/mock-data";

export function StatsCards() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        const isPositive = stat.delta?.startsWith("+");

        return (
          <motion.div
            key={stat.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
          >
            <Card className="gap-3 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </span>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary">
                  <Icon className="size-4" strokeWidth={2} />
                </span>
              </div>

              <p className="tabular-nums font-heading text-[26px] font-semibold leading-none text-foreground">
                {stat.value}
              </p>

              {stat.progress && (
                <div className="space-y-1.5 pt-1">
                  <Progress
                    value={(stat.progress.value / stat.progress.max) * 100}
                    className="h-1.5"
                  />
                  <p className="text-xs text-muted-foreground">
                    {stat.progress.value} of {stat.progress.max}
                  </p>
                </div>
              )}

              {stat.delta && (
                <p
                  className={cn(
                    "text-xs font-medium",
                    isPositive ? "text-success" : "text-muted-foreground",
                  )}
                >
                  {stat.delta}
                </p>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
