// components/settings/profile-settings.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useAuth } from "@/app/context/AuthContext";
import { createClient } from "@/lib/supabase/supabaseClient";

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

const EMPTY_FORM = {
  fullName: "",
  bio: "",
  country: "",
};

export function ProfileSettings({ onSave }: ProfileSettingsProps) {
  const { user } = useAuth();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [initialForm, setInitialForm] = useState(EMPTY_FORM);
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm);

  useEffect(() => {
    if (!user) return;

    (async () => {
      setLoading(true);
      setEmail(user.email ?? "");
      setNewEmail(user.email ?? "");

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, bio, country, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && data) {
        const loaded = {
          fullName: data.full_name ?? "",
          bio: data.bio ?? "",
          country: data.country ?? "",
        };
        setForm(loaded);
        setInitialForm(loaded);
        setAvatarUrl(data.avatar_url);
      }
      setLoading(false);
    })();
  }, [user]);

  const handleChange = (field: keyof typeof form, value: string | null) => {
    setForm((prev) => ({ ...prev, [field]: value ?? "" }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const fullName = form.fullName || null;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          bio: form.bio || null,
          country: form.country || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      setInitialForm(form);
      onSave("Profile updated successfully");
    } catch (err: any) {
      console.error("Error saving profile:", err);
      onSave(err.message ?? "Could not save your profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEmailChange = async () => {
    if (!newEmail || newEmail === email) return;
    setSavingEmail(true);

    try {
      // Déclenche un email de confirmation à la nouvelle adresse — Supabase
      // Auth ne change pas l'email tant qu'elle n'est pas confirmée.
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      onSave("Check your inbox to confirm your new email address");
    } catch (err: any) {
      console.error("Error updating email:", err);
      onSave(err.message ?? "Could not update email", "error");
    } finally {
      setSavingEmail(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    if (file.size > 2 * 1024 * 1024) {
      onSave("Image must be under 2MB", "error");
      return;
    }
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      onSave("Only JPG, PNG or GIF images are supported", "error");
      return;
    }

    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      // Chemin {user_id}/avatar.ext requis par les policies de storage
      // (voir settings-migration.sql).
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);
      // Cache-bust pour que la nouvelle photo s'affiche immédiatement.
      const publicUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);
      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      onSave("Photo updated");
    } catch (err: any) {
      console.error("Error uploading avatar:", err);
      onSave(err.message ?? "Could not upload photo", "error");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const initials =
    `${form.fullName?.[0] ?? ""}`.toUpperCase() ||
    (email ? email[0].toUpperCase() : "?");

  if (loading) {
    return (
      <SectionCard
        title="Profile"
        description="Update your personal information and public profile."
      >
        <div className="py-12 flex justify-center text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Profile"
      description="Update your personal information and public profile."
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
      <div className="py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatarUrl ?? undefined} alt="Avatar" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAvatarUpload(file);
              e.target.value = "";
            }}
          />
          <Button
            variant="outline"
            size="sm"
            disabled={uploadingAvatar}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploadingAvatar ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Change photo"
            )}
          </Button>
          <p className="text-xs text-gray-500 mt-1">
            JPG, PNG or GIF. Max 2MB.
          </p>
        </div>
      </div>

      <SettingRow label="Full name">
        <Input
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
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
      <SettingRow
        label="Email"
        description="Changing your email requires confirmation via a link sent to the new address."
      >
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-64">
          <Input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          {newEmail !== email && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleEmailChange}
              disabled={savingEmail || !newEmail}
            >
              {savingEmail ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "Update"
              )}
            </Button>
          )}
        </div>
      </SettingRow>
    </SectionCard>
  );
}
