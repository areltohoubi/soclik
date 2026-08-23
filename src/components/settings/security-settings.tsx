// components/settings/security-settings.tsx
"use client";

import { useState } from "react";
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

interface SecuritySettingsProps {
  onSave: (message: string, type?: "success" | "error") => void;
}

export function SecuritySettings({ onSave }: SecuritySettingsProps) {
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSignOutAll = () => {
    // Simulate
    onSave("All other sessions signed out");
  };

  return (
    <SectionCard
      title="Security"
      description="Manage your account security settings."
    >
      <SettingRow
        label="Change password"
        description="Update your password regularly."
      >
        <Button variant="outline" size="sm">
          Change password
        </Button>
      </SettingRow>
      <SettingRow
        label="Two-factor authentication"
        description="Add an extra layer of security to your account."
      >
        <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
      </SettingRow>
      <SettingRow
        label="Active sessions"
        description="Where you're currently logged in."
      >
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Chrome on Windows</p>
              <p className="text-xs text-gray-500">
                Paris, France · Active now
              </p>
            </div>
            <Button variant="ghost" size="sm">
              Sign out
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Safari on iPhone</p>
              <p className="text-xs text-gray-500">
                Paris, France · Last active 2 hours ago
              </p>
            </div>
            <Button variant="ghost" size="sm">
              Sign out
            </Button>
          </div>
        </div>
      </SettingRow>
      <SettingRow label="Sign out all other devices">
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="outline" size="sm">
              Sign out all
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign out all other devices?</AlertDialogTitle>
              <AlertDialogDescription>
                This will revoke access from all devices except the one you are
                currently using.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSignOutAll}>
                Sign out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SettingRow>
    </SectionCard>
  );
}
