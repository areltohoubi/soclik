"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import { createClient } from "@/lib/supabase/supabaseClient";

// ============================================================================
// TYPES & DATA
// ============================================================================

interface GenerationState {
  industry: string;
  productDescription: string;
  uniqueValueProposition: string;
  targetAudience: string;
  audienceDescription: string;
  targetMarket: string;
  platform: string;
  contentFormat: string;
  objective: string;
  tone: string;
  callToAction: string;
  customCTA: string;
  language: string;
  contentLength: string;
  additionalInstructions: string;
  numberOfPosts: number;
}

interface GeneratedPost {
  id: string;
  post_number: number;
  title: string | null;
  content: string | null;
  hook: string | null;
  caption: string | null;
  hashtags: string | null;
  cta: string | null;
  script: string | null;
  slides: unknown;
}

const INITIAL_STATE: GenerationState = {
  industry: "",
  productDescription: "",
  uniqueValueProposition: "",
  targetAudience: "",
  audienceDescription: "",
  targetMarket: "",
  platform: "",
  contentFormat: "",
  objective: "",
  tone: "",
  callToAction: "",
  customCTA: "",
  language: "",
  contentLength: "Medium",
  additionalInstructions: "",
  numberOfPosts: 5,
};

const PLATFORMS = ["Instagram", "Facebook", "LinkedIn", "TikTok", "X"];

const FORMATS_BY_PLATFORM: Record<string, string[]> = {
  Instagram: ["Caption", "Carousel", "Reel", "Story"],
  Facebook: ["Post", "Promotional post", "Educational post", "Story"],
  LinkedIn: [
    "Text post",
    "Educational post",
    "Storytelling",
    "Professional announcement",
  ],
  TikTok: ["Video idea", "Video script", "Hook + script", "Caption"],
  X: ["Single post", "Thread"],
};

// Coût en crédits par plateforme + format. C'est UNIQUEMENT une estimation
// pour l'affichage — le coût réellement débité est calculé par le RPC
// Postgres `consume_credits_and_create_generation`, qui est la seule source
// de vérité. Cette table DOIT rester synchronisée avec le `case` du RPC,
// sinon l'utilisateur verra une estimation fausse (le débit réel restera
// correct dans tous les cas, mais l'UX sera trompeuse).
const FORMAT_CREDIT_COST: Record<string, Record<string, number>> = {
  Instagram: { Caption: 1, Carousel: 2, Reel: 3, Story: 1 },
  Facebook: {
    Post: 1,
    "Promotional post": 1,
    "Educational post": 1,
    Story: 1,
  },
  LinkedIn: {
    "Text post": 1,
    "Educational post": 1,
    Storytelling: 2,
    "Professional announcement": 1,
  },
  TikTok: {
    "Video idea": 1,
    "Video script": 3,
    "Hook + script": 3,
    Caption: 1,
  },
  X: { "Single post": 1, Thread: 2 },
};

function estimateCreditCost(
  platform: string,
  contentFormat: string,
  numberOfPosts: number,
): number {
  const unitCost = FORMAT_CREDIT_COST[platform]?.[contentFormat] ?? 1;
  return unitCost * Math.max(numberOfPosts, 1);
}

const OBJECTIVES = [
  { id: "sales", label: "Increase sales" },
  { id: "leads", label: "Generate leads" },
  { id: "engagement", label: "Increase engagement" },
  { id: "awareness", label: "Build brand awareness" },
];

const TONES = [
  "Professional",
  "Sales",
  "Educational",
  "Bold",
  "Friendly",
  "Inspirational",
];
const LANGUAGES = ["Français", "English", "Español", "Português", "Arabic"];
const CALLS_TO_ACTION = [
  "WhatsApp",
  "Acheter",
  "Contacter",
  "Réserver",
  "En savoir plus",
  "Custom",
];
const LENGTHS = ["Short", "Medium", "Long"];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const mapLanguageToUI = (lang: string): string => {
  const mapping: Record<string, string> = {
    French: "Français",
    English: "English",
    Spanish: "Español",
    Portuguese: "Português",
    Arabic: "Arabic",
  };
  return mapping[lang] || lang;
};

