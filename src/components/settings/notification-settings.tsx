// components/settings/notification-settings.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SettingRow } from "./setting-row";
import { SectionCard } from "./section-card";

interface NotificationSettingsProps {
  onSave: (message: string, type?: "success" | "error") => void;
}

export function NotificationSettings({ onSave }: NotificationSettingsProps) {
  const [form, setForm] = useState({
    productUpdates: true,
    generationCompleted: true,
    weeklySummary: false,
    billing: true,
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field: string, value: boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    onSave("Notification preferences saved");
  };

  return (
    <SectionCard
      title="Notifications"
      description="Choose what notifications you want to receive."
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
        label="Product updates"
        description="Get notified about new features and improvements."
      >
        <Switch
          checked={form.productUpdates}
          onCheckedChange={(val) => handleChange("productUpdates", val)}
        />
      </SettingRow>
      <SettingRow
        label="Generation completed"
        description="Notify me when my content is ready."
      >
        <Switch
          checked={form.generationCompleted}
          onCheckedChange={(val) => handleChange("generationCompleted", val)}
        />
      </SettingRow>
      <SettingRow
        label="Weekly summary"
        description="Receive a weekly summary of your activity."
      >
        <Switch
          checked={form.weeklySummary}
          onCheckedChange={(val) => handleChange("weeklySummary", val)}
        />
      </SettingRow>
      <SettingRow
        label="Billing notifications"
        description="Receive important billing and subscription notifications."
      >
        <Switch
          checked={form.billing}
          onCheckedChange={(val) => handleChange("billing", val)}
        />
      </SettingRow>
    </SectionCard>
  );
}
