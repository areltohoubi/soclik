// components/settings/integration-settings.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {  Music2 } from "lucide-react";
import { SettingRow } from "./setting-row";
import { SectionCard } from "./section-card";
import { FacebookIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from "../Icons";

interface IntegrationSettingsProps {
  onSave: (message: string, type?: "success" | "error") => void;
}

const platforms = [
  { name: "Instagram", icon: InstagramIcon, connected: false },
  { name: "Facebook", icon: FacebookIcon, connected: false },
  { name: "LinkedIn", icon: LinkedInIcon, connected: true },
  { name: "X", icon: TwitterIcon, connected: false },
  { name: "TikTok", icon: Music2, connected: false },
];

export function IntegrationSettings({ onSave }: IntegrationSettingsProps) {
  return (
    <SectionCard
      title="Social Integrations"
      description="Connect your social media accounts to publish directly."
    >
      {platforms.map((platform) => (
        <SettingRow
          key={platform.name}
          label={platform.name}
          description={platform.connected ? "Connected" : "Not connected"}
        >
          <div className="flex items-center gap-3">
            <Badge variant={platform.connected ? "default" : "secondary"}>
              {platform.connected ? "Connected" : "Not connected"}
            </Badge>
            {platform.connected ? (
              <Button variant="outline" size="sm">
                Manage
              </Button>
            ) : (
              <Button size="sm">Connect</Button>
            )}
          </div>
        </SettingRow>
      ))}
    </SectionCard>
  );
}
