"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Check, Bot, Sparkles, Zap, BrainCircuit } from "lucide-react";

// ============================================================================
// DIFFERENTIATION SECTION (Pourquoi pas ChatGPT ?)
// ============================================================================

const COMPARISON = [
  {
    chatgpt:
      "Vous oblige à écrire et affiner des prompts complexes de 15 lignes.",
    saas: "Génère un post parfait à partir d'une simple phrase brute.",
  },
  {
    chatgpt:
      "Oublie l'identité de votre marque et votre ton à chaque nouvelle session.",
    saas: "Mémorise votre ADN de marque pour une ligne éditoriale cohérente.",
  },
  {
    chatgpt:
      "Produit des blocs de texte denses qu'il faut toujours retravailler.",
    saas: "Formate nativement le texte avec les bons espacements et emojis.",
  },
  {
    chatgpt:
      "Ignore les limites de caractères spécifiques à chaque réseau social.",
    saas: "Adapte la longueur et les hashtags selon les codes de la plateforme.",
  },
];

export function Differentiation() {
  return (
    <section
      id="differentiation"
      className="w-full py-24 bg-slate-50 overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">

        <div className="flex flex-col items-center text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6"
          >
            Pourquoi ne pas simplement <br className="hidden md:block" />
            utiliser ChatGPT ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 font-medium bg-white px-6 py-2 rounded-full border border-slate-200 shadow-sm inline-flex items-center gap-2"
          >
            <Zap className="w-5 h-5 text-amber-500" />
            Parce que vous n'avez pas le temps de devenir un expert en prompts.
          </motion.p>
        </div>

        <div className="relative flex flex-col md:flex-row gap-6 md:gap-0 max-w-5xl mx-auto items-center md:items-stretch">
        
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full bg-slate-100 border border-slate-200 rounded-2xl md:rounded-r-none p-8 md:pr-14 opacity-90"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
                <Bot className="w-5 h-5 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-700">
                IA Généraliste (ChatGPT)
              </h3>
            </div>

            <ul className="space-y-6">
              {COMPARISON.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-600 leading-relaxed">
                    {item.chatgpt}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border border-slate-200 shadow-sm items-center justify-center z-10 font-bold text-slate-400 text-sm">
            VS
          </div>

          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full bg-white border-2 border-indigo-500 rounded-2xl md:rounded-l-none p-8 md:pl-14 shadow-xl z-0 transform md:scale-105"
          >
            <div className="flex items-center gap-3 mb-8">
              <div
                className="flex items-center gap-2 text-indigo-600"
              >
                <BrainCircuit className="w-6 h-6" />
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  Soclik
                </span>
              </div>
            </div>

            <ul className="space-y-6">
              {COMPARISON.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-900 leading-relaxed">
                    {item.saas}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
