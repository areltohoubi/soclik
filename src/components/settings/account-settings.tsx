// components/settings/account-settings.tsx
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
import { SettingRow } from "./setting-row";
import { SectionCard } from "./section-card";

interface AccountSettingsProps {
  onSave: (message: string, type?: "success" | "error") => void;
}

export function AccountSettings({ onSave }: AccountSettingsProps) {
  const [form, setForm] = useState({
    language: "English",
    currency: "USD",
    timezone: "Europe/Paris",
    dateFormat: "DD/MM/YYYY",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field: string, value: string | null) => {
    if (value === null) return;

    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    onSave("Account preferences saved");
  };

  return (
    <SectionCard
      title="Account"
      description="Manage your regional and language preferences."
      footer={
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {saved ? "Saved" : "Unsaved changes"}
          </p>
          <Button onClick={handleSave}>Save changes</Button>
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
