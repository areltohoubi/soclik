"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  PenLine,
  Heart,
  MessageCircle,
  Send,
} from "lucide-react";
import SocialIcon from "./icon/SocialIcon";

// ============================================================================
// VISUAL PROOF SECTION (Le Avant/Après)
// ============================================================================

const EXAMPLES = [
  {
    id: "boulangerie",
    label: "Commerçant",
    platform: "Instagram",
    icon: <SocialIcon type="instagram" className="w-4 h-4" color="#0A66C2" />,
    input:
      "Annoncer l'ouverture de ma boulangerie mardi à 7h. Ton chaleureux, je veux inviter les gens du quartier à venir.",
    output: `🥐 Le grand jour est (enfin) arrivé !

C'est avec quelques papillons dans le ventre que nous vous annonçons l'ouverture de notre boulangerie ce mardi, dès 7h00. 🎉

Au menu de cette première matinée :
✨ L'odeur du pain au levain tout chaud
✨ Des viennoiseries dorées et croustillantes
✨ Et surtout, nos plus beaux sourires pour vous accueillir !

Passez nous dire bonjour avant d'aller travailler ou déposer les enfants, on a hâte de rencontrer nos nouveaux voisins. 👋

📍 12 rue des Artisans
⏰ Ouverture des portes à 7h00 tapantes !

#ArtisanBoulanger #Ouverture #ViennoiserieMaison #BoulangerieFrancaise #VieDeQuartier #Gourmandise`,
  },
  {
    id: "consultant",
    label: "Consultant B2B",
    platform: "LinkedIn",
    icon: <SocialIcon type="linkedin" className="w-4 h-4"/>,
    input:
      "Je lance un nouvel accompagnement pour aider les managers à mieux gérer le télétravail. Ton pro mais direct.",
    output: `Le management à distance ne s'improvise pas (et le micro-management n'est pas une solution). 🛑

Depuis 3 ans, j'observe des managers épuisés qui tentent d'appliquer les mêmes méthodes au bureau et en télétravail. Résultat : perte de confiance, équipes démotivées et réunions Teams interminables.

Aujourd'hui, je lance officiellement mon nouvel accompagnement : "Remote Leadership". 🚀

L'objectif en 4 semaines :
1️⃣ Passer du contrôle à la confiance
2️⃣ Structurer la communication asynchrone
3️⃣ Diviser par deux le temps de réunion

💡 Si votre équipe hybride patine, il n'est pas trop tard pour ajuster le tir. 

Envoyez-moi "REMOTE" en MP et regardons comment adapter vos processus.

#Management #Teletravail #Leadership #FutureOfWork #RessourcesHumaines`,
  },
];

export function VisualProof() {
  const [activeTab, setActiveTab] = useState(EXAMPLES[0]);

  return (
    <section id="preuve" className="w-full py-24 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        <div className="flex flex-col items-center text-center mb-12 max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4"
          >
            Jugez par vous-même.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 font-medium"
          >
            La différence entre un simple générateur de texte et un véritable
            assistant pensé pour l'engagement social media.
          </motion.p>
        </div>

        
        <div className="flex justify-center gap-3 mb-10">
          {EXAMPLES.map((example) => (
            <button
              key={example.id}
              onClick={() => setActiveTab(example)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab.id === example.id
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {example.icon}
              {example.label}
            </button>
          ))}
        </div>

        <div className="relative flex flex-col md:flex-row items-stretch gap-6 md:gap-4 lg:gap-8 max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
          
            <motion.div
              key={`input-${activeTab.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold uppercase tracking-wider mb-6">
                  <PenLine className="w-4 h-4" /> 1. Votre Brief brut
                </div>
                <div className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed font-serif">
                  "{activeTab.input}"
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          
          <div className="hidden md:flex flex-col justify-center items-center relative z-10 px-2">
            <div className="w-12 h-12 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="md:hidden flex justify-center -my-2 relative z-10">
            <div className="w-10 h-10 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center rotate-90">
              <ArrowRight className="w-4 h-4 text-indigo-600" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            
            <motion.div
              key={`output-${activeTab.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <div className="bg-white border-2 border-indigo-50 rounded-2xl shadow-xl shadow-indigo-100/50 overflow-hidden flex flex-col h-full ring-1 ring-indigo-500/10">
           
                <div className="border-b border-slate-100 px-4 py-3 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-900 leading-none mb-1">
                        Votre Marque
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        {activeTab.icon} {activeTab.platform} • Prêt à publier
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded">
                    <Sparkles className="w-3 h-3" /> IA
                  </div>
                </div>


                <div className="p-6 flex-1 text-[15px] text-slate-800 whitespace-pre-line leading-relaxed">
                  {activeTab.output}
                </div>

  
                <div className="px-6 py-4 border-t border-slate-100 flex gap-4 text-slate-400">
                  <Heart className="w-5 h-5 cursor-not-allowed" />
                  <MessageCircle className="w-5 h-5 cursor-not-allowed" />
                  <Send className="w-5 h-5 cursor-not-allowed" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
