// lib/ai/buildPrompt.ts
import { getPlatformRules } from "./platformRules";
import { getFormatRules } from "./formatRules";
import { GenerationParams } from "@/types/aiTypes";

const CONTENT_QUALITY_RULES = [
  "CONTENT QUALITY RULES",
  "- Prioritize relevance over generic marketing language.",
  "- Do not invent facts, statistics, testimonials, guarantees, prices, features, or claims that were not provided in the input below.",
  "- Make the content sound natural and human, not AI-generated.",
  '- Avoid generic hooks and clichés ("Are you tired of...", "Introducing...", "In today\'s world...").',
  "- Adapt the writing style to the platform and content format described below.",
  "- Make the opening line attention-grabbing without resorting to clickbait or misleading claims.",
  "- Focus on the stated objective and target audience.",
  "- Every post in this batch must have a distinct marketing angle — do not repeat the same structure, opening, or argument across posts.",
].join("\n");

const FIELD_DEFINITIONS = [
  "FIELD DEFINITIONS",
  "title: Optional short internal label for this post (not shown publicly). Can be null.",
  "hook: The opening sentence designed to capture attention immediately.",
  "content: The main body of the post — the core message.",
  'caption: The final caption text as it would be published. Only duplicate "content" here if the format genuinely requires a separate short caption (e.g. under an image or video); otherwise set to null and let "content" carry the text.',
  "hashtags: A string of relevant hashtags separated by spaces, or null if not relevant for this format.",
  "cta: The exact call to action used in this post — see CTA RULE below.",
  "script: Only for video-style formats — the full spoken script. Null for all other formats.",
  "slides: Only for carousel-style formats — an array of strings, one per slide, in order. Null for all other formats.",
].join("\n");

const CTA_RULE = [
  "CTA RULE",
  "Use the requested call to action naturally in the post. Do not replace it with a different call to action unless it is genuinely impossible or incompatible with the selected format — in that case, adapt it as minimally as possible while preserving its intent.",
].join("\n");

const FACTUAL_ACCURACY = [
  "FACTUAL ACCURACY",
  "Only use facts, claims, prices, statistics, guarantees, testimonials, features, and benefits that are explicitly provided in the input below. Never invent business information. If important information is missing, write compelling content without inventing it — rely on tone, angle, and framing instead.",
].join("\n");

function buildBusinessDetailsBlock(params: GenerationParams): string {
  const lines = [
    "BUSINESS & GENERATION DETAILS",
    `Business / industry: ${params.industry}`,
    `What they are promoting: ${params.productDescription}`,
  ];

  if (params.uniqueValueProposition) {
    lines.push(`Unique value proposition: ${params.uniqueValueProposition}`);
  }

  lines.push(`Target audience: ${params.targetAudience}`);
  if (params.audienceDescription) {
    lines.push(`Audience details: ${params.audienceDescription}`);
  }
  if (params.targetMarket) {
    lines.push(`Target market: ${params.targetMarket}`);
  }

  lines.push(
    `Objective: ${params.objective}`,
    `Tone of voice: ${params.tone}`,
    `Platform: ${params.platform}`,
    `Content format: ${params.contentFormat}`,
    `Requested call to action: ${params.callToAction}`,
  );

  return lines.join("\n");
}

function buildUserInstructionsBlock(params: GenerationParams): string | null {
  if (!params.additionalInstructions?.trim()) return null;

  return [
    "USER-SPECIFIC INSTRUCTIONS",
    "The following instructions were provided by the user for this generation.",
    "Follow them when they do not conflict with the content quality, platform, format, factual accuracy, or CTA rules above.",
    '"""',
    params.additionalInstructions.trim(),
    '"""',
  ].join("\n");
}

/**
 * Compose le prompt final :
 * rôle + règles qualité + règles plateforme + règles format + définitions
 * de champs + règle CTA + exactitude factuelle + détails business +
 * instructions utilisateur + contraintes de sortie.
 * Ce même texte est stocké dans generations.prompt pour l'audit.
 */
export function buildPrompt(params: GenerationParams): string {
  const sections = [
    `You are an expert social media copywriter producing content for a business's ${params.platform} account.`,
    CONTENT_QUALITY_RULES,
    getPlatformRules(params.platform),
    getFormatRules(params.platform, params.contentFormat),
    FIELD_DEFINITIONS,
    CTA_RULE,
    FACTUAL_ACCURACY,
    buildBusinessDetailsBlock(params),
    buildUserInstructionsBlock(params),
    [
      "OUTPUT REQUIREMENTS",
      `Generate exactly ${params.numberOfPosts} post(s). Do not generate fewer or more.`,
      `Write all posts entirely in ${params.language}.`,
    ].join("\n"),
  ];

  return sections
    .filter((s): s is string => Boolean(s && s.trim()))
    .join("\n\n");
}
