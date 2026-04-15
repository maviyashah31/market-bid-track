
-- Add rejection_reason to products so sellers can see why their product was rejected
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Add is_verified to profiles so admin can grant verified badge to sellers
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- Change default product status from 'active' to 'pending_review'
ALTER TABLE public.products ALTER COLUMN status SET DEFAULT 'pending_review';
