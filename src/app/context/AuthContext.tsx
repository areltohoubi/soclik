"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createBrowserClient } from "@supabase/ssr";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface User {
  id: string;
  email: string;
  fullname?: string;
  avatar_url?: string[];
}

export interface BrandProfile {
  id?: string;
  user_id?: string;
  brand_name: string;
  industry: string;
  description: string;
  products_services: string;
  unique_value_proposition: string;
  target_audience: string;
  audience_description: string;
  target_market: string;
  website_url: string;
  default_language: string;
  brand_tone: string;
  default_cta: string;
  additional_instructions: string;
}

interface AuthContextType {
  user: User | null;
  brandProfile: BrandProfile | null;
  isLoading: boolean;
  error: string | null;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

// ============================================================================
// CONTEXT & PROVIDER
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialisation du client Supabase pour le navigateur
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const refreshSession = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Récupération de l'utilisateur authentifié
      const {
        data: { user: authUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!authUser) {
        setUser(null);
        setBrandProfile(null);
        return;
      }

      setUser({
        id: authUser.id,
        email: authUser.email || "",
        fullname: authUser.user_metadata?.full_name || "",
        avatar_url: authUser.user_metadata?.avatar_url || [],
      });

      // 2. Récupération du profil de marque associé
      const { data, error: brandError } = await supabase
        .from("brand_profiles")
        .select("*")
        .eq("user_id", authUser.id)
        .maybeSingle();

      if (brandError) throw brandError;

      if (data) {
        const mappedData: BrandProfile = {
          brand_name: data.brand_name || "",
          industry: data.industry || "",
          description: data.description || "",
          products_services: data.products_services || "",
          unique_value_proposition: data.unique_value_proposition || "",
          target_audience: data.target_audience || "",
          audience_description: data.audience_description || "",
          target_market: data.target_market || "",
          website_url: data.website_url || "",
          default_language: data.default_language || "French",
          brand_tone: data.brand_tone || "Professional",
          default_cta: data.default_cta || "Learn more",
          additional_instructions: data.additional_instructions || "",
        };
        setBrandProfile(mappedData);
      } else {
        setBrandProfile(null);
      }
    } catch (err: any) {
      console.error("Erreur lors du chargement de la session :", err);
      setError(err.message || "Échec du chargement du profil");
      setUser(null);
      setBrandProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBrandProfile(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    refreshSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, brandProfile, isLoading, error, refreshSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider",
    );
  }
  return context;
};
