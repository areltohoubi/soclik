"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  BrainCircuit,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/supabaseClient";

// ============================================================================
// CONNEXION : panneau de marque à gauche, formulaire à droite
// (même design que la page d'inscription)
// ============================================================================

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const POINTS = [
  "Retrouvez tout votre historique de posts",
  "Votre profil de marque, déjà prêt",
  "Vos crédits et votre plan en un coup d'œil",
];

// Aperçu illustratif de l'historique
const HISTORY_PREVIEW = [
  {
    platform: "LinkedIn",
    format: "Text post",
    dot: "bg-sky-400",
    favorite: true,
  },
  {
    platform: "Instagram",
    format: "Caption",
    dot: "bg-pink-400",
    favorite: false,
  },
  {
    platform: "X",
    format: "Single post",
    dot: "bg-slate-300",
    favorite: false,
  },
];

// Traduction des erreurs Supabase les plus courantes
function translateError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "Adresse email ou mot de passe incorrect.";
  if (m.includes("email not confirmed"))
    return "Veuillez confirmer votre adresse email avant de vous connecter.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Trop de tentatives. Réessayez dans quelques minutes.";
  if (m.includes("invalid") && m.includes("email"))
    return "Cette adresse email n'est pas valide.";
  return message;
}

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5"
      aria-label="Soclik — accueil"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
        <BrainCircuit className="h-5 w-5 text-white" aria-hidden="true" />
      </span>
      <span
        className={`text-xl font-bold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}
      >
        Soclik
      </span>
    </Link>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  right,
  ...props
}: {
  id: string;
  label: string;
  icon: LucideIcon;
  right?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <div className="group relative">
        <Icon
          className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
          aria-hidden="true"
        />
        <input
          id={id}
          {...props}
          className="block h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-11 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
        />
        {right && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {right}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const reduce = !!useReducedMotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(translateError(error.message));
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const enter = {
    initial: reduce ? (false as const) : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE },
  };

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* ====================== PANNEAU DE MARQUE ====================== */}
      <aside className="relative hidden flex-col justify-around overflow-hidden bg-slate-950 p-12 text-white lg:flex xl:p-16">
        {/* Fond statique */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(60% 50% at 0% 0%, rgba(99,102,241,0.35), transparent 70%), radial-gradient(50% 45% at 100% 100%, rgba(139,92,246,0.22), transparent 70%)",
          }}
        />
        {/* Cercles concentriques très fins */}
        <svg
          viewBox="0 0 600 600"
          className="pointer-events-none absolute -bottom-40 -right-40 h-[640px] w-[640px]"
          aria-hidden="true"
        >
          {[120, 180, 240, 300].map((r, i) => (
            <circle
              key={r}
              cx="300"
              cy="300"
              r={r}
              fill="none"
              stroke="white"
              strokeOpacity={0.12 - i * 0.025}
            />
          ))}
        </svg>

        <div className="relative">
          <Logo dark />
        </div>

        <div className="relative max-w-md">
          <h1
            className="text-4xl font-extrabold leading-[1.1] tracking-tight xl:text-5xl"
            style={{
              fontFamily: "var(--font-heading), var(--font-sans), sans-serif",
            }}
          >
            Reprenez là où{" "}
            <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              vous vous êtes arrêté.
            </span>
          </h1>
        </div>
      </aside>

      {/* ====================== FORMULAIRE ====================== */}
      <main className="flex items-center justify-center px-4 py-12 sm:px-8">
        <motion.div {...enter} className="w-full max-w-[420px]">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>

          <h2
            className="text-3xl font-extrabold tracking-tight text-slate-900"
            style={{
              fontFamily: "var(--font-heading), var(--font-sans), sans-serif",
            }}
          >
            Connexion
          </h2>
          <p className="mt-2 text-slate-600">
            Vous n&apos;avez pas de compte ?{" "}
            <Link
              href="/signup"
              className="font-semibold text-indigo-600 transition-colors hover:text-indigo-500"
            >
              S&apos;inscrire gratuitement
            </Link>
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <Field
              id="email"
              label="Adresse email"
              icon={Mail}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nom@exemple.com"
            />

            <Field
              id="password"
              label="Mot de passe"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              right={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Connexion…
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
