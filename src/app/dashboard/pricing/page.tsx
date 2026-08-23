"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Minus, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";

// ============================================================================
// 1. DATA CONFIGURATION
// ============================================================================

type BillingCycle = "monthly" | "yearly";

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  highlighted?: boolean;
  badge?: string;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect to test the waters.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "10 AI posts / month",
      "2 platforms",
      "Basic tones",
      "Standard generation",
      "Content history (7 days)",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    description: "For freelancers & creators.",
    monthlyPrice: 9,
    yearlyPrice: 7, // ~20% off
    features: [
      "100 AI posts / month",
      "5 platforms",
      "All tones unlocked",
      "Advanced AI generation",
      "Content history (Unlimited)",
      "Priority generation",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Best for growing brands.",
    monthlyPrice: 19,
    yearlyPrice: 15, // ~20% off
    highlighted: true,
    badge: "Most Popular",
    features: [
      "500 AI posts / month",
      "Unlimited platforms",
      "All tones unlocked",
      "Brand customization",
      "Content variations",
      "Advanced history & analytics",
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "For agencies & large teams.",
    monthlyPrice: 49,
    yearlyPrice: 39, // ~20% off
    features: [
      "2,000 AI posts / month",
      "Unlimited platforms",
      "Advanced brand customization",
      "Multiple brands (Up to 5)",
      "Team features",
      "Highest limits & speed",
    ],
  },
];

const COMPARISON_FEATURES = [
  {
    name: "AI posts per month",
    free: "10",
    starter: "100",
    pro: "500",
    business: "2,000",
  },
  {
    name: "Platforms supported",
    free: "2",
    starter: "5",
    pro: "Unlimited",
    business: "Unlimited",
  },
  {
    name: "Tone options",
    free: "Basic",
    starter: "All",
    pro: "All",
    business: "All",
  },
  {
    name: "Content history",
    free: "7 days",
    starter: "Unlimited",
    pro: "Unlimited",
    business: "Unlimited",
  },
  {
    name: "Priority generation",
    free: false,
    starter: true,
    pro: true,
    business: true,
  },
  {
    name: "Brand customization",
    free: false,
    starter: "Basic",
    pro: "Advanced",
    business: "Advanced",
  },
  {
    name: "Content variations",
    free: false,
    starter: false,
    pro: true,
    business: true,
  },
  {
    name: "Multiple brands",
    free: false,
    starter: false,
    pro: false,
    business: true,
  },
  {
    name: "Team collaboration",
    free: false,
    starter: false,
    pro: false,
    business: true,
  },
];

const FAQ_ITEMS = [
  {
    question: "Can I start for free?",
    answer:
      "Yes. The Free plan lets you start generating content immediately without a credit card. You can upgrade whenever you need more volume or advanced features.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Absolutely. You can upgrade or downgrade your plan at any time. Prorated charges or credits will be automatically applied to your account.",
  },
  {
    question: "What happens when I reach my monthly limit?",
    answer:
      "Content generation will pause until your next billing cycle. You can always upgrade to a higher tier instantly to resume generating content.",
  },
  {
    question: "Is yearly billing cheaper?",
    answer:
      "Yes, choosing yearly billing saves you approximately 20% compared to paying month-to-month.",
  },
];

// ============================================================================
// 2. MAIN PAGE COMPONENT
// ============================================================================

