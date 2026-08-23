// components/settings/profile-settings.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingRow } from "./setting-row";
import { SectionCard } from "./section-card";

interface ProfileSettingsProps {
  onSave: (message: string, type?: "success" | "error") => void;
}

const countries = [
  "France",
  "United States",
  "United Kingdom",
  "Germany",
  "Canada",
  "Australia",
];
const timezones = [
  "Europe/Paris",
  "America/New_York",
  "Europe/London",
  "Asia/Tokyo",
];

export function ProfileSettings({ onSave }: ProfileSettingsProps) {
  const [form, setForm] = useState({
    firstName: "Alex",
    lastName: "Martin",
    displayName: "Alex Martin",
    email: "alex@example.com",
    bio: "Content creator & marketing enthusiast",
    country: "France",
    timezone: "Europe/Paris",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof typeof form, value: string | null) => {
    setForm((prev) => ({ ...prev, [field]: value ?? "" }));
    setSaved(false);
  };

  const handleSave = () => {
    // Simulate API call
    setSaved(true);
    onSave("Profile updated successfully");
  };

  return (
    <SectionCard
      title="Profile"
      description="Update your personal information and public profile."
      footer={
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {saved ? "Saved" : "Unsaved changes"}
          </p>
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      }
    >
      <div className="py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/avatars/alex.png" alt="Avatar" />
          <AvatarFallback>AM</AvatarFallback>
        </Avatar>
        <div>
          <Button variant="outline" size="sm">
            Change photo
          </Button>
          <p className="text-xs text-gray-500 mt-1">
            JPG, PNG or GIF. Max 2MB.
          </p>
        </div>
      </div>

      <SettingRow label="First name">
        <Input
          value={form.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          className="w-full sm:w-64"
        />
      </SettingRow>
      <SettingRow label="Last name">
        <Input
          value={form.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          className="w-full sm:w-64"
        />
      </SettingRow>
      <SettingRow label="Display name">
        <Input
          value={form.displayName}
          onChange={(e) => handleChange("displayName", e.target.value)}
          className="w-full sm:w-64"
        />
      </SettingRow>
      <SettingRow label="Email">
        <Input
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full sm:w-64"
        />
      </SettingRow>
      <SettingRow label="Bio">
        <Textarea
          value={form.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          className="w-full sm:w-96"
          rows={3}
        />
      </SettingRow>
      <SettingRow label="Country">
        <Select
          value={form.country}
          onValueChange={(val) => handleChange("country", val)}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingRow>
      <SettingRow label="Timezone">
        <Select
          value={form.timezone}
          onValueChange={(val) => handleChange("timezone", val)}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            {timezones.map((tz) => (
              <SelectItem key={tz} value={tz}>
                {tz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingRow>
    </SectionCard>
  );
}
