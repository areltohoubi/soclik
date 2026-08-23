// components/settings/danger-zone.tsx
"use client";

import { Button } from "@/components/ui/button";
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

interface DangerZoneProps {
  onSave: (message: string, type?: "success" | "error") => void;
}

export function DangerZone({ onSave }: DangerZoneProps) {
  const handleReset = () => {
    onSave("Generation preferences reset");
  };

  const handleClearHistory = () => {
    onSave("Generation history cleared");
  };

  const handleDeleteAccount = () => {
    onSave("Account deletion requested", "error");
  };

  return (
    <SectionCard
      title="Danger Zone"
      description="Irreversible and destructive actions."
    >
      <SettingRow
        label="Reset generation preferences"
        description="Restore all generation settings to default."
      >
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="outline" size="sm">
              Reset
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset generation preferences?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all your generation defaults to the original
                values. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SettingRow>
      <SettingRow
        label="Clear generation history"
        description="Delete all previously generated content from your history."
      >
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="outline" size="sm">
              Clear history
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all generation history?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all generated content history. You
                will not be able to recover it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearHistory}>
                Clear
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SettingRow>
      <SettingRow
        label="Delete account"
        description="Permanently delete your account and all associated data."
      >
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="destructive" size="sm">
              Delete account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and all your data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SettingRow>
    </SectionCard>
  );
}
