ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS ideal_for jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS key_features jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS customization_options jsonb DEFAULT '[]'::jsonb;