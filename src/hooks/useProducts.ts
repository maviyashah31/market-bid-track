import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProductWithDetails, ProductInsert, ProductFilters, ProductPricingTier } from "@/types/database";

// ── List products with filters ──────────────────────────────────
export function useProducts(filters?: ProductFilters) {
  return useQuery<ProductWithDetails[]>({
    queryKey: ["products", filters],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*, categories(name, slug), profiles!seller_id(full_name, email)")
        .eq("status", "active");

      if (filters?.category) {
        // Support both slug and direct id
        query = query.or(`category_id.eq.${filters.category},categories.slug.eq.${filters.category}`);
      }
      if (filters?.categoryName) {
        // Filter by category name (from URL search params)
        query = query.eq("categories.name", filters.categoryName);
      }
      if (filters?.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }
      if (filters?.featured) {
        query = query.eq("is_featured", true);
      }
      if (filters?.minPrice) {
        query = query.gte("min_price", filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte("min_price", filters.maxPrice);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as ProductWithDetails[]) || [];
    },
  });
}

// ── Single product by ID ────────────────────────────────────────
export function useProduct(id: string | undefined) {
  return useQuery<ProductWithDetails | null>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug), profiles!seller_id(full_name, email)")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as unknown as ProductWithDetails;
    },
    enabled: !!id,
  });
}

// ── Product pricing tiers ───────────────────────────────────────
export function useProductPricingTiers(productId: string | undefined) {
  return useQuery<ProductPricingTier[]>({
    queryKey: ["product-pricing-tiers", productId],
    queryFn: async () => {
      if (!productId) return [];
      const { data, error } = await supabase
        .from("product_pricing_tiers")
        .select("*")
        .eq("product_id", productId)
        .order("min_quantity", { ascending: true });

      if (error) throw error;
      return (data as ProductPricingTier[]) || [];
    },
    enabled: !!productId,
  });
}

// ── Seller's own products (any status) ──────────────────────────
export function useSellerProducts(sellerId?: string) {
  return useQuery<ProductWithDetails[]>({
    queryKey: ["seller-products", sellerId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = sellerId || session?.user?.id;
      if (!uid) return [];

      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug), profiles!seller_id(full_name, email)")
        .eq("seller_id", uid)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as unknown as ProductWithDetails[]) || [];
    },
    enabled: true,
  });
}

// ── Create product ──────────────────────────────────────────────
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: ProductInsert) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Auto-generate slug from name
      const slug = product.slug || product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") + "-" + Date.now().toString(36);

      const { data, error } = await supabase
        .from("products")
        .insert({
          ...product,
          status: product.status ?? "pending_review",
          slug,
          seller_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
    },
  });
}

// ── Update product ──────────────────────────────────────────────
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProductInsert> & { id: string }) => {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
  });
}

// ── Delete product ──────────────────────────────────────────────
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
    },
  });
}

// ── Upload product image to Supabase Storage ────────────────────
export async function uploadProductImage(file: File): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${session.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from("product-images")
    .getPublicUrl(path);

  return publicUrl;
}
