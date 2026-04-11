import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface OnboardingData {
  id: string;
  user_id: string;
  profile_completed: boolean;
  products_added: boolean;
  payment_terms_accepted: boolean;
  documents_uploaded: boolean;
  business_name: string | null;
  business_type: string | null;
  business_address: string | null;
  business_city: string | null;
  business_province: string | null;
  business_phone: string | null;
  whatsapp_number: string | null;
  business_description: string | null;
  bank_name: string | null;
  account_title: string | null;
  iban: string | null;
  cnic_front_url: string | null;
  cnic_back_url: string | null;
  ntn_url: string | null;
  business_registration_url: string | null;
  onboarding_completed_at: string | null;
}

export function useSupplierOnboarding() {
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOnboarding = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data: onboarding, error: fetchError } = await supabase
        .from("supplier_onboarding")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        setError(fetchError.message);
      } else {
        setData(onboarding as OnboardingData | null);
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error("Onboarding fetch error:", err);
      setError("Failed to load onboarding data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOnboarding();
  }, []);

  const completedSteps = data
    ? [data.profile_completed, data.products_added, data.payment_terms_accepted, data.documents_uploaded].filter(Boolean).length
    : 0;

  const isComplete = completedSteps === 4;

  const updateOnboarding = async (updates: Partial<OnboardingData>) => {
    if (!data) return;

    const allComplete =
      (updates.profile_completed ?? data.profile_completed) &&
      (updates.products_added ?? data.products_added) &&
      (updates.payment_terms_accepted ?? data.payment_terms_accepted) &&
      (updates.documents_uploaded ?? data.documents_uploaded);

    const { error: updateError } = await supabase
      .from("supplier_onboarding")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        ...(allComplete ? { onboarding_completed_at: new Date().toISOString() } : {}),
      })
      .eq("id", data.id);

    if (updateError) {
      if (import.meta.env.DEV) console.error("Onboarding update error:", updateError);
      throw updateError;
    }

    await fetchOnboarding();
  };

  return {
    data,
    loading,
    error,
    completedSteps,
    totalSteps: 4,
    isComplete,
    updateOnboarding,
    refetch: fetchOnboarding,
  };
}
