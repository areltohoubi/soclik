"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ============================================================================
// NAVBAR SECTION
// ============================================================================

const NAV_LINKS = [
  { label: "Fonctionnement", href: "#solution" },
  { label: "Exemples", href: "#preuve" },
  { label: "Cas d'usage", href: "#use-cases" },
  { label: "Témoignages", href: "#temoignages" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-inner group-hover:bg-indigo-700 transition-colors">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">
            Soclik
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden lg:flex items-center gap-5">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/signup"
            className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-6 shadow-md shadow-indigo-600/20 transition-all hover:scale-105 group"
          >
            Essayer gratuitement
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          className="lg:hidden p-2 -mr-2 text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="lg:hidden border-t border-slate-100 bg-white overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col px-4 py-6 gap-5">
              <div className="flex flex-col gap-4">
                {NAV_LINKS.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-medium text-slate-600 hover:text-indigo-600 px-2"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <hr className="border-slate-100 my-2" />

              <div className="flex flex-col gap-4 px-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-slate-900"
                >
                  Connexion
                </Link>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-12 text-base font-semibold shadow-md">
                  Essayer gratuitement
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
