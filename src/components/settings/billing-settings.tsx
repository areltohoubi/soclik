// components/settings/billing-settings.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SettingRow } from "./setting-row";
import { SectionCard } from "./section-card";
import Link from "next/link";

interface BillingSettingsProps {
  onSave: (message: string, type?: "success" | "error") => void;
}

export function BillingSettings({ onSave }: BillingSettingsProps) {
  const plan = "Pro";
  const price = "$19";
  const nextBilling = "September 18, 2026";
  const generationsUsed = 128;
  const generationLimit = 500;
  const usagePercent = (generationsUsed / generationLimit) * 100;

  return (
    <SectionCard
      title="Subscription"
      description="Manage your plan and billing."
      footer={
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/pricing"
            className="text-sm text-violet-600 hover:text-violet-700 font-medium"
          >
            View pricing plans
          </Link>
          <Button variant="outline" size="sm">
            Manage subscription
          </Button>
        </div>
      }
    >
      <div className="flex items-center justify-between py-4">
        <div>
          <Badge variant="secondary" className="bg-violet-100 text-violet-800">
            Current plan
          </Badge>
          <h3 className="mt-2 text-xl font-semibold">{plan}</h3>
          <p className="text-sm text-gray-500">{price} / month</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Next billing date</p>
          <p className="text-sm font-medium">{nextBilling}</p>
        </div>
      </div>
      <SettingRow
        label="AI generations"
        description={`${generationsUsed} / ${generationLimit} used`}
      >
        <div className="w-full sm:w-64">
          <Progress value={usagePercent} className="h-2" />
          <p className="mt-1 text-xs text-gray-500">
            {usagePercent.toFixed(1)}% used
          </p>
        </div>
      </SettingRow>
      <SettingRow label="Billing cycle">
        <p className="text-sm font-medium">Monthly</p>
      </SettingRow>
    </SectionCard>
  );
}
