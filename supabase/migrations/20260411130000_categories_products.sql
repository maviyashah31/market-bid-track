-- ============================================
-- Increment 1: Categories + Products + Pricing Tiers
-- ============================================

-- Helper: updated_at trigger function (reusable)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper: is_admin check (reusable)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- Table: categories
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  icon text,
  parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Public can read active categories
CREATE POLICY "Anyone can read active categories"
  ON public.categories FOR SELECT
  USING (is_active = true);

-- Admin can manage categories
CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- Table: products
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  min_price numeric(12,2) NOT NULL CHECK (min_price > 0),
  max_price numeric(12,2) CHECK (max_price >= min_price),
  moq int NOT NULL DEFAULT 1 CHECK (moq > 0),
  unit text NOT NULL DEFAULT 'pieces',
  images text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('draft','pending_review','active','rejected','delisted')),
  is_featured boolean DEFAULT false,
  stock_quantity int DEFAULT 0,
  sku text,
  specifications jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_products_seller_id ON public.products(seller_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_is_featured ON public.products(is_featured) WHERE is_featured = true;

-- updated_at trigger
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can read active products
CREATE POLICY "Anyone can read active products"
  ON public.products FOR SELECT
  USING (status = 'active');

-- Sellers can read all own products (any status)
CREATE POLICY "Sellers can read own products"
  ON public.products FOR SELECT
  USING (seller_id = auth.uid());

-- Sellers can insert own products
CREATE POLICY "Sellers can insert own products"
  ON public.products FOR INSERT
  WITH CHECK (seller_id = auth.uid());

-- Sellers can update own products
CREATE POLICY "Sellers can update own products"
  ON public.products FOR UPDATE
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

-- Sellers can delete own products
CREATE POLICY "Sellers can delete own products"
  ON public.products FOR DELETE
  USING (seller_id = auth.uid());

-- Admin can manage all products
CREATE POLICY "Admins can manage all products"
  ON public.products FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- Table: product_pricing_tiers
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_pricing_tiers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  min_quantity int NOT NULL,
  max_quantity int,
  price_per_unit numeric(12,2) NOT NULL CHECK (price_per_unit > 0)
);

CREATE INDEX idx_pricing_tiers_product ON public.product_pricing_tiers(product_id);

ALTER TABLE public.product_pricing_tiers ENABLE ROW LEVEL SECURITY;

-- Same access as products: public read, seller CRUD own
CREATE POLICY "Anyone can read pricing tiers for active products"
  ON public.product_pricing_tiers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id AND (p.status = 'active' OR p.seller_id = auth.uid())
    )
  );

CREATE POLICY "Sellers can manage own pricing tiers"
  ON public.product_pricing_tiers FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.seller_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.seller_id = auth.uid())
  );

CREATE POLICY "Admins can manage all pricing tiers"
  ON public.product_pricing_tiers FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- Storage bucket: product-images
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to product-images
CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Anyone can read product images
CREATE POLICY "Anyone can read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Users can delete own uploads
CREATE POLICY "Users can delete own product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- Seed: categories from existing mock data
-- ============================================
INSERT INTO public.categories (name, slug, icon, sort_order) VALUES
  ('Textiles & Garments', 'textiles-garments', '👕', 1),
  ('Electronics', 'electronics', '📱', 2),
  ('Agriculture', 'agriculture', '🌾', 3),
  ('Machinery', 'machinery', '⚙️', 4),
  ('Chemicals', 'chemicals', '🧪', 5),
  ('Sports Goods', 'sports-goods', '⚽', 6),
  ('Surgical Instruments', 'surgical-instruments', '🏥', 7),
  ('Leather Products', 'leather-products', '👜', 8),
  ('Food & Beverages', 'food-beverages', '🍚', 9),
  ('Construction', 'construction', '🏗️', 10),
  ('Auto Parts', 'auto-parts', '🚗', 11),
  ('Packaging', 'packaging', '📦', 12)
ON CONFLICT (name) DO NOTHING;
