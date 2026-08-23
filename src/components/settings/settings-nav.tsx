// components/settings/settings-nav.tsx
"use client";

import { cn } from "@/lib/utils";
import {
  User,
  Settings,
  Building2,
  Sparkles,
  Bell,
  Link2,
  Shield,
  CreditCard,
  Lock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsNavProps {
  sections: { id: string; label: string }[];
  activeSection: string;
  onSectionChange: (id: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  profile: User,
  account: Settings,
  brand: Building2,
  generation: Sparkles,
  notifications: Bell,
  integrations: Link2,
  security: Shield,
  billing: CreditCard,
  privacy: Lock,
  danger: AlertTriangle,
};

export function SettingsNav({
  sections,
  activeSection,
  onSectionChange,
}: SettingsNavProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <nav className="sticky top-24 space-y-1">
        {sections.map((section) => {
          const Icon = iconMap[section.id] || Settings;
          const isActive = activeSection === section.id;
          return (
            <Button
              key={section.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-violet-50 text-violet-700 hover:bg-violet-50 border-l-2 border-violet-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-2 border-transparent",
              )}
              onClick={() => onSectionChange(section.id)}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-violet-600" : "text-gray-400",
                )}
              />
              {section.label}
            </Button>
          );
        })}
      </nav>
    );
  }

  // Mobile: select dropdown
  return (
    <div className="lg:hidden mb-6">
      <Select
        value={activeSection}
        onValueChange={(value) => onSectionChange(value ?? "")}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select section" />
        </SelectTrigger>
        <SelectContent>
          {sections.map((section) => (
            <SelectItem key={section.id} value={section.id}>
              <span className="flex items-center gap-2">{section.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
