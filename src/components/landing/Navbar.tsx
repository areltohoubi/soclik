"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Menu, CheckCircle2, Wand2, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-indigo-600">
          <BrainCircuit className="w-6 h-6" />
          <span className="font-bold text-lg text-slate-900 tracking-tight">
            Soclik
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Produit
          </Link>
          <Link
            href="#use-cases"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Cas d'usage
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Tarifs
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Connexion
          </Link>
          <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-5 shadow-sm">
            Essayer gratuitement
          </Button>
        </div>
        <button
          className="md:hidden text-slate-500 hover:text-slate-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white p-4 flex flex-col gap-4 shadow-lg">
          <Link href="#features" className="text-sm font-medium text-slate-600">
            Produit
          </Link>
          <Link
            href="#use-cases"
            className="text-sm font-medium text-slate-600"
          >
            Cas d'usage
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-slate-600">
            Tarifs
          </Link>
          <hr className="border-slate-100" />
          <Link href="/login" className="text-sm font-medium text-slate-600">
            Connexion
          </Link>
          <Button className="w-full bg-slate-900 text-white rounded-full">
            Essayer gratuitement
          </Button>
        </div>
      )}
    </nav>
  );
}
