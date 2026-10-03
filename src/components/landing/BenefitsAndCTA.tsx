"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  PenOff,
  Clock,
  TrendingUp,
  ArrowRight,
  Check,
  CheckCircle2,
  Smartphone,
} from "lucide-react";

const IMAGE_SRC = "/images/femme-telephone.webp";
const IMAGE_ALT =
  "Femme souriante consultant ses publications sur son téléphone";

const BENEFITS = [
  {
    icon: PenOff,
    title: "Zéro syndrome de la page blanche",
    description:
      "Vous n'aurez plus jamais à fixer un écran vide pendant 20 minutes. L'inspiration est toujours là, prête à être modelée.",
  },
  {
    icon: Clock,
    title: "Des heures récupérées chaque semaine",
    description:
      "Passez de 2h de création de contenu par semaine à moins de 15 minutes. Utilisez ce temps pour ce qui compte vraiment.",
  },
  {
    icon: TrendingUp,
    title: "Une présence constante et professionnelle",
    description:
      "Finis les creux d'un mois sans poster. Vous maintenez un rythme de publication régulier, l'algorithme vous récompense.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12 6.6-.6 11.4-5.4 12-12z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BenefitsAndCTA() {
  const reduce = !!useReducedMotion();
  const [imageFailed, setImageFailed] = useState(false);

  const reveal = (delay = 0, y = 20) => ({
    initial: reduce ? (false as const) : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <section
      id="resultats"
      className="relative isolate w-full overflow-hidden bg-slate-950 py-24 md:py-32"
    >
      
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(45% 50% at 100% 0%, rgba(99,102,241,0.22), transparent 70%), radial-gradient(40% 45% at 0% 100%, rgba(139,92,246,0.14), transparent 70%)",
        }}
      />

      <div className="mx-auto grid max-w-[1200px] items-center gap-16 px-4 md:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        {/* ====================== COLONNE IMAGE ====================== */}
        <motion.div
          {...reveal(0, 28)}
          className="relative mx-auto w-full max-w-[460px]"
        >
          {/* Cercles concentriques très fins */}
          <svg
            viewBox="0 0 600 600"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            {[150, 210, 270].map((r, i) => (
              <circle
                key={r}
                cx="300"
                cy="300"
                r={r}
                fill="none"
                stroke="white"
                strokeOpacity={0.1 - i * 0.025}
                strokeWidth="1"
              />
            ))}
          </svg>

          
          <div
            className="absolute inset-0 translate-x-4 -translate-y-4 rounded-b-[2rem] rounded-t-[999px] border border-indigo-300/30"
            aria-hidden="true"
          />

          
          <div className="relative aspect-[4/5] overflow-hidden rounded-b-[2rem] rounded-t-[999px] border border-white/10 bg-slate-900 shadow-2xl shadow-indigo-950/60">
            {imageFailed ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-indigo-500/25 via-slate-900 to-slate-950 text-indigo-200">
                <Smartphone className="h-10 w-10" strokeWidth={1.25} />
                {process.env.NODE_ENV === "development" && (
                  <p className="px-8 text-center text-xs text-slate-400">
                    Ajoutez votre photo dans
                    <br />
                    <code className="text-indigo-300">public{IMAGE_SRC}</code>
                  </p>
                )}
              </div>
            ) : (
              <motion.div
                className="absolute inset-0"
                initial={reduce ? false : { scale: 1.06 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: EASE }}
              >
                <Image
                  src={IMAGE_SRC}
                  alt={IMAGE_ALT}
                  fill
                  sizes="(min-width: 1024px) 460px, 90vw"
                  className="object-cover"
                  onError={() => setImageFailed(true)}
                />
              </motion.div>
            )}
            
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-indigo-500/10" />
          </div>

          
          <Sparkle className="absolute -left-3 top-24 h-5 w-5 text-indigo-300" />
          <Sparkle className="absolute -right-5 top-[46%] h-3 w-3 text-violet-300/80" />

          
          <div className="absolute -bottom-5 left-4 right-4 flex items-center gap-3 rounded-2xl border border-white/15 bg-slate-900/70 p-3.5 shadow-xl backdrop-blur-md sm:left-auto sm:-right-6 sm:w-64">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/30">
              <Check className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">Post généré</p>
              <p className="truncate text-xs text-slate-400">
                LinkedIn · prêt à publier
              </p>
            </div>
          </div>
        </motion.div>

     
        <div>
          <motion.div
            {...reveal(0.05, 14)}
            className="mb-6 flex items-center gap-3"
          >
            <span className="h-px w-10 bg-gradient-to-r from-indigo-400 to-transparent" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
              Résultats
            </span>
          </motion.div>

          <motion.h2
            {...reveal(0.1)}
            className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white md:text-5xl"
            style={{
              fontFamily: "var(--font-heading), var(--font-sans), sans-serif",
            }}
          >
            Reprenez le contrôle de{" "}
            <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              votre communication.
            </span>
          </motion.h2>

          <motion.p
            {...reveal(0.15)}
            className="mt-5 max-w-xl text-lg leading-relaxed text-slate-400"
          >
            Soclik transforme une idée en post prêt à publier, adapté à chaque
            réseau.
          </motion.p>

          
          <ul className="mt-10 border-t border-white/10">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.li
                  key={b.title}
                  {...reveal(0.2 + i * 0.1, 14)}
                  className="group flex gap-5 border-b border-white/10 py-6"
                >
                  <span className="mt-1 hidden w-7 shrink-0 font-mono text-xs text-slate-500 sm:block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-indigo-300 transition-colors group-hover:border-indigo-300/40 group-hover:bg-indigo-400/10">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {b.title}
                    </h3>
                    <p className="mt-1.5 leading-relaxed text-slate-400">
                      {b.description}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>

     
          <motion.div
            {...reveal(0.55, 14)}
            className="mt-10 flex flex-col items-start gap-4"
          >
            <Link
              href="/signup"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-slate-950 shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
            >
              Je reprends le contrôle
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Sans carte bancaire
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Prêt en 2 min
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
