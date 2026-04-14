-- ============================================
-- Increment 7: RFQs + RFQ Responses (Bids)
-- ============================================

CREATE SEQUENCE IF NOT EXISTS public.rfq_number_seq START 1;

CREATE TABLE IF NOT EXISTS public.rfqs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  rfq_number text NOT NULL UNIQUE,
  buyer_id uuid NOT NULL REFERENCES public.profiles(id),
  title text NOT NULL,
  description text NOT NULL,
  category_id uuid REFERENCES public.categories(id),
  quantity int NOT NULL CHECK (quantity > 0),
  unit text DEFAULT 'pieces',
  budget_min numeric(14,2),
  budget_max numeric(14,2),
  deadline timestamptz,
  image_urls text[] DEFAULT '{}',
  status text DEFAULT 'open' CHECK (status IN ('open','closed','awarded','cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.generate_rfq_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.rfq_number := 'RFQ-' || lpad(nextval('public.rfq_number_seq')::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_rfq_number
  BEFORE INSERT ON public.rfqs
  FOR EACH ROW
  WHEN (NEW.rfq_number IS NULL OR NEW.rfq_number = '')
  EXECUTE FUNCTION public.generate_rfq_number();

CREATE TRIGGER set_rfqs_updated_at
  BEFORE UPDATE ON public.rfqs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_rfqs_buyer ON public.rfqs(buyer_id);
CREATE INDEX idx_rfqs_status ON public.rfqs(status);
CREATE INDEX idx_rfqs_category ON public.rfqs(category_id);

ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read open RFQs" ON public.rfqs FOR SELECT USING (status = 'open' OR buyer_id = auth.uid());
CREATE POLICY "Buyers can create RFQs" ON public.rfqs FOR INSERT WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "Buyers can update own RFQs" ON public.rfqs FOR UPDATE USING (buyer_id = auth.uid());
CREATE POLICY "Admins can manage RFQs" ON public.rfqs FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── RFQ Responses (Bids) ──

CREATE TABLE IF NOT EXISTS public.rfq_responses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  rfq_id uuid NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES public.profiles(id),
  price_per_unit numeric(14,2) NOT NULL,
  total_price numeric(14,2) NOT NULL,
  delivery_days int NOT NULL,
  notes text,
  status text DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(rfq_id, seller_id)
);

CREATE INDEX idx_rfq_responses_rfq ON public.rfq_responses(rfq_id);
CREATE INDEX idx_rfq_responses_seller ON public.rfq_responses(seller_id);

ALTER TABLE public.rfq_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RFQ buyers can read all responses"
  ON public.rfq_responses FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.rfqs r WHERE r.id = rfq_id AND r.buyer_id = auth.uid()));
CREATE POLICY "Sellers can read own responses"
  ON public.rfq_responses FOR SELECT USING (seller_id = auth.uid());
CREATE POLICY "Sellers can create responses"
  ON public.rfq_responses FOR INSERT WITH CHECK (seller_id = auth.uid());
CREATE POLICY "Sellers can update own responses"
  ON public.rfq_responses FOR UPDATE USING (seller_id = auth.uid());
CREATE POLICY "Admins can manage responses"
  ON public.rfq_responses FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
