"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MailCheck,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/supabaseClient";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];


// Traduction des erreurs Supabase les plus courantes
function translateError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Un compte existe déjà avec cette adresse email.";
  if (m.includes("password should be at least") || m.includes("weak password"))
    return "Ce mot de passe est trop faible. Choisissez-en un plus long et plus complexe.";
  if (m.includes("invalid") && m.includes("email"))
    return "Cette adresse email n'est pas valide.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Trop de tentatives. Réessayez dans quelques minutes.";
  return message;
}

// Force du mot de passe : 0 à 4
function passwordScore(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 14) s++;
  return s;
}
const STRENGTH = [
  { label: "Trop court", bar: "bg-slate-300", text: "text-slate-500" },
  { label: "Faible", bar: "bg-red-500", text: "text-red-600" },
  { label: "Moyen", bar: "bg-amber-500", text: "text-amber-600" },
  { label: "Bon", bar: "bg-lime-500", text: "text-lime-600" },
  { label: "Excellent", bar: "bg-emerald-500", text: "text-emerald-600" },
];

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

export default function SignupPage() {
  const router = useRouter();
  const reduce = !!useReducedMotion();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const supabase = createClient();
  const score = password
    ? Math.max(passwordScore(password), password.length >= 8 ? 1 : 0)
    : 0;
  const strength = STRENGTH[password.length < 8 ? 0 : score];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(translateError(error.message));
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      // Confirmation par email activée côté Supabase : pas encore de session
      setNeedsConfirmation(true);
      setLoading(false);
    }
  };

  const enter = {
    initial: reduce ? (false as const) : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE },
  };

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="relative hidden flex-col justify-around overflow-hidden bg-slate-950 p-12 text-white lg:flex xl:p-16">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(60% 50% at 0% 0%, rgba(99,102,241,0.35), transparent 70%), radial-gradient(50% 45% at 100% 100%, rgba(139,92,246,0.22), transparent 70%)",
          }}
        />
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

        <div className="relative max-w-md ">
          <h1
            className="text-4xl font-extrabold leading-[1.1] tracking-tight xl:text-5xl"
            style={{
              fontFamily: "var(--font-heading), var(--font-sans), sans-serif",
            }}
          >
            Vos posts, prêts à publier{" "}
            <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              en quelques minutes.
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

          {needsConfirmation ? (
            /* ---------- Confirmation email ---------- */
            <div className="text-center lg:text-left">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 lg:mx-0">
                <MailCheck className="h-7 w-7" strokeWidth={1.75} />
              </span>
              <h2
                className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900"
                style={{
                  fontFamily:
                    "var(--font-heading), var(--font-sans), sans-serif",
                }}
              >
                Vérifiez votre boîte mail
              </h2>
              <p className="mt-3 leading-relaxed text-slate-600">
                Nous avons envoyé un lien de confirmation à{" "}
                <span className="font-semibold text-slate-900">{email}</span>.
                Cliquez dessus pour activer votre compte, puis connectez-vous.
              </p>
              <Link
                href="/login"
                className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Aller à la connexion
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            /* ---------- Formulaire ---------- */
            <>
              <h2
                className="text-3xl font-extrabold tracking-tight text-slate-900"
                style={{
                  fontFamily:
                    "var(--font-heading), var(--font-sans), sans-serif",
                }}
              >
                Créer un compte
              </h2>
              <p className="mt-2 text-slate-600">
                Vous avez déjà un compte ?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-indigo-600 transition-colors hover:text-indigo-500"
                >
                  Se connecter
                </Link>
              </p>

              <form
                className="mt-8 space-y-5"
                onSubmit={handleSignup}
                noValidate={false}
              >
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <Field
                  id="fullName"
                  label="Nom complet"
                  icon={User}
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Arel Dev"
                />

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

                <div>
                  <Field
                    id="password"
                    label="Mot de passe"
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8 caractères minimum"
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

                  {password && (
                    <div className="mt-2.5" aria-live="polite">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map((i) => (
                          <span
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                              password.length >= 8 && i <= score
                                ? strength.bar
                                : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p
                        className={`mt-1.5 text-xs font-medium ${strength.text}`}
                      >
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Création du compte…
                    </>
                  ) : (
                    <>
                      Créer mon compte
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs leading-relaxed text-slate-500">
                  En créant un compte, vous acceptez nos{" "}
                  <Link
                    href="/cgv"
                    className="font-medium text-slate-700 underline-offset-2 hover:underline"
                  >
                    CGV
                  </Link>{" "}
                  et notre{" "}
                  <Link
                    href="/confidentialite"
                    className="font-medium text-slate-700 underline-offset-2 hover:underline"
                  >
                    politique de confidentialité
                  </Link>
                  .
                </p>
              </form>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
