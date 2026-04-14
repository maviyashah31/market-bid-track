-- ============================================
-- Increment 4: Seller Wallets + Payment Transactions
-- ============================================

CREATE TABLE IF NOT EXISTS public.seller_wallets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id),
  balance numeric(14,2) DEFAULT 0,
  total_earned numeric(14,2) DEFAULT 0,
  total_withdrawn numeric(14,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER set_seller_wallets_updated_at
  BEFORE UPDATE ON public.seller_wallets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.seller_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can read own wallet"
  ON public.seller_wallets FOR SELECT USING (seller_id = auth.uid());
CREATE POLICY "Admins can manage wallets"
  ON public.seller_wallets FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id),
  buyer_id uuid REFERENCES public.profiles(id),
  seller_id uuid REFERENCES public.profiles(id),
  type text NOT NULL CHECK (type IN ('payment','payout','commission','refund')),
  amount numeric(14,2) NOT NULL,
  method text CHECK (method IN ('escrow','bank_transfer','cod','jazzcash','easypaisa')),
  status text DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','reversed')),
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_payment_tx_order ON public.payment_transactions(order_id);
CREATE INDEX idx_payment_tx_seller ON public.payment_transactions(seller_id);

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can read own payments"
  ON public.payment_transactions FOR SELECT USING (buyer_id = auth.uid());
CREATE POLICY "Sellers can read own payments"
  ON public.payment_transactions FOR SELECT USING (seller_id = auth.uid());
CREATE POLICY "Admins can manage payments"
  ON public.payment_transactions FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