const mapLanguageToDB = (lang: string): string => {
  const mapping: Record<string, string> = {
    Français: "French",
    English: "English",
    Español: "Spanish",
    Português: "Portuguese",
    Arabic: "Arabic",
  };
  return mapping[lang] || lang;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function GeneratePage() {
  const { user, isLoading, brandProfile } = useAuth();
  const router = useRouter();

  // brandProfileId est un uuid (string), pas un objet BrandProfile.
  const [brandProfileId, setBrandProfileId] = useState<string | null>(
    brandProfile?.id ?? null,
  );
  const [brandProfileLoading, setBrandProfileLoading] = useState(true);
  const [brandProfileError, setBrandProfileError] = useState<string | null>(
    null,
  );
  const [formData, setFormData] = useState<GenerationState>(INITIAL_STATE);
  const [generatedResults, setGeneratedResults] = useState<
    GeneratedPost[] | null
  >(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const supabase = createClient();

  // requestId persiste tant qu'un batch n'est pas terminé (succès) ou pas
  // explicitement invalidé (échec définitif remboursé). Il est réutilisé
  // en cas d'erreur réseau pour qu'un retry ne recharge jamais de crédits
  // deux fois — c'est ce que le RPC utilise pour son idempotence.
  const requestIdRef = useRef<string | null>(null);

  // ---- Redirect si non authentifié ----
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  // ---- Load brand profile when user is available ----
  useEffect(() => {
    if (!user) return;

    async function loadBrandProfile() {
      try {
        setBrandProfileLoading(true);
        const { data, error } = await supabase
          .from("brand_profiles")
          .select("*")
          .eq("user_id", user?.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setBrandProfileId(data.id);

          setFormData((prev) => ({
            ...prev,
            industry: prev.industry || data.industry || "",
            productDescription:
              prev.productDescription || data.description || "",
            uniqueValueProposition:
              prev.uniqueValueProposition ||
              data.unique_value_proposition ||
              "",
            targetAudience: prev.targetAudience || data.target_audience || "",
            audienceDescription:
              prev.audienceDescription || data.audience_description || "",
            targetMarket: prev.targetMarket || data.target_market || "",
            language:
              prev.language || mapLanguageToUI(data.default_language) || "",
            tone: prev.tone || data.brand_tone || "",
            callToAction:
              prev.callToAction ||
              (data.default_cta &&
              data.default_cta !== "Custom" &&
              CALLS_TO_ACTION.includes(data.default_cta)
                ? data.default_cta
                : ""),
            additionalInstructions:
              prev.additionalInstructions || data.additional_instructions || "",
          }));
        }
      } catch (err: any) {
        console.error("Error loading brand profile:", err);
        setBrandProfileError("Failed to load brand profile");
      } finally {
        setBrandProfileLoading(false);
      }
    }

    loadBrandProfile();
  }, [user]);

  // ---- Dynamic missing fields validation ----
  const getMissingFields = () => {
    const missing: string[] = [];
    if (!formData.industry.trim()) missing.push("Industry");
    if (!formData.productDescription.trim())
      missing.push("Product description");
    if (!formData.targetAudience.trim()) missing.push("Target Audience");
    if (!formData.platform) missing.push("Platform");
    if (!formData.contentFormat) missing.push("Content Format");
    if (!formData.objective) missing.push("Objective");
    if (!formData.tone) missing.push("Tone");
    if (!formData.language) missing.push("Language");
    if (!formData.callToAction) missing.push("Call to Action");
    if (formData.callToAction === "Custom" && !formData.customCTA.trim())
      missing.push("Custom CTA");
    return missing;
  };

  const missingFields = getMissingFields();
  const isValid = missingFields.length === 0;

  const estimatedCost =
    formData.platform && formData.contentFormat
      ? estimateCreditCost(
          formData.platform,
          formData.contentFormat,
          formData.numberOfPosts,
        )
      : formData.numberOfPosts;

  // ---- Handle generation : passe UNIQUEMENT par la route serveur sécurisée.
  // Le client ne touche jamais directement à `generations` ni aux crédits. ----
  const handleGenerate = async () => {
    if (!isValid || !user || isGenerating) return;

    if (!requestIdRef.current) {
      requestIdRef.current = crypto.randomUUID();
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: requestIdRef.current,
          brandProfileId,
          industry: formData.industry,
          productDescription: formData.productDescription,
          uniqueValueProposition: formData.uniqueValueProposition,
          targetAudience: formData.targetAudience,
          audienceDescription: formData.audienceDescription,
          targetMarket: formData.targetMarket,
          objective: formData.objective,
          callToAction:
            formData.callToAction === "Custom"
              ? formData.customCTA
              : formData.callToAction,
          platform: formData.platform,
          contentFormat: formData.contentFormat,
          tone: formData.tone,
          language: mapLanguageToDB(formData.language),
          additionalInstructions: formData.additionalInstructions,
          numberOfPosts: formData.numberOfPosts,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setGenerationError(
            "Not enough credits for this generation. Please buy more credits or upgrade your plan.",
          );
        } else if (res.status === 409) {
          // Cette génération a déjà échoué et a été remboursée côté serveur.
          // On force un nouveau requestId : le prochain clic sera une
          // toute nouvelle génération, facturée normalement.
          requestIdRef.current = null;
          setGenerationError(
            "This generation already failed and was refunded. Please try again.",
          );
        } else {
          setGenerationError(
            data.error ?? "Something went wrong. Please try again.",
          );
        }
        return;
      }

      setGeneratedResults(data.posts ?? []);
      // Batch terminé avec succès : le prochain clic sera une nouvelle
      // génération distincte, donc un nouveau requestId.
      requestIdRef.current = null;
    } catch (err) {
      // Erreur réseau : on GARDE le même requestId. Un nouveau clic sur
      // "Generate" retentera la même requête sans redébiter de crédits,
      // grâce à l'idempotence gérée par le RPC.
      console.error("Error during generation:", err);
      setGenerationError(
        "Network error. Please check your connection and try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // ---- Update form helper ----
  const updateForm = (key: keyof GenerationState, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key === "platform") {
      setFormData((prev) => ({ ...prev, contentFormat: "" }));
    }
    if (key === "callToAction" && value !== "Custom") {
      setFormData((prev) => ({ ...prev, customCTA: "" }));
    }
  };

  // ---- Early returns after all hooks ----
  if (isLoading || !user) {
    return <div className="p-8">Vérification de la session...</div>;
  }

  // ---- Render ----
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-4 py-8 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-violet-100 text-violet-700 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI-powered content generation
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Create your next content batch
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Configure your business details, audience, and goals. We'll handle
            the writing.
          </p>
          {brandProfileLoading && (
            <div className="mt-2 text-sm text-violet-600">
              Loading brand profile...
            </div>
          )}
          {brandProfileError && (
            <div className="mt-2 text-sm text-red-500">{brandProfileError}</div>
          )}
        </div>
      </header>

      {/* TWO-COLUMN LAYOUT */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 p-4 md:p-8">
        {/* LEFT COLUMN - FORM */}
        <div className="flex-1 space-y-8">
          {/* SECTION 1: BUSINESS */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-1">1. Business information</h2>
            <p className="text-sm text-slate-500 mb-6">
              What do you do and what makes you unique?
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Business / Industry <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Digital Marketing Agency, Restaurant..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                  value={formData.industry}
                  onChange={(e) => updateForm("industry", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  What are you promoting?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe your product, service or offer..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                  value={formData.productDescription}
                  onChange={(e) =>
                    updateForm("productDescription", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  What makes you different? (USP)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24/7 Support, Eco-friendly, 10 years experience..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                  value={formData.uniqueValueProposition}
                  onChange={(e) =>
                    updateForm("uniqueValueProposition", e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: AUDIENCE */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-1">2. Target Audience</h2>
            <p className="text-sm text-slate-500 mb-6">
              Who are you trying to reach?
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Audience Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B2B, Students, Mothers..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                    value={formData.targetAudience}
                    onChange={(e) =>
                      updateForm("targetAudience", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Target Market (Region/Country)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. West Africa, France, Global..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                    value={formData.targetMarket}
                    onChange={(e) => updateForm("targetMarket", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Audience Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe their pain points, desires, demographics..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                  value={formData.audienceDescription}
                  onChange={(e) =>
                    updateForm("audienceDescription", e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          {/* SECTION 3: PLATFORM & FORMAT */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-1">3. Platform & Format</h2>
            <p className="text-sm text-slate-500 mb-6">
              Where will you publish this content?
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform}
                  onClick={() => updateForm("platform", platform)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    formData.platform === platform
                      ? "bg-violet-50 border-violet-600 text-violet-700 ring-1 ring-violet-600"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {formData.platform && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Content Format <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {FORMATS_BY_PLATFORM[formData.platform].map((format) => (
                      <button
                        key={format}
                        onClick={() => updateForm("contentFormat", format)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          formData.contentFormat === format
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* SECTION 4: GOAL & VOICE */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-1">4. Goal & Voice</h2>
            <p className="text-sm text-slate-500 mb-6">
              Define your objective, tone and language.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Language <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => updateForm("language", lang)}
                      className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                        formData.language === lang
                          ? "bg-violet-50 border-violet-600 text-violet-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tone of Voice <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((tone) => (
                    <button
                      key={tone}
                      onClick={() => updateForm("tone", tone)}
                      className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                        formData.tone === tone
                          ? "bg-violet-50 border-violet-600 text-violet-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Objective */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Main Objective <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {OBJECTIVES.map((obj) => (
                    <button
                      key={obj.id}
                      onClick={() => updateForm("objective", obj.label)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        formData.objective === obj.label
                          ? "bg-slate-900 border-slate-900 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {obj.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Call to Action <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {CALLS_TO_ACTION.map((cta) => (
                    <button
                      key={cta}
                      onClick={() => updateForm("callToAction", cta)}
                      className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                        formData.callToAction === cta
                          ? "bg-violet-50 border-violet-600 text-violet-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {cta}
                    </button>
                  ))}
                </div>
                {formData.callToAction === "Custom" && (
                  <input
                    type="text"
                    placeholder="Enter your custom CTA..."
                    className="w-full md:w-1/2 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                    value={formData.customCTA}
                    onChange={(e) => updateForm("customCTA", e.target.value)}
                  />
                )}
              </div>
            </div>
          </section>

          {/* SECTION 5: ADVANCED SETTINGS */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
            >
              <div>
                <h2 className="text-lg font-bold">
                  5. Generation Settings (Advanced)
                </h2>
                <p className="text-sm text-slate-500">
                  Length & extra instructions
                </p>
              </div>
              {showAdvanced ? (
                <ChevronUp className="text-slate-400" />
              ) : (
                <ChevronDown className="text-slate-400" />
              )}
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="px-6 pb-6 border-t border-slate-100 pt-4"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Content Length
                      </label>
                      <div className="flex gap-2">
                        {LENGTHS.map((len) => (
                          <button
                            key={len}
                            onClick={() => updateForm("contentLength", len)}
                            className={`px-4 py-2 rounded-md text-sm border transition-colors ${
                              formData.contentLength === len
                                ? "bg-slate-900 border-slate-900 text-white"
                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {len}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Additional Instructions
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Any specific keywords, emojis to avoid, or framing to use?"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                        value={formData.additionalInstructions}
                        onChange={(e) =>
                          updateForm("additionalInstructions", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* RIGHT COLUMN - SUMMARY & ACTION */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="sticky top-8 space-y-6">
            {!generatedResults ? (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">
                  Your generation
                </h3>

                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Product</dt>
                    <dd className="font-medium text-slate-900 text-right max-w-[200px] truncate">
                      {formData.productDescription || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Audience</dt>
                    <dd className="font-medium text-slate-900 text-right max-w-[200px] truncate">
                      {formData.targetAudience || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Platform</dt>
                    <dd className="font-medium text-slate-900">
                      {formData.platform || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Format</dt>
                    <dd className="font-medium text-slate-900">
                      {formData.contentFormat || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Language</dt>
                    <dd className="font-medium text-slate-900">
                      {formData.language || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Tone</dt>
                    <dd className="font-medium text-slate-900">
                      {formData.tone || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Objective</dt>
                    <dd className="font-medium text-slate-900">
                      {formData.objective || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">CTA</dt>
                    <dd className="font-medium text-slate-900 text-right max-w-[150px] truncate">
                      {formData.callToAction === "Custom"
                        ? formData.customCTA || "Custom"
                        : formData.callToAction || "—"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-700">
                      Number of posts
                    </span>
                    <div className="flex items-center border border-slate-200 rounded-lg">
                      <button
                        className="px-3 py-1 text-slate-500 hover:text-slate-900 disabled:opacity-50"
                        disabled={formData.numberOfPosts <= 1}
                        onClick={() =>
                          updateForm(
                            "numberOfPosts",
                            Math.max(1, formData.numberOfPosts - 1),
                          )
                        }
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-medium min-w-[3rem] text-center">
                        {formData.numberOfPosts}
                      </span>
                      <button
                        className="px-3 py-1 text-slate-500 hover:text-slate-900"
                        onClick={() =>
                          updateForm(
                            "numberOfPosts",
                            Math.min(20, formData.numberOfPosts + 1),
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* MISSING FIELDS ALERT */}
                  {!isValid && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-xs text-red-600">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">
                          Missing required fields:{" "}
                        </span>
                        {missingFields.join(", ")}.
                      </div>
                    </div>
                  )}

                  {/* GENERATION ERROR ALERT */}
                  {generationError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-xs text-red-600">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>{generationError}</div>
                    </div>
                  )}

                  {/* GENERATE BUTTON */}
                  <Button
                    onClick={handleGenerate}
                    disabled={!isValid || isGenerating}
                    className={`w-full font-medium py-6 rounded-lg transition-all ${
                      isValid && !isGenerating
                        ? "bg-violet-600 hover:bg-violet-700 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating content...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Generate {formData.numberOfPosts} Posts ·{" "}
                        {estimatedCost} credits
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              /* POST-GENERATION RESULTS */
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg">
                  Generated Content
                </h3>
                {generatedResults.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-1 rounded">
                        {formData.contentFormat}
                      </span>
                      <span className="text-xs text-slate-400">
                        Post {post.post_number}
                      </span>
                    </div>
                    {post.hook && (
                      <p className="text-sm font-semibold text-slate-900 mb-2">
                        {post.hook}
                      </p>
                    )}
                    <p className="text-slate-700 text-sm mb-2 leading-relaxed whitespace-pre-wrap">
                      {post.content || post.script || post.caption || ""}
                    </p>
                    {post.hashtags && (
                      <p className="text-xs text-violet-500 mb-4">
                        {post.hashtags}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            post.content || post.script || post.caption || "",
                          )
                        }
                      >
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Improve
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  className="w-full text-violet-600 hover:text-violet-700 hover:bg-violet-50 mt-4"
                  onClick={() => {
                    setGeneratedResults(null);
                    setGenerationError(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Create another batch
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