export default function PricingPage() {

  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div className="p-8">Vérification de la session...</div>;
  }
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");

  // Simulation de l'état utilisateur
  const currentPlanId: string = "free";

  return (
    <div className="min-h-full w-full pb-20 pt-8 px-4 md:px-8 max-w-[1400px] mx-auto text-slate-900">
      {/* HEADER SECTION */}
      <div className="flex flex-col items-center text-center mb-12 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-sm font-medium text-indigo-700 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Simple pricing. No surprises.
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900"
        >
          Choose the plan that fits your workflow
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-500 max-w-2xl"
        >
          Start with the essentials. Upgrade when your content needs grow, you
          need more credits, and crave more flexibility.
        </motion.p>

        {/* BILLING TOGGLE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex items-center gap-4 bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-sm"
        >
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`relative px-6 py-2.5 text-sm font-medium rounded-full transition-colors ${
              billingCycle === "monthly"
                ? "text-slate-900 font-semibold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {billingCycle === "monthly" && (
              <motion.div
                layoutId="billing-pill"
                className="absolute inset-0 bg-white rounded-full shadow-sm"
              />
            )}
            <span className="relative z-10">Monthly</span>
          </button>

          <button
            onClick={() => setBillingCycle("yearly")}
            className={`relative px-6 py-2.5 text-sm font-medium rounded-full transition-colors flex items-center gap-2 ${
              billingCycle === "yearly"
                ? "text-slate-900 font-semibold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {billingCycle === "yearly" && (
              <motion.div
                layoutId="billing-pill"
                className="absolute inset-0 bg-white rounded-full shadow-sm"
              />
            )}
            <span className="relative z-10">Yearly</span>
            <span className="relative z-10 text-[10px] uppercase font-bold tracking-wider bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-200">
              Save 20%
            </span>
          </button>
        </motion.div>
      </div>

      {/* PRICING GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-24">
        {PLANS.map((plan, index) => {
          const isCurrentPlan = currentPlanId === plan.id;
          const price =
            billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

          let buttonText = "Upgrade";
          let buttonVariant: "default" | "outline" | "secondary" = "default";

          if (isCurrentPlan) {
            buttonText = "Current Plan";
            buttonVariant = "secondary";
          } else if (plan.id === "free") {
            buttonText =
              currentPlanId === "starter" ||
              currentPlanId === "pro" ||
              currentPlanId === "business"
                ? "Downgrade"
                : "Start for Free";
            buttonVariant = "outline";
          } else {
            buttonText = `Upgrade to ${plan.name}`;
          }

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`relative flex flex-col p-6 rounded-2xl bg-white border shadow-sm transition-all ${
                plan.highlighted
                  ? "border-indigo-500 ring-2 ring-indigo-500/10 shadow-md"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full shadow-sm">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    ${price}
                  </span>
                  <span className="text-slate-400 font-medium">/mo</span>
                </div>
                {billingCycle === "yearly" && plan.monthlyPrice > 0 ? (
                  <p className="text-xs text-emerald-600 mt-2 font-medium">
                    Billed ${plan.yearlyPrice * 12} yearly
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 mt-2 h-4">
                    {plan.id === "free" ? "No credit card required" : ""}
                  </p>
                )}
              </div>

              <Button
                variant={buttonVariant}
                disabled={isCurrentPlan}
                className={`w-full mb-8 font-semibold shadow-sm ${
                  plan.highlighted && !isCurrentPlan
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : isCurrentPlan
                      ? "bg-slate-100 text-slate-400 opacity-100 cursor-default hover:bg-slate-100 border border-slate-200 shadow-none"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {buttonText}
              </Button>

              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 mb-4">
                  What's included:
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-slate-600"
                    >
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FEATURE COMPARISON TABLE */}
      <div className="mb-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Compare all features
          </h2>
          <p className="text-slate-500">
            Get a detailed breakdown of what's included in every plan.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 font-semibold text-slate-900 w-1/3 border-b border-slate-200">
                  Features
                </th>
                <th className="p-6 font-semibold text-slate-900 text-center border-b border-slate-200">
                  Free
                </th>
                <th className="p-6 font-semibold text-slate-900 text-center border-b border-slate-200">
                  Starter
                </th>
                <th className="p-6 font-semibold text-indigo-600 text-center border-b border-slate-200 bg-indigo-50/50">
                  Pro
                </th>
                <th className="p-6 font-semibold text-slate-900 text-center border-b border-slate-200">
                  Business
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COMPARISON_FEATURES.map((feat, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="p-4 pl-6 text-sm font-medium text-slate-700">
                    {feat.name}
                  </td>
                  <td className="p-4 text-center text-sm text-slate-500">
                    <TableValue value={feat.free} />
                  </td>
                  <td className="p-4 text-center text-sm text-slate-500">
                    <TableValue value={feat.starter} />
                  </td>
                  <td className="p-4 text-center text-sm text-slate-700 bg-indigo-50/30">
                    <TableValue value={feat.pro} highlight />
                  </td>
                  <td className="p-4 text-center text-sm text-slate-500">
                    <TableValue value={feat.business} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Frequently asked questions
          </h2>
          <p className="text-slate-500">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. SUB-COMPONENTS
// ============================================================================

function TableValue({
  value,
  highlight = false,
}: {
  value: string | boolean;
  highlight?: boolean;
}) {
  if (typeof value === "boolean") {
    return value ? (
      <Check
        className={`w-4 h-4 mx-auto ${highlight ? "text-indigo-600" : "text-slate-500"}`}
      />
    ) : (
      <Minus className="w-4 h-4 mx-auto text-slate-300" />
    );
  }
  return (
    <span className={highlight ? "font-semibold text-indigo-700" : ""}>
      {value}
    </span>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden transition-colors hover:border-slate-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 text-left font-medium text-slate-900"
      >
        <span>{question}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="p-4 pt-0 text-sm text-slate-500 leading-relaxed border-t border-slate-100 mt-2">
          {answer}
        </div>
      </motion.div>
    </div>
  );
}
