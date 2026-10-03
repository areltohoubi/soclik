"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
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
    dot: "bg-sky-400",
    text: "L'été s'installe, et notre carte aussi ! ☀️\n\nToute l'équipe est fière de vous annoncer le lancement de notre nouveau menu d'été, dès demain.\n\nAu programme :\n• Des salades fraîches\n• Nos thés glacés maison\n\nHâte de vous retrouver à table.\n\n#MenuEte #FaitMaison",
  },
  {
    platform: "Instagram",
    format: "Caption",
    dot: "bg-pink-400",
    text: "Demain, l'été passe à table. 🥗🧊\n\nSalades fraîches.\nThés glacés maison.\n\nRendez-vous dès demain pour goûter le nouveau menu.\n\n#MenuEte #FaitMaison #Salades #ThéGlacé",
  },
  {
    platform: "X",
    format: "Single post",
    dot: "bg-slate-200",
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

// Machine à écrire. L'état est indexé par une clé : pas de setState synchrone
// dans l'effet, et le texte repart de zéro dès que la clé change.
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

function Caret() {
  return (
    <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-indigo-400 align-middle" />
  );
}

function Word({
  children,
  delay,
  reduce,
}: {
  children: React.ReactNode;
  delay: number;
  reduce: boolean;
}) {
  return (
    <span className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom">
      <motion.span
        className="inline-block"
        initial={reduce ? false : { y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const reduce = !!useReducedMotion();

  // ---- Démo animée -------------------------------------------------------
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
      t = setTimeout(() => setPhase("result"), 1500);
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

  // ---- Spotlight + inclinaison 3D ---------------------------------------
  const sectionRef = useRef<HTMLElement>(null);
  const sx = useMotionValue(600);
  const sy = useMotionValue(220);
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, rgba(129,140,248,0.16), transparent 65%)`;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), {
    stiffness: 120,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), {
    stiffness: 120,
    damping: 20,
  });

  const onSectionMove = (e: React.MouseEvent) => {
    if (reduce || !sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    sx.set(e.clientX - r.left);
    sy.set(e.clientY - r.top);
  };
  const onMockMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onMockLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const floatAnim = (d: number) =>
    reduce
      ? undefined
      : {
          y: [0, -12, 0],
          transition: {
            duration: d,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        };

  return (
    <section
      ref={sectionRef}
      onMouseMove={onSectionMove}
      className="relative isolate w-full overflow-hidden bg-slate-950 pt-24 pb-28 text-white"
    >
      {/* ---------- FOND ---------- */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <motion.div
          className="absolute -top-40 left-[10%] h-[520px] w-[520px] rounded-full bg-indigo-600/30 blur-[120px]"
          animate={
            reduce
              ? undefined
              : { x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -top-20 right-[5%] h-[460px] w-[460px] rounded-full bg-emerald-400/20 blur-[120px]"
          animate={
            reduce
              ? undefined
              : { x: [0, -70, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }
          }
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0"
          style={{
                       backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 75%)",
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{ background: spotlight }}
        />
      </div>

      <div className="relative mx-auto flex max-w-[1200px] flex-col items-center px-4 text-center md:px-8">
        {/* ---------- BADGE ---------- */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-slate-200 backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Soclik est disponible
        </motion.div>

        {/* ---------- TITRE ---------- */}
        <h1
          className="max-w-5xl text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl lg:text-8xl"
          style={{
            fontFamily: "var(--font-heading), var(--font-sans), sans-serif",
          }}
        >
          <span className="block">
            {["Ne", "cherchez", "plus", "vos", "mots."].map((w, i) => (
              <Word key={w} delay={0.1 + i * 0.08} reduce={reduce}>
                {w}
              </Word>
            ))}
          </span>
          <span className="relative mt-1 inline-block">
            <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span
                className="inline-block bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg,#a5b4fc,#6ee7b7,#ffffff,#a5b4fc)",
                  backgroundSize: "200% 100%",
                }}
                initial={reduce ? false : { y: "110%" }}
                animate={
                  reduce
                    ? { y: 0 }
                    : {
                        y: 0,
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }
                }
                transition={{
                  y: { duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] },
                  backgroundPosition: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              >
                Publiez.
              </motion.span>
            </span>
            <svg
              viewBox="0 0 300 20"
              preserveAspectRatio="none"
              className="absolute -bottom-1 left-0 h-3 w-full md:h-4"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="hero-swoosh" x1="0" x2="1">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
              <motion.path
                d="M2 14 C 70 3, 190 3, 298 11"
                fill="none"
                stroke="url(#hero-swoosh)"
                strokeWidth={4}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 1.1, ease: "easeOut" }}
              />
            </svg>
          </span>
        </h1>

        {/* ---------- SOUS-TITRE ---------- */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl"
        >
          Décrivez votre idée en une phrase. Soclik génère le post adapté à
          Instagram, LinkedIn, TikTok ou X. Sans friction, sans syndrome de la
          page blanche.
        </motion.p>

        {/* ---------- CTA ---------- */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-10 flex flex-col items-center gap-5"
        >
          <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/signup"
              className="group relative inline-flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 text-base font-semibold text-slate-950 shadow-[0_0_40px_-8px_rgba(129,140,248,0.7)] transition-shadow hover:shadow-[0_0_64px_-8px_rgba(129,140,248,0.9)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 sm:w-auto"
            >
              <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 -translate-x-full bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent transition-transform duration-700 group-hover:translate-x-[320%]" />
              <span className="relative">Démarrer mon essai gratuit</span>
              <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#demo"
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 text-base font-medium text-white backdrop-blur transition-colors hover:bg-white/10 sm:w-auto"
            >
              <Play className="h-4 w-4 fill-current" />
              Voir la démo
            </a>
          </div>
          <div className="flex items-center gap-5 text-xs font-medium text-slate-400">
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

        {/* ---------- DÉMO LIVE ---------- */}
        <motion.div
          id="demo"
          initial={reduce ? false : { opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-20 w-full max-w-5xl scroll-mt-24"
          onMouseMove={onMockMove}
          onMouseLeave={onMockLeave}
        >
          {/* Halo */}
          <div
            className="absolute -inset-x-10 -inset-y-6 -z-10 rounded-[2.5rem] bg-gradient-to-r from-indigo-500/30 via-emerald-400/20 to-indigo-500/30 opacity-70 blur-3xl"
            aria-hidden="true"
          />

          {/* Pastilles flottantes */}
          <motion.div
            animate={floatAnim(5)}
            className="absolute -left-6 top-16 z-20 hidden items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-xl backdrop-blur lg:flex"
          >
            <span className="h-2 w-2 rounded-full bg-pink-400" /> Instagram
          </motion.div>
          <motion.div
            animate={floatAnim(6.5)}
            className="absolute -right-8 top-40 z-20 hidden items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-xl backdrop-blur lg:flex"
          >
            <span className="h-2 w-2 rounded-full bg-sky-400" /> LinkedIn
          </motion.div>
          <motion.div
            animate={floatAnim(5.8)}
            className="absolute -left-2 bottom-24 z-20 hidden items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-xl backdrop-blur lg:flex"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> TikTok
          </motion.div>

          {/* Fenêtre inclinable */}
          <motion.div
            style={
              reduce
                ? undefined
                : { rotateX, rotateY, transformPerspective: 1200 }
            }
            className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 text-left shadow-2xl shadow-black/50 backdrop-blur-xl"
          >
            <div className="flex h-12 items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-white/15" />
                <span className="h-3 w-3 rounded-full bg-white/15" />
                <span className="h-3 w-3 rounded-full bg-white/15" />
              </div>
              <span className="ml-4 font-mono text-xs text-slate-500">
                soclik.com/dashboard/generate
              </span>
            </div>

            <div className="flex flex-col gap-6 p-6 md:flex-row md:p-8">
              {/* Entrée */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1.5">
                  <span className="text-sm font-semibold text-white">
                    1. Votre idée
                  </span>
                  <div className="min-h-[88px] rounded-xl border border-white/10 bg-white/5 p-3 text-sm leading-relaxed text-slate-200">
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
                          ? "border-indigo-400/40 bg-indigo-500/15 text-indigo-200"
                          : "border-white/10 bg-white/5 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${o.dot}`} />
                      {o.platform}
                    </button>
                  ))}
                  <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400">
                    Ton : Professionnel &amp; Chaleureux
                  </span>
                </div>

                <motion.div
                  animate={{
                    scale: effectivePhase === "generating" ? 0.97 : 1,
                  }}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30"
                  aria-hidden="true"
                >
                  {effectivePhase === "generating" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Génération…
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" /> Générer le post
                      <span className="ml-1 rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-medium">
                        1 crédit
                      </span>
                    </>
                  )}
                </motion.div>
              </div>

              <div className="hidden w-px bg-white/10 md:block" />

              {/* Sortie */}
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-white">
                    2. Résultat
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                      <span className={`h-2 w-2 rounded-full ${current.dot}`} />
                      {current.platform} · {current.format}
                    </span>
                  </span>
                  {outTyper.done && (
                    <motion.span
                      initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300"
                    >
                      <Check className="h-3 w-3" /> Prêt à publier
                    </motion.span>
                  )}
                </div>

                <div className="min-h-[280px] rounded-xl border border-white/10 bg-slate-950/60 p-4">
                  {effectivePhase === "result" ? (
                    <motion.div
                      key={`${loop}-${p}`}
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-200">
                        {outTyper.shown}
                        {!outTyper.done && <Caret />}
                      </p>
                      <div
                        className={`mt-4 flex gap-2 text-slate-500 transition-opacity duration-500 ${
                          outTyper.done ? "opacity-100" : "opacity-0"
                        }`}
                        aria-hidden="true"
                      >
                        <span className="flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs">
                          <Copy className="h-3 w-3" /> Copier
                        </span>
                        <span className="flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs">
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
                      ].map((w, i) => (
                        <motion.div
                          key={i}
                          className={`h-3 rounded bg-white/10 ${w}`}
                          animate={
                            effectivePhase === "generating" && !reduce
                              ? { opacity: [0.25, 0.7, 0.25] }
                              : { opacity: 0.15 }
                          }
                          transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            delay: i * 0.12,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ---------- BANDEAU DE FORMATS ---------- */}
        <div className="mt-20 w-full">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
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
                  className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300"
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
