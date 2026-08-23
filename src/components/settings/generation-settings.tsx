// components/settings/generation-settings.tsx
"use client";

import { useState } from "react";
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

interface GenerationSettingsProps {
  onSave: (message: string, type?: "success" | "error") => void;
}

export function GenerationSettings({ onSave }: GenerationSettingsProps) {
  const [form, setForm] = useState({
    defaultPlatform: "Instagram",
    defaultTone: "Professional",
    defaultPosts: 5,
    contentLength: "Medium",
    emoji: true,
    hashtags: true,
    cta: true,
    variation: "Balanced",
    language: "English",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    onSave("Generation preferences saved");
  };

  return (
    <SectionCard
      title="Generation Preferences"
      description="Set defaults for AI content generation."
      footer={
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {saved ? "Saved" : "Unsaved changes"}
          </p>
          <Button onClick={handleSave}>Save changes</Button>
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
            <SelectItem value="Professional">Professional</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="Educational">Educational</SelectItem>
            <SelectItem value="Funny">Funny</SelectItem>
            <SelectItem value="Friendly">Friendly</SelectItem>
            <SelectItem value="Inspirational">Inspirational</SelectItem>
            <SelectItem value="Bold">Bold</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>
      <SettingRow label="Default number of posts">
        <Select
          value={String(form.defaultPosts)}
          onValueChange={(val) =>
            handleChange("defaultPosts", parseInt(val, 10))
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
