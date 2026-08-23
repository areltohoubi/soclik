// app/api/generate/route.ts
import { createClient } from "@/lib/supabase/supabaseServer";
import { NextResponse } from "next/server";
import { buildPrompt } from "@/lib/ai/buildPrompt";
import { AI_MODEL, AI_PROVIDER, callAIProvider } from "@/lib/ai/callAIProvider";

// Doit rester synchronisé avec FORMATS_BY_PLATFORM côté client (app/generate)
// et avec le `case p_platform || ':' || p_content_format` du RPC Postgres.
// Dupliqué ici volontairement : la validation serveur ne doit jamais dépendre
// de code exécuté côté navigateur.
const ALLOWED_FORMATS_BY_PLATFORM: Record<string, string[]> = {
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

interface GenerateRequestBody {
  requestId?: string;
  brandProfileId?: string | null;
  industry?: string;
  productDescription?: string;
  uniqueValueProposition?: string;
  targetAudience?: string;
  audienceDescription?: string;
  targetMarket?: string;
  objective?: string;
  callToAction?: string;
  platform?: string;
  contentFormat?: string;
  tone?: string;
  language?: string;
  additionalInstructions?: string;
  numberOfPosts?: number;
}

function validateBody(body: GenerateRequestBody): string | null {
  if (!body.requestId) return "Missing requestId";
  if (!body.industry?.trim()) return "Missing industry";
  if (!body.productDescription?.trim()) return "Missing productDescription";
  if (!body.targetAudience?.trim()) return "Missing targetAudience";
  if (!body.objective?.trim()) return "Missing objective";
  if (!body.tone?.trim()) return "Missing tone";
  if (!body.language?.trim()) return "Missing language";
  if (!body.callToAction?.trim()) return "Missing callToAction";

  if (!body.platform || !(body.platform in ALLOWED_FORMATS_BY_PLATFORM)) {
    return "Invalid platform";
  }
  if (
    !body.contentFormat ||
    !ALLOWED_FORMATS_BY_PLATFORM[body.platform].includes(body.contentFormat)
  ) {
    return "Invalid contentFormat for this platform";
  }

  const n = body.numberOfPosts;
  if (typeof n !== "number" || !Number.isInteger(n) || n < 1 || n > 20) {
    return "numberOfPosts must be an integer between 1 and 20";
  }

  return null;
}

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: GenerateRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validationError = validateBody(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  // Le prompt est construit côté serveur, jamais reçu du client — c'est ce
  // texte qui est à la fois envoyé à l'IA et stocké dans generations.prompt
  // pour l'audit.
  const prompt = buildPrompt({
    industry: body.industry!,
    productDescription: body.productDescription!,
    uniqueValueProposition: body.uniqueValueProposition,
    targetAudience: body.targetAudience!,
    audienceDescription: body.audienceDescription,
    targetMarket: body.targetMarket,
    objective: body.objective!,
    callToAction: body.callToAction!,
    platform: body.platform!,
    contentFormat: body.contentFormat!,
    tone: body.tone!,
    language: body.language!,
    additionalInstructions: body.additionalInstructions,
    numberOfPosts: body.numberOfPosts!,
  });

  // 1. RPC atomique : calcule le coût, débite, crée la génération (ou renvoie
  //    l'existante si requestId déjà traité — idempotence).
  const { data, error: rpcError } = await supabase
    .rpc("consume_credits_and_create_generation", {
      p_request_id: body.requestId,
      p_brand_profile_id: body.brandProfileId ?? null,
      p_industry: body.industry,
      p_product_description: body.productDescription,
      p_unique_value_proposition: body.uniqueValueProposition ?? null,
      p_target_audience: body.targetAudience,
      p_audience_description: body.audienceDescription ?? null,
      p_target_market: body.targetMarket ?? null,
      p_objective: body.objective,
      p_call_to_action: body.callToAction,
      p_platform: body.platform,
      p_content_format: body.contentFormat,
      p_tone: body.tone,
      p_language: body.language ?? "French",
      p_additional_instructions: body.additionalInstructions ?? null,
      p_number_of_posts: body.numberOfPosts,
      p_prompt: prompt,
      p_ai_provider: AI_PROVIDER,
      p_ai_model: AI_MODEL,
    })
    .single();

  if (rpcError) {
    const msg = rpcError.message ?? "";
    if (msg.includes("INSUFFICIENT_CREDITS")) {
      return NextResponse.json(
        { error: "Not enough credits" },
        { status: 402 },
      );
    }
    if (msg.includes("NOT_AUTHENTICATED")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (msg.includes("REQUEST_ID_OWNER_MISMATCH")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (msg.includes("NO_BALANCE_ROW")) {
      return NextResponse.json(
        {
          error:
            "No credit balance found for this account. Please contact support.",
        },
        { status: 500 },
      );
    }
    console.error("consume_credits_and_create_generation failed:", rpcError);
    return NextResponse.json(
      { error: "Could not start generation" },
      { status: 500 },
    );
  }

  const { generation_id, status, is_new } = data as {
    generation_id: string;
    status: string;
    credits_used: number;
    is_new: boolean;
  };

  // 2. Requête déjà traitée précédemment (retry réseau, double-clic...)
  if (!is_new) {
    if (status === "completed") {
      const { data: posts, error: fetchError } = await supabase
        .from("generated_posts")
        .select("*")
        .eq("generation_id", generation_id)
        .order("post_number", { ascending: true });

      if (fetchError) {
        console.error("Failed to fetch existing posts:", fetchError);
        return NextResponse.json(
          { error: "Could not load generation" },
          { status: 500 },
        );
      }
      return NextResponse.json({ generationId: generation_id, posts });
    }

    if (status === "failed") {
      // Déjà remboursée : on ne relance pas cette génération, le client doit
      // soumettre un nouveau requestId s'il veut réessayer.
      return NextResponse.json(
        {
          error: "This generation already failed and was refunded",
          generationId: generation_id,
        },
        { status: 409 },
      );
    }
    // status === 'pending' : un appel précédent a débité mais n'a jamais fini
    // (crash serveur, timeout). On retente l'appel IA SANS rappeler le RPC de
    // débit — generation_id existant fait foi, pas de nouveau coût.
  }

  // 3. Appel au provider IA (première tentative si is_new, ou retry sinon)
  // callAIProvider rejette si le nombre de posts renvoyés ne correspond pas
  // exactement à numberOfPosts (voir lib/ai/callAIProvider.ts) — on ne
  // considère jamais une génération partielle comme un succès.
  try {
    const aiResult = await callAIProvider(prompt, body.numberOfPosts!);

    const rows = aiResult.posts.map((p, i) => ({
      generation_id,
      user_id: user.id,
      post_number: i + 1,
      title: p.title,
      content: p.content,
      hook: p.hook,
      caption: p.caption,
      hashtags: p.hashtags,
      cta: p.cta,
      script: p.script,
      slides: p.slides,
      status: "generated" as const,
    }));

    const { data: insertedPosts, error: insertError } = await supabase
      .from("generated_posts")
      .insert(rows)
      .select();

    if (insertError) throw insertError;

    await supabase
      .from("generations")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", generation_id);

    return NextResponse.json({
      generationId: generation_id,
      posts: insertedPosts,
    });
  } catch (err: any) {
    console.error("Generation failed for", generation_id, err);

    const { error: refundError } = await supabase.rpc(
      "refund_generation_credits",
      {
        p_generation_id: generation_id,
        p_reason: err?.message ?? "AI provider error",
      },
    );

    if (refundError) {
      // Ne devrait arriver que si refund_generation_credits est déjà passé
      // en 'failed' entre-temps (idempotence) — pas bloquant pour la réponse.
      console.error("Refund failed for", generation_id, refundError);
    }

    return NextResponse.json(
      {
        error: "Generation failed, credits refunded",
        generationId: generation_id,
      },
      { status: 500 },
    );
  }
}
