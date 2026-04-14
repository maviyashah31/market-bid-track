-- ============================================
-- Increment 9: Wishlists + Notifications
-- ============================================

CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  product_id uuid NOT NULL REFERENCES public.products(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlists_user ON public.wishlists(user_id);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own wishlist" ON public.wishlists FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can add to wishlist" ON public.wishlists FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can remove from wishlist" ON public.wishlists FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage wishlists" ON public.wishlists FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── Notifications ──

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  type text NOT NULL CHECK (type IN ('order','message','rfq','dispute','review','system')),
  title text NOT NULL,
  body text,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id) WHERE is_read = false;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage notifications" ON public.notifications FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Enable Realtime on notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
