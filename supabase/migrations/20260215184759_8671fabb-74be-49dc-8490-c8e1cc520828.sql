
-- Drop restrictive admin-only policies on products
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- Allow any authenticated user to insert products
CREATE POLICY "Authenticated users can insert products"
ON public.products
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow any authenticated user to update products
CREATE POLICY "Authenticated users can update products"
ON public.products
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Allow any authenticated user to delete products
CREATE POLICY "Authenticated users can delete products"
ON public.products
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Also update storage policies for product-images bucket
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update product images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete product images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

-- Ensure public read for product images
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');
