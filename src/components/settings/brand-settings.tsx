// components/settings/brand-settings.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingRow } from "./setting-row";
import { SectionCard } from "./section-card"; // Assurez-vous que ce chemin est correct
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/supabaseClient";
import { useAuth } from "@/app/context/AuthContext";

interface BrandSettingsProps {
  onSave: (message: string, type?: "success" | "error") => void;
}

const tones = [
  "Professional",
  "Friendly",
  "Educational",
  "Sales",
  "Funny",
  "Inspirational",
  "Bold",
];
const ctas = [
  "Learn more",
  "Shop now",
  "Book a call",
  "Contact us",
  "Visit website",
];
const languages = [
  "French",
  "English",
  "Spanish",
  "German",
  "Italian",
  "Portuguese",
  "Dutch",
];

interface BrandForm {
  brand_name: string;
  industry: string;
  description: string;
  products_services: string;
  unique_value_proposition: string;
  target_audience: string;
  audience_description: string;
  target_market: string;
  website_url: string;
  default_language: string;
  brand_tone: string;
  default_cta: string;
  additional_instructions: string;
}

const emptyForm: BrandForm = {
  brand_name: "",
  industry: "",
  description: "",
  products_services: "",
  unique_value_proposition: "",
  target_audience: "",
  audience_description: "",
  target_market: "",
  website_url: "",
  default_language: "French",
  brand_tone: "Professional",
  default_cta: "Learn more",
  additional_instructions: "",
};

export function BrandSettings({ onSave }: BrandSettingsProps) {
  const { brandProfile } = useAuth();
  const [form, setForm] = useState<BrandForm>(brandProfile || emptyForm);
  const [initialForm, setInitialForm] = useState<BrandForm>(
    brandProfile || emptyForm,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Load brand profile
  useEffect(() => {
    async function loadBrandProfile() {
      try {
        setLoading(true);
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("brand_profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const mappedData: BrandForm = {
            brand_name: data.brand_name || "",
            industry: data.industry || "",
            description: data.description || "",
            products_services: data.products_services || "",
            unique_value_proposition: data.unique_value_proposition || "",
            target_audience: data.target_audience || "",
            audience_description: data.audience_description || "",
            target_market: data.target_market || "",
            website_url: data.website_url || "",
            default_language: data.default_language || "French",
            brand_tone: data.brand_tone || "Professional",
            default_cta: data.default_cta || "Learn more",
            additional_instructions: data.additional_instructions || "",
          };
          setForm(mappedData);
          setInitialForm(mappedData);
        }
      } catch (err: any) {
        console.error("Error loading brand profile:", err);
        setError(err.message || "Failed to load brand profile");
      } finally {
        setLoading(false);
      }
    }

    loadBrandProfile();
  }, []);

  const handleChange = (field: keyof BrandForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm);

  const handleSave = async () => {
    if (!form.brand_name.trim()) {
      onSave("Brand name is required", "error");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("User not authenticated");

      const payload = {
        user_id: user.id,
        ...form,
        updated_at: new Date().toISOString(),
      };

      // Upsert based on unique constraint on user_id
      const { error } = await supabase
        .from("brand_profiles")
        .upsert(payload, { onConflict: "user_id" });

      if (error) throw error;

      setInitialForm(form);
      onSave("Brand profile saved");
    } catch (err: any) {
      console.error("Error saving brand profile:", err);
      setError(err.message || "Failed to save brand profile");
      onSave("Failed to save brand profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SectionCard
        title="Brand Profile"
        description="Define your brand identity for AI-generated content."
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
        </div>
      </SectionCard>
    );
  }

  if (error && !form.brand_name) {
    return (
      <SectionCard
        title="Brand Profile"
        description="Define your brand identity for AI-generated content."
      >
        <div className="py-8 text-center text-red-600">
          <p>{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Brand Profile"
      description="Define your brand identity for AI-generated content."
      footer={
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {isDirty ? "Unsaved changes" : "All changes saved"}
          </p>
          <Button onClick={handleSave} disabled={saving || !isDirty}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </div>
      }
    >
      <SettingRow label="Brand name" description="Required">
        <Input
          value={form.brand_name}
          onChange={(e) => handleChange("brand_name", e.target.value)}
          className="w-full sm:w-64"
          placeholder="Your brand name"
          required
        />
      </SettingRow>
      <SettingRow label="Business / Industry">
        <Input
          value={form.industry}
          onChange={(e) => handleChange("industry", e.target.value)}
          className="w-full sm:w-64"
          placeholder="e.g. Digital Marketing"
        />
      </SettingRow>
      <SettingRow label="Brand description">
        <Textarea
          value={form.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleChange("description", e.target.value)
          }
          className="w-full sm:w-96"
          rows={3}
          placeholder="Briefly describe what your business does..."
        />
      </SettingRow>
      <SettingRow label="Products / Services">
        <Textarea
          value={form.products_services}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleChange("products_services", e.target.value)
          }
          className="w-full sm:w-96"
          rows={2}
          placeholder="List your main products or services..."
        />
      </SettingRow>
      <SettingRow label="Unique value proposition">
        <Textarea
          value={form.unique_value_proposition}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleChange("unique_value_proposition", e.target.value)
          }
          className="w-full sm:w-96"
          rows={2}
          placeholder="What makes your brand unique?"
        />
      </SettingRow>
      <SettingRow label="Target audience">
        <Input
          value={form.target_audience}
          onChange={(e) => handleChange("target_audience", e.target.value)}
          className="w-full sm:w-64"
          placeholder="e.g. Small business owners"
        />
      </SettingRow>
      <SettingRow label="Audience description">
        <Textarea
          value={form.audience_description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleChange("audience_description", e.target.value)
          }
          className="w-full sm:w-96"
          rows={2}
          placeholder="Describe your ideal customer..."
        />
      </SettingRow>
      <SettingRow label="Target market">
        <Input
          value={form.target_market}
          onChange={(e) => handleChange("target_market", e.target.value)}
          className="w-full sm:w-64"
          placeholder="e.g. France, Europe"
        />
      </SettingRow>
      <SettingRow label="Website URL">
        <Input
          type="url"
          value={form.website_url}
          onChange={(e) => handleChange("website_url", e.target.value)}
          className="w-full sm:w-64"
          placeholder="https://example.com"
        />
      </SettingRow>
      <SettingRow
        label="Default language"
        description="Language for generated content."
      >
        <Select
          value={form.default_language}
          onValueChange={(val) => handleChange("default_language", val ?? "")}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingRow>
      <SettingRow
        label="Brand tone"
        description="Default tone for your content."
      >
        <Select
          value={form.brand_tone}
          onValueChange={(val) => handleChange("brand_tone", val ?? "")}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            {tones.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingRow>
      <SettingRow
        label="Preferred CTA"
        description="Default call-to-action for generated content."
      >
        <Select
          value={form.default_cta}
          onValueChange={(val) => handleChange("default_cta", val ?? "")}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select CTA" />
          </SelectTrigger>
          <SelectContent>
            {ctas.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingRow>
      <SettingRow
        label="Additional instructions"
        description="Any extra guidance for the AI (keywords, words to avoid, etc.)"
      >
        <Textarea
          value={form.additional_instructions}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleChange("additional_instructions", e.target.value)
          }
          className="w-full sm:w-96"
          rows={3}
          placeholder="e.g. Use a friendly tone, avoid technical jargon..."
        />
      </SettingRow>
    </SectionCard>
  );
}
