// lib/ai/formatRules.ts
//
// Chaque combinaison plateforme+format est associée à une catégorie de
// règles. Doit rester synchronisé avec ALLOWED_FORMATS_BY_PLATFORM
// (route.ts) et FORMATS_BY_PLATFORM (app/generate/page.tsx).

export type FormatCategory =
  | "caption"
  | "carousel"
  | "video_script"
  | "text_post"
  | "storytelling"
  | "announcement"
  | "thread"
  | "story";

export const FORMAT_CATEGORY: Record<string, Record<string, FormatCategory>> = {
  Instagram: {
    Caption: "caption",
    Carousel: "carousel",
    Reel: "video_script",
    Story: "story",
  },
  Facebook: {
    Post: "text_post",
    "Promotional post": "text_post",
    "Educational post": "text_post",
    Story: "story",
  },
  LinkedIn: {
    "Text post": "text_post",
    "Educational post": "text_post",
    Storytelling: "storytelling",
    "Professional announcement": "announcement",
  },
  TikTok: {
    "Video idea": "video_script",
    "Video script": "video_script",
    "Hook + script": "video_script",
    Caption: "caption",
  },
  X: {
    "Single post": "text_post",
    Thread: "thread",
  },
};

const FORMAT_RULES: Record<FormatCategory, string> = {
  caption: [
    "FORMAT RULES — Caption",
    "- The caption accompanies a visual (image or video) that already exists — do not describe the visual itself.",
    "- Keep it focused on a single clear message.",
    '- Put the caption text in "content". Leave "caption" null unless a distinct, shorter overlay caption is also genuinely needed.',
  ].join("\n"),

  carousel: [
    "FORMAT RULES — Carousel",
    "- Create a logical progression between slides — each slide should build on the previous one.",
    "- Slide 1 must act as the hook, strong enough to make someone swipe.",
    "- Each slide should communicate exactly one clear idea — never cram multiple points into a single slide.",
    "- The final slide must contain the call to action.",
    "- Keep slide text concise — a few short lines per slide, written to be read at a glance.",
    '- Populate "slides" with one string per slide, in order. Leave "script" null.',
  ].join("\n"),

  video_script: [
    "FORMAT RULES — Video script",
    "- Write for spoken delivery, not for reading.",
    "- Start with a strong hook in the very first line.",
    "- Structure the script clearly: hook → body → CTA, using natural spoken transitions.",
    "- Avoid long or complex sentences — short, punchy phrasing works better when spoken aloud.",
    '- Populate "script" with the full script. Leave "slides" null.',
  ].join("\n"),

  text_post: [
    "FORMAT RULES — Text post",
    "- The post stands alone without a visual — content must fully carry the message.",
    "- Structure it with a hook, a clear middle point, and a CTA.",
    "- Keep paragraphs short for readability.",
  ].join("\n"),

  storytelling: [
    "FORMAT RULES — Storytelling",
    "- Use a narrative structure: situation → tension or challenge → resolution → takeaway.",
    "- Ground the story in specifics rather than generic statements.",
    "- Connect the story naturally to the objective and CTA — don't bolt the CTA on disconnected from the narrative.",
  ].join("\n"),

  announcement: [
    "FORMAT RULES — Professional announcement",
    "- Lead with the news itself in the first line — do not bury it.",
    "- Keep the tone confident and clear; avoid excessive enthusiasm or exclamation marks.",
    "- Include relevant context (why it matters) before the CTA.",
  ].join("\n"),

  thread: [
    "FORMAT RULES — Thread",
    "- The first entry must hook the reader and make clear why the rest is worth reading.",
    "- Each entry should deliver one distinct point and flow logically into the next.",
    "- The final entry must include the CTA and close the thread naturally.",
  ].join("\n"),

  story: [
    "FORMAT RULES — Story",
    "- Extremely short and casual — written for full-screen, ephemeral viewing.",
    "- One idea, one message, minimal text.",
    "- The CTA should be simple and direct (e.g. swipe up, tap, DM), matching the requested CTA.",
  ].join("\n"),
};

export function getFormatRules(
  platform: string,
  contentFormat: string,
): string {
  const category = FORMAT_CATEGORY[platform]?.[contentFormat];
  if (!category) return "";
  return FORMAT_RULES[category];
}
