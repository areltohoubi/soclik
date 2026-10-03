"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  ChevronDown,
  Check,
  Sparkles,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialIcon from "./icon/SocialIcon";

export function HowItWorks() {
  return (
    <section
      id="solution"
      className="w-full py-24 bg-slate-50/50 overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-20 max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3"
          >
            Le fonctionnement
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4"
          >
            De l'idée à la publication en 4 étapes.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 font-medium"
          >
            Ne rédigez plus. Pilotez.
          </motion.p>
        </div>

        {/* STEPS CONTAINER */}
        <div className="flex flex-col gap-20 md:gap-32">
          {/* STEP 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="order-2 lg:order-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-lg">
                  1
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Décrivez votre activité
                </h3>
              </div>
              <p className="text-slate-500 text-lg leading-relaxed mb-6 ml-14">
                Pas besoin de faire des phrases parfaites. Donnez-nous
                simplement le sujet brut, ce que vous faites, ou l'annonce que
                vous souhaitez partager. L'assistant s'occupe de la mise en
                forme.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="order-1 lg:order-2 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50"
            >
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-400" /> Quel est
                  votre sujet aujourd'hui ?
                </label>
                <div className="w-full min-h-[120px] p-4 bg-slate-50 border-2 border-indigo-100 rounded-xl text-slate-700 font-medium focus-within:border-indigo-500 transition-colors relative">
                  Je suis coach sportif à Lyon. Je lance un nouveau bootcamp en
                  plein air pour cet été dans le parc de la Tête d'Or.
                  <span className="inline-block w-[2px] h-4 bg-indigo-500 ml-1 animate-pulse align-middle" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* STEP 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="order-1 lg:order-1 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50"
            >
              <label className="text-sm font-semibold text-slate-700 mb-4 block">
                Sélectionnez le réseau cible
              </label>
              <div className="grid grid-cols-3 gap-4">
                {/* Active Platform */}
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-indigo-600 bg-indigo-50/50 cursor-pointer relative">
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <SocialIcon type="linkedin" />
                  <span className="text-sm font-bold text-indigo-900">
                    LinkedIn
                  </span>
                </div>
                {/* Inactive Platform */}
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                  <SocialIcon type="instagram" />
                  <span className="text-sm font-medium text-slate-500">
                    Instagram
                  </span>
                </div>
                {/* Inactive Platform */}
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                  <SocialIcon
                    type="twitter"
                  />
                  <span className="text-sm font-medium text-slate-500">
                    X (Twitter)
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="order-2 lg:order-2"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-lg">
                  2
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Choisissez votre plateforme
                </h3>
              </div>
              <p className="text-slate-500 text-lg leading-relaxed mb-6 ml-14">
                Chaque réseau a ses propres codes. L'IA adapte automatiquement
                la longueur, la structure, l'espacement et l'utilisation des
                hashtags pour maximiser votre visibilité selon la plateforme
                choisie.
              </p>
            </motion.div>
          </div>

          {/* STEP 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="order-2 lg:order-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-lg">
                  3
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Définissez le ton
                </h3>
              </div>
              <p className="text-slate-500 text-lg leading-relaxed mb-6 ml-14">
                Votre marque a une personnalité unique. Que vous soyez un
                cabinet d'avocats très formel ou un créateur au ton décalé,
                assurez-vous que la voix générée vous ressemble vraiment.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="order-1 lg:order-2 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 flex justify-center"
            >
              <div className="w-full max-w-sm">
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Voix & Ton
                </label>
                {/* Fake Select Menu Open */}
                <div className="relative">
                  <div className="w-full bg-white border border-slate-300 rounded-lg p-3 flex justify-between items-center shadow-sm">
                    <span className="font-medium text-slate-900 flex items-center gap-2">
                      🔥 Énergique & Inspirant
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400 rotate-180" />
                  </div>
                  {/* Dropdown Options */}
                  <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-10">
                    <div className="p-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2 text-sm text-slate-600">
                      💼 Professionnel & Expert
                    </div>
                    <div className="p-2 bg-indigo-50 border-l-2 border-indigo-600 cursor-pointer flex items-center justify-between text-sm font-medium text-indigo-900">
                      <span className="flex items-center gap-2">
                        🔥 Énergique & Inspirant
                      </span>
                      <Check className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="p-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2 text-sm text-slate-600">
                      😂 Humoristique & Décalé
                    </div>
                    <div className="p-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2 text-sm text-slate-600">
                      🎓 Éducatif & Didactique
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* STEP 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="order-1 lg:order-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50"
            >
              {/* Fake Generated Post Card */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex gap-2 items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" /> Génération réussie
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-slate-900 h-8"
                  >
                    <Copy className="w-4 h-4 mr-1.5" /> Copier
                  </Button>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
                  <div>
                    <div className="h-3 w-24 bg-slate-200 rounded-full mb-2" />
                    <div className="h-2 w-16 bg-slate-100 rounded-full" />
                  </div>
                </div>

                <div className="text-sm text-slate-800 whitespace-pre-line leading-relaxed font-medium">
                  Prêts à transpirer cet été Lyon ? ☀️💪
                  {"\n\n"}
                  On sort des salles obscures ! Je lance officiellement mon
                  nouveau Bootcamp en plein air, au cœur du Parc de la Tête
                  d'Or.
                  {"\n\n"}
                  Au programme : 💥 Dépassement de soi 🤝 Esprit d'équipe 🍃
                  Grand air
                  {"\n\n"}
                  Les places sont limitées pour garder un accompagnement
                  premium. Qui relève le défi avec moi ? 👇
                  {"\n\n"}
                  <span className="text-indigo-600 font-semibold">
                    #CoachingLyon #Bootcamp #FitnessMotivation #TeteDOr
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="order-2 lg:order-2"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-lg">
                  4
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Générez et publiez
                </h3>
              </div>
              <p className="text-slate-500 text-lg leading-relaxed mb-6 ml-14">
                En quelques secondes, obtenez un résultat parfait. Les sauts de
                ligne sont propres, les emojis judicieusement placés, et le
                texte est prêt à engager votre communauté. Vous n'avez plus qu'à
                copier-coller.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
