"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileX2, Shuffle, CalendarX } from "lucide-react";

// ============================================================================
// PAIN POINTS SECTION
// ============================================================================

const PAIN_POINTS = [
  {
    icon: <FileX2 className="w-6 h-6 text-slate-700" />,
    title: "Le syndrome de l'écran blanc",
    description:
      "Vous passez 30 minutes à écrire un brouillon, chercher la bonne phrase, pour finalement tout effacer par frustration.",
  },
  {
    icon: <Shuffle className="w-6 h-6 text-slate-700" />,
    title: "La fatigue des plateformes",
    description:
      "Vous savez ce que vous voulez dire, mais vous ne savez pas comment adapter votre texte entre les codes de LinkedIn et ceux d'Instagram.",
  },
  {
    icon: <CalendarX className="w-6 h-6 text-slate-700" />,
    title: "La malédiction de l'irrégularité",
    description:
      "Vous publiez 3 fois avec enthousiasme la même semaine... puis le quotidien reprend le dessus et vous ne postez plus rien pendant un mois.",
  },
];

export function PainPoints() {
  return (
    <section id="probleme" className="w-full py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-6"
          >
            Vous savez que vous devez publier.{" "}
            <br className="hidden md:block" />
            <span className="text-slate-400 font-medium">
              Mais le quotidien vous rattrape.
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {PAIN_POINTS.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex flex-col p-8 rounded-2xl bg-slate-50/50 border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6">
                {point.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {point.title}
              </h3>
              <p className="text-slate-500 leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-2xl mx-auto text-center p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100/50"
        >
          <p className="text-base md:text-lg font-medium text-indigo-900/80">
            On vous comprend. Créer du contenu est un métier à part entière.
            <br className="hidden md:block" />
            <span className="font-bold text-indigo-900">
              Ce n'est pas de votre faute
            </span>{" "}
            si vous n'avez pas le temps de tout faire.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
