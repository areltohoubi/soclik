"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

// ============================================================================
// FAQ SECTION (Orientée Conversion)
// ============================================================================

const FAQS = [
  {
    question: "Dois-je avoir des connaissances en marketing ?",
    answer:
      "Non, pas du tout. L'outil intègre nativement les meilleures pratiques de chaque réseau social (structure, accroches, appels à l'action). Vous fournissez l'idée, l'IA s'occupe de la stratégie d'engagement.",
  },
  {
    question: "Puis-je modifier le texte généré ?",
    answer:
      "Absolument. Considérez-nous comme votre brouillon parfait. Vous gardez 100% du contrôle et pouvez ajuster chaque mot avant de copier-coller le texte final.",
  },
  {
    question: "Est-ce que l'IA va parler « comme un robot » ?",
    answer:
      "Non. C'est d'ailleurs notre plus grande force. Grâce au paramétrage précis du ton (humoristique, formel, inspirant...) et à la prise en compte de votre contexte, le résultat est naturel, humain et parfaitement aligné avec votre marque.",
  },
  {
    question: "Puis-je essayer avant de payer ?",
    answer:
      "Oui, la création de compte est sans engagement et vos premiers posts sont 100% gratuits. Vous pouvez tester la qualité de notre IA sur vos propres sujets avant de prendre une décision.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Le premier est ouvert par défaut

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full py-24 bg-white">
      <div className="max-w-[800px] mx-auto px-4 md:px-8">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
            <HelpCircle className="w-6 h-6 text-indigo-600" />
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4"
          >
            Vous avez des questions ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 font-medium"
          >
            Nous avons levé les derniers doutes pour vous.
          </motion.p>
        </div>

        {/* ACCORDION */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`border-2 rounded-2xl overflow-hidden transition-colors duration-200 ${
                  isOpen
                    ? "border-indigo-600 bg-white shadow-md"
                    : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span
                    className={`font-bold text-lg pr-4 ${isOpen ? "text-indigo-900" : "text-slate-800"}`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isOpen
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-white border border-slate-200 text-slate-400"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed font-medium">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
