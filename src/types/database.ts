// Shared TypeScript types derived from the Supabase schema.
// These are the types used by hooks and components.

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  min_price: number;
  max_price: number | null;
  moq: number;
  unit: string;
  images: string[];
  status: "draft" | "pending_review" | "active" | "rejected" | "delisted";
  is_featured: boolean;
  stock_quantity: number;
  sku: string | null;
  specifications: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/** Product with joined category and seller info */
export interface ProductWithDetails extends Product {
  categories: Pick<Category, "name" | "slug"> | null;
  profiles: { full_name: string | null; email: string | null; is_verified?: boolean } | null;
}

export interface ProductPricingTier {
  id: string;
  product_id: string;
  min_quantity: number;
  max_quantity: number | null;
  price_per_unit: number;
}

export interface ProductInsert {
  name: string;
  slug?: string;
  description?: string | null;
  category_id?: string | null;
  min_price: number;
  max_price?: number | null;
  moq?: number;
  unit?: string;
  images?: string[];
  status?: Product["status"];
  is_featured?: boolean;
  stock_quantity?: number;
  sku?: string | null;
  specifications?: Record<string, unknown>;
}

export interface ProductFilters {
  search?: string;
  category?: string;      // category slug or id
  categoryName?: string;   // category name (for URL param matching)
  featured?: boolean;
  sellerId?: string;
  status?: Product["status"];
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}

// Re-export the legacy Product type shape for backward compat with ProductCard
export interface ProductCardData {
  id: string;
  name: string;
  image: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  moq: number;
  unit: string;
  sellerName: string;
  sellerVerified: boolean;
  sellerRating: number;
  sellerLocation: string;
  responseTime: string;
  ordersCompleted: number;
}

/** Convert a ProductWithDetails to the shape ProductCard expects */
export function toProductCardData(p: ProductWithDetails): ProductCardData {
  return {
    id: p.id,
    name: p.name,
    image: p.images?.[0] || "/placeholder.svg",
    category: p.categories?.name || "Uncategorized",
    minPrice: p.min_price,
    maxPrice: p.max_price || p.min_price,
    moq: p.moq,
    unit: p.unit,
    sellerName: p.profiles?.full_name || "Unknown Seller",
    sellerVerified: p.profiles?.is_verified ?? false,
    sellerRating: 0,      // TODO: compute from reviews table
    sellerLocation: "",    // TODO: add location to profiles
    responseTime: "< 24 hours",
    ordersCompleted: 0,    // TODO: compute from orders table
  };
}
