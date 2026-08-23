"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function QuickGenerate() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative isolate flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl bg-ink p-7 text-white lg:p-8"
    >
      {/* Ambient texture — subtle, one-time signature moment, not a loud gradient */}
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-primary/40 blur-3xl" />
      <Sparkles
        className="pointer-events-none absolute -bottom-6 -right-6 size-40 text-white/[0.06]"
        strokeWidth={1}
      />

      <div className="relative space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">
          <Sparkles className="size-3" />
          Quick generate
        </span>
        <h2 className="font-heading text-2xl font-semibold tracking-tight lg:text-[28px]">
          Create your next post
        </h2>
        <p className="max-w-sm text-sm text-white/60">
          Tell us about your idea and let AI handle the rest.
        </p>
      </div>

      <Button
        
        size="lg"
        className="relative mt-6 w-fit bg-white text-ink hover:bg-white/90"
      >
        <Link href="/dashboard/generate">
          Generate Content
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </motion.div>
  );
}
