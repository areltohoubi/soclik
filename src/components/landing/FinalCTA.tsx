"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================================
// FINAL CTA SECTION (La conclusion forte)
// ============================================================================

export function FinalCTA() {
  return (
    <section
      id="cta-final"
      className="w-full py-24 relative overflow-hidden bg-indigo-600"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-to-b from-white/10 to-transparent rounded-full blur-3xl transform rotate-12" />
        <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-gradient-to-t from-black/10 to-transparent rounded-full blur-3xl transform -rotate-12" />
      </div>

      <div className="max-w-[800px] mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* HEADER */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight"
          >
            Arrêtez de repousser vos publications à demain.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl md:text-2xl text-indigo-100 font-medium mb-10 max-w-2xl"
          >
            Rejoignez les créateurs qui génèrent leur contenu en quelques
            secondes.{" "}
            <span className="text-white font-bold">L'essai est gratuit.</span>
          </motion.p>

          {/* MAIN BUTTON */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center w-full"
          >
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-slate-50 text-lg md:text-xl h-16 px-8 md:px-10 rounded-full shadow-2xl shadow-black/20 group w-full md:w-auto font-bold transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
              Créer mon premier post maintenant
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* TRUST MARKERS (Micro-copy) */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6 text-indigo-100 text-sm font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Aucune carte bancaire requise
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Installation en 30 secondes
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
