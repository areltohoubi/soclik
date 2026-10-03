"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

// ============================================================================
// SOCIAL PROOF SECTION (Témoignages / Slider)
// ============================================================================

// ⚠️ PLACEHOLDERS : à remplacer par de vrais retours utilisateurs avant le
// lancement. Ne pas publier de faux témoignages.
const TESTIMONIALS = [
  {
    id: 1,
    name: "Marc T.",
    role: "Consultant B2B",
    content:
      "Je détestais écrire pour LinkedIn. L'angoisse de la page blanche me bloquait complètement. Maintenant, préparer mes posts de la semaine me prend 5 minutes le lundi matin avec mon café.",
    avatar: "bg-blue-100 text-blue-600",
    initials: "MT",
  },
  {
    id: 2,
    name: "Sophie L.",
    role: "Fondatrice E-commerce",
    content:
      "Gérer ma boutique me prend tout mon temps. Créer des posts Instagram était devenu une corvée que je repoussais sans cesse. L'outil me génère des textes chaleureux pour mes nouveautés en un clic.",
    avatar: "bg-amber-100 text-amber-600",
    initials: "SL",
  },
  {
    id: 3,
    name: "Thomas B.",
    role: "Social Media Manager",
    content:
      "Les premières trames générées sont solides et adaptées aux codes des réseaux : il ne me reste plus qu'à valider et ajuster.",
    avatar: "bg-emerald-100 text-emerald-600",
    initials: "TB",
  },
];

const AUTOPLAY_DELAY = 5000;

const variants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(
      (prev) =>
        (prev + newDirection + TESTIMONIALS.length) % TESTIMONIALS.length,
    );
  }, []);

  // Autoplay : s'arrête dès que l'utilisateur interagit
  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => paginate(1), AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [isAutoplay, paginate]);

  const handleManual = (newDirection: number) => {
    setIsAutoplay(false);
    paginate(newDirection);
  };

  const goTo = (index: number) => {
    setIsAutoplay(false);
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section
      id="temoignages"
      className="w-full py-24 bg-slate-50 overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-16 max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3"
          >
            Preuve sociale
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900"
          >
            Ils ont arrêté de s&apos;arracher les cheveux.
          </motion.h2>
        </div>

        {/* SLIDER */}
        <div className="relative max-w-4xl mx-auto">
          <div
            className="relative h-[350px] md:h-[280px] flex items-center justify-center"
            aria-live={isAutoplay ? "off" : "polite"}
          >
            <AnimatePresence custom={direction} initial={false} mode="wait">
              <motion.div
                key={current.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute w-full px-4 md:px-16"
              >
                <figure className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative">
                  <Quote
                    className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 text-indigo-50 rotate-180"
                    aria-hidden="true"
                  />

                  {/* Étoiles */}
                  <div
                    className="flex gap-1 mb-6"
                    role="img"
                    aria-label="5 étoiles sur 5"
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Citation */}
                  <blockquote className="text-lg md:text-2xl text-slate-700 font-medium leading-relaxed mb-8 relative z-10">
                    «&nbsp;{current.content}&nbsp;»
                  </blockquote>

                  {/* Auteur */}
                  <figcaption className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${current.avatar}`}
                    >
                      {current.initials}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">
                        {current.name}
                      </div>
                      <div className="text-sm font-medium text-slate-500">
                        {current.role}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Contrôles */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <button
              type="button"
              onClick={() => handleManual(-1)}
              className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((t, index) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => goTo(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-indigo-600 w-8"
                      : "bg-slate-300 hover:bg-slate-400 w-2.5"
                  }`}
                  aria-label={`Aller au témoignage ${index + 1}`}
                  aria-current={index === currentIndex}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleManual(1)}
              className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
