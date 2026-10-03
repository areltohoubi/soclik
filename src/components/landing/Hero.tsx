"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Play,
  Wand2,
} from "lucide-react";

// ============================================================================
// DÉMO : une idée → trois posts adaptés (contenu fictif, uniquement illustratif)
// ============================================================================

const IDEA =
  "Lancement de notre nouveau menu d'été demain ! Salades fraîches et thés glacés maison.";

const OUTPUTS = [
  {
    platform: "LinkedIn",
    format: "Text post",
    dot: "bg-sky-500",
    text: "L'été s'installe, et notre carte aussi ! ☀️\n\nToute l'équipe est fière de vous annoncer le lancement de notre nouveau menu d'été, dès demain.\n\nAu programme :\n• Des salades fraîches\n• Nos thés glacés maison\n\nHâte de vous retrouver à table.\n\n#MenuEte #FaitMaison",
  },
  {
    platform: "Instagram",
    format: "Caption",
    dot: "bg-pink-500",
    text: "Demain, l'été passe à table. 🥗🧊\n\nSalades fraîches.\nThés glacés maison.\n\nRendez-vous dès demain pour goûter le nouveau menu.\n\n#MenuEte #FaitMaison #Salades #ThéGlacé",
  },
  {
    platform: "X",
    format: "Single post",
    dot: "bg-slate-800",
    text: "Nouveau menu d'été dès demain.\n\nSalades fraîches, thés glacés maison.\n\nVenez goûter. ☀️",
  },
] as const;

const FORMATS = [
  "Instagram · Carousel",
  "LinkedIn · Storytelling",
  "TikTok · Video script",
  "X · Thread",
  "Instagram · Reel",
  "Facebook · Promotional post",
  "TikTok · Hook + script",
  "LinkedIn · Professional announcement",
  "Instagram · Story",
  "Facebook · Educational post",
];

type Phase = "typing" | "generating" | "result";

// Machine à écrire : l'état est indexé par une clé, donc le texte repart de
// zéro dès que la clé change, sans setState synchrone dans un effet.
function useTyper(
  text: string,
  run: boolean,
  resetKey: number,
  instant: boolean,
) {
  const k = `${text}|${run}|${resetKey}`;
  const [st, setSt] = useState({ k: "", n: 0 });
  const n = st.k === k ? st.n : 0;

  useEffect(() => {
    if (!run || instant) return;
    const id = setInterval(() => {
      setSt((s) => {
        const cur = s.k === k ? s.n : 0;
        if (cur >= text.length) {
          clearInterval(id);
          return s.k === k ? s : { k, n: cur };
        }
        return { k, n: Math.min(cur + 2, text.length) };
      });
    }, 18);
    return () => clearInterval(id);
  }, [k, run, instant, text]);

  if (instant) return { shown: text, done: run };
  return { shown: text.slice(0, n), done: run && n >= text.length };
}

const Caret = () => (
  <span className="ml-0.5 inline-block h-4 w-0.5 bg-indigo-500 align-middle" />
);

