-- ============================================
-- Increment 5: Reviews + Ratings
-- ============================================

CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id),
  order_id uuid REFERENCES public.orders(id),
  buyer_id uuid NOT NULL REFERENCES public.profiles(id),
  seller_id uuid NOT NULL REFERENCES public.profiles(id),
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(order_id, buyer_id, product_id)
);

CREATE INDEX idx_reviews_product ON public.reviews(product_id);
CREATE INDEX idx_reviews_seller ON public.reviews(seller_id);
CREATE INDEX idx_reviews_buyer ON public.reviews(buyer_id);

CREATE TRIGGER set_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Buyers can create reviews"
  ON public.reviews FOR INSERT WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "Buyers can update own reviews"
  ON public.reviews FOR UPDATE USING (buyer_id = auth.uid());
CREATE POLICY "Admins can manage reviews"
  ON public.reviews FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
