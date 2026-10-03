"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  UserCircle,
  Briefcase,
  ArrowRight,
  PenOff,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================================
// SECTION 7 : USE CASES (Cas d'utilisation)
// ============================================================================

const TARGETS = [
  {
    id: "ecommerce",
    title: "E-commerce & Boutiques",
    description:
      "Transformez vos fiches produits parfois ennuyeuses en publications sociales engageantes qui donnent envie d'acheter.",
    icon: <ShoppingBag className="w-6 h-6" />,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    mockup:
      "Mise en avant de la nouvelle collection sans paraître trop promotionnel.",
  },
  {
    id: "independant",
    title: "Indépendants & Coachs",
    description:
      "Partagez votre expertise et développez votre marque personnelle sans jamais passer pour un vendeur agressif.",
    icon: <UserCircle className="w-6 h-6" />,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    mockup:
      "Partage d'une astuce métier avec une transition douce vers vos services.",
  },
  {
    id: "agence",
    title: "Agences & CM",
    description:
      "Générez les premières trames de contenu pour tous vos clients depuis une seule interface. Accélérez votre production.",
    icon: <Briefcase className="w-6 h-6" />,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    mockup: "Génération par lots de 10 posts mensuels pour un client B2B.",
  },
];

export function UseCases() {
  const [activeTab, setActiveTab] = useState(TARGETS[1]); // Indépendants par défaut

  return (
    <section id="use-cases" className="w-full py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center mb-16 max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4"
          >
            Pensé pour ceux qui font grandir leur activité.
          </motion.h2>
          <p className="text-lg text-slate-500 font-medium">
            Peu importe votre secteur, l'IA s'adapte à vos objectifs.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          <div className="w-full lg:w-1/2 space-y-4">
            {TARGETS.map((target) => {
              const isActive = activeTab.id === target.id;
              return (
                <button
                  key={target.id}
                  onClick={() => setActiveTab(target)}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col gap-2 ${
                    isActive
                      ? `${target.borderColor} bg-white shadow-lg`
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl ${isActive ? target.bgColor : "bg-slate-100"} ${isActive ? target.color : "text-slate-400"}`}
                    >
                      {target.icon}
                    </div>
                    <h3
                      className={`text-xl font-bold ${isActive ? "text-slate-900" : "text-slate-600"}`}
                    >
                      {target.title}
                    </h3>
                  </div>
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-slate-500 font-medium pl-14 leading-relaxed mt-1"
                    >
                      {target.description}
                    </motion.p>
                  )}
                </button>
              );
            })}
          </div>

          <div className="w-full lg:w-1/2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`w-full aspect-[4/3] rounded-3xl border-2 ${activeTab.borderColor} ${activeTab.bgColor} p-8 flex flex-col justify-center items-center text-center relative overflow-hidden`}
              >
                <div className="w-20 h-20 mb-6 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-800">
                  {activeTab.icon}
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-3">
                  Mode {activeTab.title.split(" ")[0]} activé
                </h4>
                <p className="text-slate-600 font-medium max-w-sm">
                  {activeTab.mockup}
                </p>

                <div
                  className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-20 bg-current ${activeTab.color}`}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

