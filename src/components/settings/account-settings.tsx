// components/settings/account-settings.tsx
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
import { SettingRow } from "./setting-row";
import { SectionCard } from "./section-card";
import { useAuth } from "@/app/context/AuthContext";
import { createClient } from "@/lib/supabase/supabaseClient";

interface AccountSettingsProps {
  onSave: (message: string, type?: "success" | "error") => void;
}

const EMPTY_FORM = {
  language: "English",
  currency: "USD",
  timezone: "Europe/Paris",
  dateFormat: "DD/MM/YYYY",
};

export function AccountSettings({ onSave }: AccountSettingsProps) {
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
        .select("ui_language, currency, timezone, date_format")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && data) {
        const loaded = {
          language: data.ui_language ?? EMPTY_FORM.language,
          currency: data.currency ?? EMPTY_FORM.currency,
          timezone: data.timezone ?? EMPTY_FORM.timezone,
          dateFormat: data.date_format ?? EMPTY_FORM.dateFormat,
        };
        setForm(loaded);
        setInitialForm(loaded);
      }
      setLoading(false);
    })();
  }, [user]);

  const handleChange = (field: keyof typeof form, value: string | null) => {
    if (value === null) return;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ui_language: form.language,
          currency: form.currency,
          timezone: form.timezone,
          date_format: form.dateFormat,
        })
        .eq("id", user.id);

      if (error) throw error;

      setInitialForm(form);
      onSave("Account preferences saved");
    } catch (err: any) {
      console.error("Error saving account settings:", err);
      onSave(err.message ?? "Could not save your preferences", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SectionCard
        title="Account"
        description="Manage your regional and language preferences."
      >
        <div className="py-12 flex justify-center text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Account"
      description="Manage your regional and language preferences."
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
      <SettingRow
        label="Language"
        description="Language for the user interface."
      >
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
      <SettingRow
        label="Currency"
        description="Currency for billing and reports."
      >
        <Select
          value={form.currency}
          onValueChange={(val) => handleChange("currency", val)}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>
      <SettingRow
        label="Timezone"
        description="Used for scheduling and timestamps."
      >
        <Select
          value={form.timezone}
          onValueChange={(val) => handleChange("timezone", val)}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
            <SelectItem value="America/New_York">America/New_York</SelectItem>
            <SelectItem value="Europe/London">Europe/London</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>
      <SettingRow
        label="Date format"
        description="How dates are displayed in your dashboard."
      >
        <Select
          value={form.dateFormat}
          onValueChange={(val) => handleChange("dateFormat", val)}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>
    </SectionCard>
  );
}
