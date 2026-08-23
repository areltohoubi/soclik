// lib/ai/types.ts

export interface AIGeneratedPost {
  title: string | null;
  hook: string | null;
  content: string | null;
  caption: string | null;
  hashtags: string | null;
  cta: string | null;
  script: string | null;
  slides: string[] | null;
}

export interface AIProviderResult {
  posts: AIGeneratedPost[];
}

export interface GenerationParams {
  industry: string;
  productDescription: string;
  uniqueValueProposition?: string | null;
  targetAudience: string;
  audienceDescription?: string | null;
  targetMarket?: string | null;
  objective: string;
  callToAction: string;
  platform: string;
  contentFormat: string;
  tone: string;
  language: string;
  additionalInstructions?: string | null;
  numberOfPosts: number;
}
