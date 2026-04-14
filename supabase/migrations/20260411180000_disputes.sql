-- ============================================
-- Increment 6: Disputes + Dispute Messages
-- ============================================

CREATE SEQUENCE IF NOT EXISTS public.dispute_number_seq START 1;

CREATE TABLE IF NOT EXISTS public.disputes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  dispute_number text NOT NULL UNIQUE,
  order_id uuid NOT NULL REFERENCES public.orders(id),
  buyer_id uuid NOT NULL REFERENCES public.profiles(id),
  seller_id uuid NOT NULL REFERENCES public.profiles(id),
  reason text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open','negotiating','escalated','resolved','closed')),
  resolution text,
  evidence_urls text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.generate_dispute_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.dispute_number := 'DSP-' || lpad(nextval('public.dispute_number_seq')::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_dispute_number
  BEFORE INSERT ON public.disputes
  FOR EACH ROW
  WHEN (NEW.dispute_number IS NULL OR NEW.dispute_number = '')
  EXECUTE FUNCTION public.generate_dispute_number();

CREATE TRIGGER set_disputes_updated_at
  BEFORE UPDATE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_disputes_order ON public.disputes(order_id);
CREATE INDEX idx_disputes_buyer ON public.disputes(buyer_id);
CREATE INDEX idx_disputes_seller ON public.disputes(seller_id);

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can read own disputes" ON public.disputes FOR SELECT USING (buyer_id = auth.uid());
CREATE POLICY "Sellers can read own disputes" ON public.disputes FOR SELECT USING (seller_id = auth.uid());
CREATE POLICY "Buyers can create disputes" ON public.disputes FOR INSERT WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "Buyers can update own disputes" ON public.disputes FOR UPDATE USING (buyer_id = auth.uid());
CREATE POLICY "Sellers can update own disputes" ON public.disputes FOR UPDATE USING (seller_id = auth.uid());
CREATE POLICY "Admins can manage disputes" ON public.disputes FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── Dispute Messages ──

CREATE TABLE IF NOT EXISTS public.dispute_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  dispute_id uuid NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.profiles(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_dispute_msgs_dispute ON public.dispute_messages(dispute_id);

ALTER TABLE public.dispute_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dispute participants can read messages"
  ON public.dispute_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.disputes d WHERE d.id = dispute_id AND (d.buyer_id = auth.uid() OR d.seller_id = auth.uid())));
CREATE POLICY "Dispute participants can send messages"
  ON public.dispute_messages FOR INSERT
  WITH CHECK (sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.disputes d WHERE d.id = dispute_id AND (d.buyer_id = auth.uid() OR d.seller_id = auth.uid())));
CREATE POLICY "Admins can manage dispute messages"
  ON public.dispute_messages FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
