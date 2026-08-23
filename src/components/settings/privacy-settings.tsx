// components/settings/privacy-settings.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SettingRow } from "./setting-row";
import { SectionCard } from "./section-card";
import { useState } from "react";

interface PrivacySettingsProps {
  onSave: (message: string, type?: "success" | "error") => void;
}

export function PrivacySettings({ onSave }: PrivacySettingsProps) {
  const [analytics, setAnalytics] = useState(true);

  const handleExport = () => {
    onSave("Data export requested");
  };

  return (
    <SectionCard
      title="Privacy & Data"
      description="Control how your data is used and exported."
      footer={
        <Button variant="outline" onClick={handleExport}>
          Export my data
        </Button>
      }
    >
      <SettingRow
        label="Help us improve the product"
        description="Allow anonymous usage data to be collected."
      >
        <Switch checked={analytics} onCheckedChange={setAnalytics} />
      </SettingRow>
      <SettingRow
        label="Data usage"
        description="Your data is used to generate content and improve AI models. We never sell your personal information."
      >
        <p className="text-sm text-gray-500">Read our privacy policy</p>
      </SettingRow>
      <SettingRow label="Download account data">
        <Button variant="outline" size="sm" onClick={handleExport}>
          Download
        </Button>
      </SettingRow>
    </SectionCard>
  );
}
