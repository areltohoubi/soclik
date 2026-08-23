// components/settings/settings-layout.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SettingsNav } from "./settings-nav";
import { ProfileSettings } from "./profile-settings";
import { AccountSettings } from "./account-settings";
import { BrandSettings } from "./brand-settings";
import { GenerationSettings } from "./generation-settings";
import { NotificationSettings } from "./notification-settings";
import { IntegrationSettings } from "./integration-settings";
import { SecuritySettings } from "./security-settings";
import { BillingSettings } from "./billing-settings";
import { PrivacySettings } from "./privacy-settings";
import { DangerZone } from "./danger-zone";
import { Toast } from "./toast";
import { useAuth } from "@/app/context/AuthContext";

const sections = [
  { id: "profile", label: "Profile", component: ProfileSettings },
  { id: "account", label: "Account", component: AccountSettings },
  { id: "brand", label: "Brand", component: BrandSettings },
  { id: "generation", label: "Generation", component: GenerationSettings },
  {
    id: "notifications",
    label: "Notifications",
    component: NotificationSettings,
  },
  { id: "integrations", label: "Integrations", component: IntegrationSettings },
  { id: "security", label: "Security", component: SecuritySettings },
  { id: "billing", label: "Billing", component: BillingSettings },
  { id: "privacy", label: "Privacy", component: PrivacySettings },
  { id: "danger", label: "Danger Zone", component: DangerZone },
];

export function SettingsLayout() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div className="p-8">Vérification de la session...</div>;
  }
  const [activeSection, setActiveSection] = useState("profile");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const ActiveComponent =
    sections.find((s) => s.id === activeSection)?.component || ProfileSettings;

  const handleSectionChange = (id: string) => {
    setActiveSection(id);
  };

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your profile, preferences, brand and account settings.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <SettingsNav
            sections={sections}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveComponent onSave={showToast} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
