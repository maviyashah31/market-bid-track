import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface RFQ {
  id: string;
  rfq_number: string;
  buyer_id: string;
  title: string;
  description: string;
  category_id: string | null;
  quantity: number;
  unit: string;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string | null;
  image_urls: string[];
  status: string;
  created_at: string;
  updated_at: string;
  buyer?: { full_name: string | null } | null;
  category?: { name: string } | null;
  rfq_responses?: RFQResponse[];
}

export interface RFQResponse {
  id: string;
  rfq_id: string;
  seller_id: string;
  price_per_unit: number;
  total_price: number;
  delivery_days: number;
  notes: string | null;
  status: string;
  created_at: string;
  seller?: { full_name: string | null } | null;
}

export function useRFQs(filters?: { status?: string; category_id?: string }) {
  return useQuery<RFQ[]>({
    queryKey: ["rfqs", filters],
    queryFn: async () => {
      let query = supabase
        .from("rfqs")
        .select("*, buyer:profiles!buyer_id(full_name), category:categories!category_id(name)")
        .order("created_at", { ascending: false });

      if (filters?.status) query = query.eq("status", filters.status);
      if (filters?.category_id) query = query.eq("category_id", filters.category_id);

      const { data, error } = await query;
      if (error) throw error;
      return (data as unknown as RFQ[]) || [];
    },
  });
}

export function useRFQ(id: string | undefined) {
  return useQuery<RFQ | null>({
    queryKey: ["rfq", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("rfqs")
        .select("*, buyer:profiles!buyer_id(full_name), category:categories!category_id(name), rfq_responses(*, seller:profiles!seller_id(full_name))")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as unknown as RFQ;
    },
    enabled: !!id,
  });
}

export function useBuyerRFQs() {
  return useQuery<RFQ[]>({
    queryKey: ["rfqs", "buyer"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      const { data, error } = await supabase
        .from("rfqs")
        .select("*, category:categories!category_id(name), rfq_responses(id)")
        .eq("buyer_id", session.user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as RFQ[]) || [];
    },
  });
}

export function useCreateRFQ() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { title: string; description: string; category_id?: string; quantity: number; unit?: string; budget_min?: number; budget_max?: number; deadline?: string; image_urls?: string[] }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const { data, error } = await supabase.from("rfqs").insert({
        rfq_number: "",
        buyer_id: session.user.id,
        ...input,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfqs"] });
    },
  });
}

export function useSubmitBid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { rfq_id: string; price_per_unit: number; total_price: number; delivery_days: number; notes?: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const { error } = await supabase.from("rfq_responses").insert({
        ...input,
        seller_id: session.user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfqs"] });
      queryClient.invalidateQueries({ queryKey: ["rfq"] });
    },
  });
}

export function useAcceptBid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ responseId, rfqId }: { responseId: string; rfqId: string }) => {
      // Accept this bid
      const { error: acceptErr } = await supabase
        .from("rfq_responses")
        .update({ status: "accepted" })
        .eq("id", responseId);
      if (acceptErr) throw acceptErr;

      // Reject other bids
      const { error: rejectErr } = await supabase
        .from("rfq_responses")
        .update({ status: "rejected" })
        .eq("rfq_id", rfqId)
        .neq("id", responseId);
      if (rejectErr) throw rejectErr;

      // Close the RFQ
      const { error: closeErr } = await supabase
        .from("rfqs")
        .update({ status: "awarded" })
        .eq("id", rfqId);
      if (closeErr) throw closeErr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfqs"] });
      queryClient.invalidateQueries({ queryKey: ["rfq"] });
    },
  });
}
