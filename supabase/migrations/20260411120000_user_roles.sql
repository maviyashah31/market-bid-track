-- Create user_roles junction table for dual-role support
CREATE TABLE public.user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('buyer', 'seller', 'admin')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Migrate existing roles from profiles table
INSERT INTO public.user_roles (user_id, role)
SELECT id, role FROM public.profiles WHERE role IS NOT NULL
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own roles
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add roles to their own account
CREATE POLICY "Users can insert own roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update the signup trigger to also insert into user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NEW.raw_user_meta_data->>'role'
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'role'
  );

  RETURN NEW;
END;
$$;
