-- ============================================
-- Increment 2: Cart Items + Addresses
-- ============================================

-- ============================================
-- Table: addresses
-- ============================================
CREATE TABLE IF NOT EXISTS public.addresses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label text DEFAULT 'default',
  full_name text NOT NULL,
  company text,
  phone text NOT NULL,
  email text,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  province text,
  postal_code text,
  country text DEFAULT 'Pakistan',
  is_default boolean DEFAULT false,
  type text DEFAULT 'both' CHECK (type IN ('shipping', 'billing', 'both')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_addresses_user ON public.addresses(user_id);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own addresses"
  ON public.addresses FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own addresses"
  ON public.addresses FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own addresses"
  ON public.addresses FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own addresses"
  ON public.addresses FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all addresses"
  ON public.addresses FOR SELECT
  USING (public.is_admin());

-- ============================================
-- Table: cart_items
-- ============================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity int NOT NULL CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_cart_items_user ON public.cart_items(user_id);

CREATE TRIGGER set_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own cart"
  ON public.cart_items FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own cart items"
  ON public.cart_items FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own cart items"
  ON public.cart_items FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own cart items"
  ON public.cart_items FOR DELETE
  USING (user_id = auth.uid());
