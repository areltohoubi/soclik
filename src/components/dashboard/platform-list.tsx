"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { platforms } from "@/lib/mock-data";

export function PlatformList() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Card className="h-full gap-4 p-6">
      <div>
        <h3 className="font-heading text-base font-semibold text-foreground">
          Create for
        </h3>
        <p className="text-sm text-muted-foreground">
          Pick a platform to start a new post.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-2 xl:grid-cols-3">
        {platforms.map((platform, i) => {
          const Icon = platform.icon;
          return (
            <motion.div
              key={platform.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04, ease: "easeOut" }}
            >
              <Link
                href={`/dashboard/generate?platform=${platform.id}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-center transition-colors duration-150 hover:border-primary/30 hover:bg-secondary"
              >
                <span
                  className="flex size-9 items-center justify-center rounded-full"
                  style={{ backgroundColor: platform.tint, color: platform.fg }}
                >
                  <Icon className="size-4" strokeWidth={2} />
                </span>
                <span className="text-xs font-medium text-foreground">
                  {platform.name}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
