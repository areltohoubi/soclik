// components/settings/generation-settings.tsx
"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SettingRow } from "./setting-row";
import { SectionCard } from "./section-card";
import { useAuth } from "@/app/context/AuthContext";
import { createClient } from "@/lib/supabase/supabaseClient";

interface GenerationSettingsProps {
  onSave: (message: string, type?: "success" | "error") => void;
}

const EMPTY_FORM = {
  defaultPlatform: "Instagram",
  defaultTone: "Professional",
  defaultPosts: 5,
  contentLength: "Medium",
  emoji: true,
  hashtags: true,
  cta: true,
  variation: "Balanced",
  language: "English",
};

export function GenerationSettings({ onSave }: GenerationSettingsProps) {
  const { user } = useAuth();
  const supabase = createClient();

  const [form, setForm] = useState(EMPTY_FORM);
  const [initialForm, setInitialForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm);

  useEffect(() => {
    if (!user) return;

    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "default_platform, default_tone, default_number_of_posts, default_content_length, include_emojis, include_hashtags, include_cta, content_variation, generation_language",
        )
        .eq("id", user.id)
        .maybeSingle();

      if (!error && data) {
        const loaded = {
          defaultPlatform: data.default_platform ?? EMPTY_FORM.defaultPlatform,
          defaultTone: data.default_tone ?? EMPTY_FORM.defaultTone,
          defaultPosts: data.default_number_of_posts ?? EMPTY_FORM.defaultPosts,
          contentLength:
            data.default_content_length ?? EMPTY_FORM.contentLength,
          emoji: data.include_emojis ?? EMPTY_FORM.emoji,
          hashtags: data.include_hashtags ?? EMPTY_FORM.hashtags,
          cta: data.include_cta ?? EMPTY_FORM.cta,
          variation: data.content_variation ?? EMPTY_FORM.variation,
          language: data.generation_language ?? EMPTY_FORM.language,
        };
        setForm(loaded);
        setInitialForm(loaded);
      }
      setLoading(false);
    })();
  }, [user]);

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          default_platform: form.defaultPlatform,
          default_tone: form.defaultTone,
          default_number_of_posts: form.defaultPosts,
          default_content_length: form.contentLength,
          include_emojis: form.emoji,
          include_hashtags: form.hashtags,
          include_cta: form.cta,
          content_variation: form.variation,
          generation_language: form.language,
        })
        .eq("id", user.id);

      if (error) throw error;

      setInitialForm(form);
      onSave("Generation preferences saved");
    } catch (err: any) {
      console.error("Error saving generation preferences:", err);
      onSave(err.message ?? "Could not save your preferences", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SectionCard
        title="Generation Preferences"
        description="Set defaults for AI content generation."
      >
        <div className="py-12 flex justify-center text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Generation Preferences"
      description="Set defaults for AI content generation."
      footer={
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {isDirty ? "Unsaved changes" : "Saved"}
          </p>
          <Button onClick={handleSave} disabled={saving || !isDirty}>
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      }
    >
      <SettingRow label="Default platform">
        <Select
          value={form.defaultPlatform}
          onValueChange={(val) => handleChange("defaultPlatform", val)}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Instagram">Instagram</SelectItem>
            <SelectItem value="Facebook">Facebook</SelectItem>
            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
            <SelectItem value="X">X</SelectItem>
            <SelectItem value="TikTok">TikTok</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>
      <SettingRow label="Default tone">
        <Select
          value={form.defaultTone}
          onValueChange={(val) => handleChange("defaultTone", val)}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            {/* Aligné sur TONES dans app/generate/page.tsx — "Funny" retiré
                car ce n'est pas une option proposée là-bas. */}
            <SelectItem value="Professional">Professional</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="Educational">Educational</SelectItem>
            <SelectItem value="Bold">Bold</SelectItem>
            <SelectItem value="Friendly">Friendly</SelectItem>
            <SelectItem value="Inspirational">Inspirational</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>
      <SettingRow label="Default number of posts">
        <Select
          value={String(form.defaultPosts)}
          onValueChange={(val) =>
            handleChange("defaultPosts", parseInt(val ?? "", 1))
          }
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select number" />
          </SelectTrigger>
          <SelectContent>
            {[1, 3, 5, 10, 20].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingRow>
      <SettingRow label="Content length">
        <RadioGroup
          value={form.contentLength}
          onValueChange={(val) => handleChange("contentLength", val)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Short" id="short" />
            <Label htmlFor="short">Short</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Medium" id="medium" />
            <Label htmlFor="medium">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Long" id="long" />
            <Label htmlFor="long">Long</Label>
          </div>
        </RadioGroup>
      </SettingRow>
      <SettingRow label="Use emojis">
        <Switch
          checked={form.emoji}
          onCheckedChange={(val) => handleChange("emoji", val)}
        />
      </SettingRow>
      <SettingRow label="Include hashtags">
        <Switch
          checked={form.hashtags}
          onCheckedChange={(val) => handleChange("hashtags", val)}
        />
      </SettingRow>
      <SettingRow label="Include CTA">
        <Switch
          checked={form.cta}
          onCheckedChange={(val) => handleChange("cta", val)}
        />
      </SettingRow>
      <SettingRow label="Content variation">
        <Select
          value={form.variation}
          onValueChange={(val) => handleChange("variation", val)}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select variation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Conservative">Conservative</SelectItem>
            <SelectItem value="Balanced">Balanced</SelectItem>
            <SelectItem value="Creative">Creative</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>
      <SettingRow label="Language preference">
        <Select
          value={form.language}
          onValueChange={(val) => handleChange("language", val)}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="German">German</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>
    </SectionCard>
  );
}