export function Hero() {
  const reduce = !!useReducedMotion();

  // ---- Démo -------------------------------------------------------------
  const [p, setP] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [loop, setLoop] = useState(0);
  const current = OUTPUTS[p];
  const effectivePhase: Phase = reduce ? "result" : phase;

  const ideaTyper = useTyper(IDEA, phase === "typing", loop, reduce);
  const outTyper = useTyper(
    current.text,
    effectivePhase === "result",
    loop * 10 + p,
    reduce,
  );
  const ideaShown = phase === "typing" && !reduce ? ideaTyper.shown : IDEA;

  useEffect(() => {
    if (reduce) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    if (phase === "typing" && ideaTyper.done) {
      t = setTimeout(() => setPhase("generating"), 700);
    } else if (phase === "generating") {
      t = setTimeout(() => setPhase("result"), 1400);
    } else if (phase === "result" && outTyper.done) {
      t = setTimeout(() => {
        const next = (p + 1) % OUTPUTS.length;
        setP(next);
        if (next === 0) {
          setLoop((l) => l + 1);
          setPhase("typing");
        } else {
          setPhase("generating");
        }
      }, 3200);
    }
    return () => clearTimeout(t);
  }, [phase, ideaTyper.done, outTyper.done, p, reduce]);

  const pickPlatform = (i: number) => {
    setP(i);
    setPhase("generating");
  };

  // ---- Entrée en scène : un simple fondu + léger glissement, échelonné ---
  const reveal = (delay: number) => ({
    initial: reduce ? (false as const) : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  });

  return (
    <section className="relative isolate w-full overflow-hidden bg-white pt-20 pb-28">
      
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 0%, rgba(99,102,241,0.20), transparent 70%), linear-gradient(to bottom, #eef2ff 0%, #ffffff 75%)",
        }}
      />

      <div className="mx-auto flex max-w-[1200px] flex-col items-center px-4 text-center md:px-8">


        <motion.h1
          {...reveal(0.1)}
          className="max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 md:text-7xl"
          style={{
            fontFamily: "var(--font-heading), var(--font-sans), sans-serif",
          }}
        >
          Ne cherchez plus vos mots.
          <br className="hidden md:block" />{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Publiez.
          </span>
        </motion.h1>

        
        <motion.p
          {...reveal(0.2)}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl"
        >
          Décrivez votre idée en une phrase. Soclik génère le post adapté à
          Instagram, LinkedIn, TikTok ou X. Sans friction, sans syndrome de la
          page blanche.
        </motion.p>

        
        <motion.div
          {...reveal(0.3)}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/signup"
              className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-8 text-base font-semibold text-white shadow-lg shadow-indigo-900/10 transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:w-auto"
            >
              Démarrer mon essai gratuit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#demo"
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 text-base font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
            >
              <Play className="h-4 w-4 fill-current" />
              Voir la démo
            </a>
          </div>
          {/* <div className="flex items-center gap-5 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Sans carte bancaire
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Prêt en 2 min
            </span>
          </div> */}
        </motion.div>

        {/* ---------- DÉMO ---------- */}
        <motion.div
          id="demo"
          {...reveal(0.45)}
          className="relative mt-16 w-full max-w-4xl scroll-mt-24"
        >
          
          <div
            className="absolute -inset-x-6 -inset-y-4 -z-10 rounded-[2rem] bg-gradient-to-b from-indigo-200/60 to-violet-100/20 blur-2xl"
            aria-hidden="true"
          />

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-xl shadow-indigo-900/10">
            <div className="flex h-12 items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-slate-200" />
                <span className="h-3 w-3 rounded-full bg-slate-200" />
                <span className="h-3 w-3 rounded-full bg-slate-200" />
              </div>
              <span className="ml-4 font-mono text-xs text-slate-400">
                soclik.com/dashboard/generate
              </span>
            </div>

            <div className="flex flex-col gap-6 p-6 md:flex-row md:p-8">
              {/* Entrée */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1.5">
                  <span className="text-sm font-semibold text-slate-900">
                    1. Votre idée
                  </span>
                  <div className="min-h-[88px] rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                    {ideaShown}
                    {phase === "typing" && !reduce && <Caret />}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {OUTPUTS.map((o, i) => (
                    <button
                      type="button"
                      key={o.platform}
                      onClick={() => pickPlatform(i)}
                      aria-pressed={i === p}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        i === p
                          ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${o.dot}`} />
                      {o.platform}
                    </button>
                  ))}
                  <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
                    Ton : Professionnel &amp; Chaleureux
                  </span>
                </div>

                <div
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white"
                  aria-hidden="true"
                >
                  {effectivePhase === "generating" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Génération…
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" /> Générer le post
                      <span className="ml-1 rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-medium">
                        1 crédit
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="hidden w-px bg-slate-100 md:block" />

              {/* Sortie */}
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    2. Résultat
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <span className={`h-2 w-2 rounded-full ${current.dot}`} />
                      {current.platform} · {current.format}
                    </span>
                  </span>
                  {outTyper.done && (
                    <motion.span
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"
                    >
                      <Check className="h-3 w-3" /> Prêt à publier
                    </motion.span>
                  )}
                </div>

                <div className="min-h-[280px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  {effectivePhase === "result" ? (
                    <motion.div
                      key={`${loop}-${p}`}
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                        {outTyper.shown}
                        {!outTyper.done && <Caret />}
                      </p>
                      <div
                        className={`mt-4 flex gap-2 text-slate-500 transition-opacity duration-500 ${
                          outTyper.done ? "opacity-100" : "opacity-0"
                        }`}
                        aria-hidden="true"
                      >
                        <span className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs">
                          <Copy className="h-3 w-3" /> Copier
                        </span>
                        <span className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs">
                          <Bookmark className="h-3 w-3" /> Enregistrer
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-3 pt-1" aria-hidden="true">
                      {[
                        "w-4/5",
                        "w-full",
                        "w-3/5",
                        "w-11/12",
                        "w-2/3",
                        "w-3/4",
                      ].map((w) => (
                        <div
                          key={w}
                          className={`h-3 rounded bg-slate-100 ${w}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* ---------- BANDEAU DE FORMATS ---------- */}
        <div className="mt-20 w-full">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Du texte au script vidéo, pour chaque réseau
          </p>
          <div
            className="overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            }}
          >
            <motion.div
              className="flex w-max gap-3"
              animate={reduce ? undefined : { x: ["0%", "-50%"] }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            >
              {[...FORMATS, ...FORMATS].map((f, i) => (
                <span
                  key={`${f}-${i}`}
                  className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm"
                >
                  {f}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
