"use client";
import { motion } from "framer-motion";
import { PenOff, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

const BENEFITS = [
  {
    icon: <PenOff className="w-6 h-6 text-indigo-400" />,
    title: "Zéro syndrome de la page blanche",
    description:
      "Vous n'aurez plus jamais à fixer un écran vide pendant 20 minutes. L'inspiration est toujours là, prête à être modelée.",
  },
  {
    icon: <Clock className="w-6 h-6 text-indigo-400" />,
    title: "Des heures récupérées chaque semaine",
    description:
      "Passez de 2h de création de contenu par semaine à moins de 15 minutes. Utilisez ce temps pour ce qui compte vraiment.",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-indigo-400" />,
    title: "Une présence constante et professionnelle",
    description:
      "Finis les creux d'un mois sans poster. Vous maintenez un rythme de publication régulier, l'algorithme vous récompense.",
  },
];

export function BenefitsAndCTA() {
  return (
    <section
      id="resultats"
      className="w-full py-24 bg-slate-900 relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 -left-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6"
          >
            Reprenez le contrôle de <br className="hidden md:block" />
            votre communication.
          </motion.h2>
        </div>

        {/* BENEFITS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {BENEFITS.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* SECONDARY CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg h-14 px-8 rounded-full shadow-lg shadow-indigo-500/25 group"
          >
            Je reprends le contrôle
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
