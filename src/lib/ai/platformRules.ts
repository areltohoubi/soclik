// lib/ai/platformRules.ts
//
// Doit rester synchronisé avec la liste des plateformes du front
// (app/generate/page.tsx, PLATFORMS) et de la route (route.ts,
// ALLOWED_FORMATS_BY_PLATFORM).

export const PLATFORM_RULES: Record<string, string> = {
  Instagram: [
    "PLATFORM RULES — Instagram",
    "- Write with a visual-first mindset: assume the post is paired with an image, carousel, or video.",
    "- Favor short paragraphs and line breaks over dense blocks of text.",
    "- The first line must be scroll-stopping — more so than on any other platform.",
    "- Emojis can be used sparingly to add rhythm, never as decoration or filler.",
    "- Hashtags are expected and should be topic-relevant, not generic filler.",
  ].join("\n"),

  Facebook: [
    "PLATFORM RULES — Facebook",
    "- Use a slightly more conversational, community-oriented tone than Instagram.",
    "- Slightly longer copy is acceptable if it stays engaging — Facebook audiences tolerate more text.",
    "- Invite discussion or reaction where it fits naturally (a question, an opinion) without forcing it.",
    "- Avoid hashtag lists — Facebook audiences respond better to natural language.",
  ].join("\n"),

  LinkedIn: [
    "PLATFORM RULES — LinkedIn",
    "- Keep a professional, credible tone even when the requested tone is casual.",
    "- Lead with a clear, concrete idea or insight — not a generic hook.",
    "- Use short paragraphs (1–2 sentences) with line breaks; avoid long blocks of text.",
    "- Avoid salesy language; favor expertise, results, and concrete value.",
    "- If hashtags are used, keep them minimal (2–4) and industry-relevant.",
  ].join("\n"),

  TikTok: [
    "PLATFORM RULES — TikTok",
    "- Prioritize a strong opening hook in the first couple of seconds of spoken content.",
    "- Use concise, spoken, conversational language — write for the ear, not the eye.",
    "- Make the script easy to say naturally out loud; avoid complex sentence structures.",
    "- Maintain energy and attention throughout — no slow middle section.",
    "- Any accompanying caption should be short and punchy, not a rewrite of the script.",
  ].join("\n"),

  X: [
    "PLATFORM RULES — X (Twitter)",
    "- Be concise and direct — every sentence must earn its place.",
    "- Favor a single clear point of view or idea per post.",
    "- In a thread, each entry should stand reasonably on its own while building toward the next.",
    "- Avoid hashtag stuffing — at most 1–2, and only if genuinely relevant.",
  ].join("\n"),
};

export function getPlatformRules(platform: string): string {
  return PLATFORM_RULES[platform] ?? "";
}
