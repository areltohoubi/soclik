import React from "react";
import Link from "next/link";
import { Sparkles, Mail } from "lucide-react";

// ============================================================================
// FOOTER (Navigation, légal & réassurance)
// Composant serveur : aucun état, donc pas de "use client".
// ============================================================================

// --- À personnaliser -------------------------------------------------------
const BRAND = { name: "Soclik", suffix: "" }; // ex. { name: "Soclik", suffix: ".ai" }
const CONTACT_EMAIL = "contact@soclik.com"; // ⚠️ remplacer par votre vraie adresse
const TAGLINE =
  "Générez vos contenus pour les réseaux sociaux en quelques minutes, adaptés à chaque plateforme.";

// Un réseau n'est affiché que si son URL est renseignée.
const SOCIALS = [
  { label: "X", href: "", icon: "x" },
  { label: "LinkedIn", href: "", icon: "linkedin" },
] as const;

const FOOTER_LINKS = {
  Produit: [
    { label: "Fonctionnalités", href: "/#fonctionnalites" },
    { label: "Tarifs", href: "/#tarifs" },
    { label: "Témoignages", href: "/#temoignages" },
    { label: "FAQ", href: "/#faq" },
  ],
  Plateformes: [
    { label: "Instagram", href: "/#fonctionnalites" },
    { label: "Facebook", href: "/#fonctionnalites" },
    { label: "LinkedIn", href: "/#fonctionnalites" },
    { label: "TikTok", href: "/#fonctionnalites" },
    { label: "X", href: "/#fonctionnalites" },
  ],
  Entreprise: [
    { label: "Contact", href: "/contact" },
    { label: "Se connecter", href: "/login" },
    { label: "Créer un compte", href: "/signup" },
  ],
  Légal: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "CGV", href: "/cgv" },
    { label: "Politique de confidentialité", href: "/confidentialite" },
    { label: "Cookies", href: "/cookies" },
  ],
} as const;
// ---------------------------------------------------------------------------

function SocialIcon({ name }: { name: "x" | "linkedin" }) {
  const path =
    name === "x"
      ? "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      : "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

const linkClass =
  "text-sm text-slate-500 transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:text-indigo-600 focus-visible:underline";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const activeSocials = SOCIALS.filter((s) => s.href);

  return (
    <footer
      className="w-full border-t border-slate-200 bg-white"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Pied de page
      </h2>

      <div className="mx-auto max-w-[1200px] px-4 pt-16 pb-8 md:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* MARQUE */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2"
              aria-label={`${BRAND.name} — accueil`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
                <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                {BRAND.name}
                {BRAND.suffix && (
                  <span className="text-indigo-600">{BRAND.suffix}</span>
                )}
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              {TAGLINE}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {CONTACT_EMAIL}
              </a>
            </div>

            {activeSocials.length > 0 && (
              <ul className="mt-6 flex items-center gap-2">
                {activeSocials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${BRAND.name} sur ${s.label}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <SocialIcon name={s.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* COLONNES DE LIENS */}
          <nav
            aria-label="Liens du pied de page"
            className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8 lg:pl-8"
          >
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                  {title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={`${title}-${link.label}`}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* BARRE DU BAS */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 md:flex-row">
          <p className="text-sm text-slate-400">
            © {currentYear} {BRAND.name}
            {BRAND.suffix}. Tous droits réservés.
          </p>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <li>
              <Link href="/confidentialite" className={linkClass}>
                Confidentialité
              </Link>
            </li>
            <li>
              <Link href="/cgv" className={linkClass}>
                CGV
              </Link>
            </li>
            <li>
              <Link href="/cookies" className={linkClass}>
                Cookies
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
