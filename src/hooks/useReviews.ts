import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  product_id: string;
  order_id: string | null;
  buyer_id: string;
  seller_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  buyer?: { full_name: string | null } | null;
  product?: { name: string } | null;
}

export function useProductReviews(productId: string | undefined) {
  return useQuery<Review[]>({
    queryKey: ["reviews", "product", productId],
    queryFn: async () => {
      if (!productId) return [];
      const { data, error } = await supabase
        .from("reviews")
        .select("*, buyer:profiles!buyer_id(full_name)")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as Review[]) || [];
    },
    enabled: !!productId,
  });
}

export function useSellerReviews() {
  return useQuery<Review[]>({
    queryKey: ["reviews", "seller"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      const { data, error } = await supabase
        .from("reviews")
        .select("*, buyer:profiles!buyer_id(full_name), product:products!product_id(name)")
        .eq("seller_id", session.user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as Review[]) || [];
    },
  });
}

export function useBuyerReviews() {
  return useQuery<Review[]>({
    queryKey: ["reviews", "buyer"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      const { data, error } = await supabase
        .from("reviews")
        .select("*, product:products!product_id(name)")
        .eq("buyer_id", session.user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as Review[]) || [];
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { product_id: string; order_id?: string; seller_id: string; rating: number; comment?: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const { error } = await supabase.from("reviews").insert({
        ...input,
        buyer_id: session.user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
