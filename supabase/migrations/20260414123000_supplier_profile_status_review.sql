-- Add supplier profile review status and admin update policy
ALTER TABLE public.supplier_onboarding
  ADD COLUMN profile_status text NOT NULL DEFAULT 'pending' CHECK (profile_status IN ('draft', 'pending', 'approved', 'rejected')),
  ADD COLUMN profile_reviewed_at timestamptz;

-- Allow admins to update onboarding review status
CREATE POLICY "Admins can update onboarding"
  ON public.supplier_onboarding FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
