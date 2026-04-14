import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Dispute {
  id: string;
  dispute_number: string;
  order_id: string;
  buyer_id: string;
  seller_id: string;
  reason: string;
  description: string;
  status: string;
  resolution: string | null;
  evidence_urls: string[];
  created_at: string;
  updated_at: string;
  order?: { order_number: string } | null;
  buyer?: { full_name: string | null; email: string | null } | null;
  seller?: { full_name: string | null; email: string | null } | null;
}

export interface DisputeMessage {
  id: string;
  dispute_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: { full_name: string | null } | null;
}

export function useBuyerDisputes() {
  return useQuery<Dispute[]>({
    queryKey: ["disputes", "buyer"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      const { data, error } = await supabase
        .from("disputes")
        .select("*, order:orders!order_id(order_number), seller:profiles!seller_id(full_name, email)")
        .eq("buyer_id", session.user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as Dispute[]) || [];
    },
  });
}

export function useSellerDisputes() {
  return useQuery<Dispute[]>({
    queryKey: ["disputes", "seller"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      const { data, error } = await supabase
        .from("disputes")
        .select("*, order:orders!order_id(order_number), buyer:profiles!buyer_id(full_name, email)")
        .eq("seller_id", session.user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as Dispute[]) || [];
    },
  });
}

export function useDispute(id: string | undefined) {
  return useQuery<Dispute | null>({
    queryKey: ["dispute", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("disputes")
        .select("*, order:orders!order_id(order_number), buyer:profiles!buyer_id(full_name, email), seller:profiles!seller_id(full_name, email)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as unknown as Dispute;
    },
    enabled: !!id,
  });
}

export function useCreateDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { order_id: string; seller_id: string; reason: string; description: string; evidence_urls?: string[] }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const { data, error } = await supabase.from("disputes").insert({
        dispute_number: "",
        ...input,
        buyer_id: session.user.id,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
    },
  });
}

export function useUpdateDisputeStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ disputeId, status, resolution }: { disputeId: string; status: string; resolution?: string }) => {
      const { error } = await supabase
        .from("disputes")
        .update({ status, resolution: resolution || null })
        .eq("id", disputeId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
    },
  });
}

export function useDisputeMessages(disputeId: string | undefined) {
  return useQuery<DisputeMessage[]>({
    queryKey: ["dispute-messages", disputeId],
    queryFn: async () => {
      if (!disputeId) return [];
      const { data, error } = await supabase
        .from("dispute_messages")
        .select("*, sender:profiles!sender_id(full_name)")
        .eq("dispute_id", disputeId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as unknown as DisputeMessage[]) || [];
    },
    enabled: !!disputeId,
  });
}

export function useSendDisputeMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ disputeId, content }: { disputeId: string; content: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const { error } = await supabase.from("dispute_messages").insert({
        dispute_id: disputeId,
        sender_id: session.user.id,
        content,
      });
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      queryClient.invalidateQueries({ queryKey: ["dispute-messages", v.disputeId] });
    },
  });
}
