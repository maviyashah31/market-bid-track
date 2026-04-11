-- Create supplier_onboarding table
CREATE TABLE IF NOT EXISTS public.supplier_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  profile_completed boolean NOT NULL DEFAULT false,
  products_added boolean NOT NULL DEFAULT false,
  payment_terms_accepted boolean NOT NULL DEFAULT false,
  documents_uploaded boolean NOT NULL DEFAULT false,
  business_name text,
  business_type text,
  business_address text,
  business_city text,
  business_province text,
  business_phone text,
  whatsapp_number text,
  business_description text,
  bank_name text,
  account_title text,
  iban text,
  cnic_front_url text,
  cnic_back_url text,
  ntn_url text,
  business_registration_url text,
  onboarding_completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.supplier_onboarding ENABLE ROW LEVEL SECURITY;

-- Suppliers can read/update their own onboarding record
CREATE POLICY "Suppliers can view own onboarding"
  ON public.supplier_onboarding FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Suppliers can update own onboarding"
  ON public.supplier_onboarding FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Suppliers can insert own onboarding"
  ON public.supplier_onboarding FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all onboarding records
CREATE POLICY "Admins can view all onboarding"
  ON public.supplier_onboarding FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Auto-create onboarding record when a seller profile is created
CREATE OR REPLACE FUNCTION public.handle_seller_onboarding()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'seller' THEN
    INSERT INTO public.supplier_onboarding (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_seller_profile_created ON public.profiles;
CREATE TRIGGER on_seller_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_seller_onboarding();

-- Create storage bucket for supplier documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('supplier-documents', 'supplier-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for supplier documents
CREATE POLICY "Suppliers can upload own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'supplier-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Suppliers can view own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'supplier-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
