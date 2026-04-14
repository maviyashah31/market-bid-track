import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: {
    id: string;
    name: string;
    images: string[];
    min_price: number;
    max_price: number | null;
    moq: number;
    unit: string;
    seller_id: string;
    profiles?: { full_name: string | null } | null;
  } | null;
}

export function useWishlist() {
  return useQuery<WishlistItem[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      const { data, error } = await supabase
        .from("wishlists")
        .select("*, product:products!product_id(id, name, images, min_price, max_price, moq, unit, seller_id, profiles:profiles!seller_id(full_name))")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as WishlistItem[]) || [];
    },
  });
}

export function useIsWishlisted(productId: string) {
  return useQuery<boolean>({
    queryKey: ["wishlist", "check", productId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;
      const { data } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("product_id", productId)
        .single();
      return !!data;
    },
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Check if exists
      const { data: existing } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("product_id", productId)
        .single();

      if (existing) {
        await supabase.from("wishlists").delete().eq("id", existing.id);
        return false; // removed
      } else {
        await supabase.from("wishlists").insert({ user_id: session.user.id, product_id: productId });
        return true; // added
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}
