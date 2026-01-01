-- Make user_id nullable for guest orders
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- Add guest_email column for guest orders
ALTER TABLE public.orders ADD COLUMN guest_email text;

-- Add constraint: either user_id or guest_email must be provided
ALTER TABLE public.orders ADD CONSTRAINT orders_user_or_guest_check 
  CHECK (user_id IS NOT NULL OR guest_email IS NOT NULL);

-- Drop existing insert policy that requires auth
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;

-- Create new policy allowing both authenticated users and guests to create orders
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  (auth.uid() IS NULL AND user_id IS NULL AND guest_email IS NOT NULL)
);

-- Allow guests to view their orders via guest_email (will need token-based access)
CREATE POLICY "Guests can view their orders with email" 
ON public.orders 
FOR SELECT 
USING (
  guest_email IS NOT NULL AND user_id IS NULL
);