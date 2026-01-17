-- Add shipping_updates column to store order tracking history
ALTER TABLE public.orders 
ADD COLUMN shipping_updates JSONB DEFAULT '[]'::jsonb;