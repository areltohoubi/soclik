// lib/ai/callAIProvider.ts
import { AIProviderResult, AIGeneratedPost } from "@/types/aiTypes";
import OpenAI from "openai";

// npm install openai
// OPENAI_API_KEY doit être défini côté serveur uniquement (.env.local),
// jamais exposé au client (pas de préfixe NEXT_PUBLIC_).

export const AI_PROVIDER = "openai";

// Le nom exact du modèle doit être vérifié dans la documentation OpenAI
// avant chaque déploiement — un alias qui existe aujourd'hui peut changer
// ou être retiré. Configurable via variable d'environnement pour pouvoir
// le changer sans toucher au code.
export const AI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1";

let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("MISSING_OPENAI_API_KEY");
    }
    _client = new OpenAI({ apiKey });
  }
  return _client;
}

const POST_SCHEMA = {
  type: "object",
  properties: {
    title: { type: ["string", "null"] },
    hook: { type: ["string", "null"] },
    content: { type: ["string", "null"] },
    caption: { type: ["string", "null"] },
    hashtags: { type: ["string", "null"] },
    cta: { type: ["string", "null"] },
    script: { type: ["string", "null"] },
    slides: { type: ["array", "null"], items: { type: "string" } },
  },
  required: [
    "title",
    "hook",
    "content",
    "caption",
    "hashtags",
    "cta",
    "script",
    "slides",
  ],
  additionalProperties: false,
} as const;

// Sortie structurée forcée via response_format json_schema (strict mode) :
// le modèle ne peut pas dévier du schéma, plus fiable qu'un "return only
// JSON" laissé dans le prompt.
const RESPONSE_SCHEMA = {
  name: "generated_posts",
  strict: true,
  schema: {
    type: "object",
    properties: {
      posts: { type: "array", items: POST_SCHEMA },
    },
    required: ["posts"],
    additionalProperties: false,
  },
} as const;

function estimateMaxTokens(numberOfPosts: number): number {
  // ~600 tokens par post, borné pour rester raisonnable même sur un batch de 20.
  return Math.min(Math.max(numberOfPosts * 600, 1024), 8192);
}

/**
 * Appelle le modèle pour générer les posts à partir d'un prompt déjà
 * construit (voir buildPrompt.ts — le même texte doit être celui stocké
 * dans generations.prompt). Jette une erreur si l'appel échoue, si la
 * réponse est vide/mal formée, ou si le nombre de posts renvoyés ne
 * correspond pas exactement à numberOfPosts — à charge de l'appelant
 * (route.ts) de rembourser les crédits en cas d'échec.
 */
export async function callAIProvider(
  prompt: string,
  numberOfPosts: number,
): Promise<AIProviderResult> {
  const client = getClient();

  const completion = await client.chat.completions.create({
    model: AI_MODEL,
    max_tokens: estimateMaxTokens(numberOfPosts),
    messages: [{ role: "user", content: prompt }],
    response_format: {
      type: "json_schema",
      json_schema: RESPONSE_SCHEMA,
    },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("AI_EMPTY_RESPONSE");
  }

  let parsed: { posts?: unknown };
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI_INVALID_JSON");
  }

  const rawPosts = parsed.posts;
  if (!Array.isArray(rawPosts)) {
    throw new Error("AI_INVALID_FORMAT");
  }

  // Strict : on exige exactement numberOfPosts résultats. Un utilisateur
  // qui a payé pour 5 posts ne doit jamais recevoir une génération
  // "réussie" avec seulement 3 posts — mieux vaut échouer et rembourser.
  if (rawPosts.length !== numberOfPosts) {
    throw new Error(
      `AI_INVALID_POST_COUNT: expected ${numberOfPosts}, got ${rawPosts.length}`,
    );
  }

  const posts: AIGeneratedPost[] = rawPosts.map((p: any) => ({
    title: p?.title ?? null,
    hook: p?.hook ?? null,
    content: p?.content ?? null,
    caption: p?.caption ?? null,
    hashtags: p?.hashtags ?? null,
    cta: p?.cta ?? null,
    script: p?.script ?? null,
    slides: Array.isArray(p?.slides) ? p.slides : null,
  }));

  return { posts };
}
