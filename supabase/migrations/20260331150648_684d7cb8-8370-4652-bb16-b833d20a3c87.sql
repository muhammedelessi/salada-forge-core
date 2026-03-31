
-- Restrict coupons SELECT to admin only
DROP POLICY IF EXISTS "Anyone can view coupons" ON public.coupons;
CREATE POLICY "Admins can view coupons" ON public.coupons
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create a server-side coupon validation function
CREATE OR REPLACE FUNCTION public.validate_coupon(coupon_code text, order_subtotal numeric)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c record;
  discount numeric;
BEGIN
  SELECT * INTO c FROM public.coupons
  WHERE code = upper(coupon_code)
    AND is_active = true
    AND (start_date IS NULL OR start_date <= now())
    AND (end_date IS NULL OR end_date > now())
    AND (max_uses IS NULL OR used_count < max_uses);

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Invalid or expired coupon code');
  END IF;

  IF c.min_order_amount IS NOT NULL AND order_subtotal < c.min_order_amount THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Minimum order amount not met');
  END IF;

  IF c.discount_type = 'percentage' THEN
    discount := (order_subtotal * c.discount_value) / 100;
  ELSE
    discount := c.discount_value;
  END IF;

  RETURN jsonb_build_object(
    'valid', true,
    'code', c.code,
    'discount', discount,
    'discount_type', c.discount_type::text,
    'discount_value', c.discount_value
  );
END;
$$;
