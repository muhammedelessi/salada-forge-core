
-- 1. Drop the insecure guest orders policy
DROP POLICY IF EXISTS "Guests can view their orders with email" ON public.orders;

-- 2. Fix orders SELECT: authenticated users see their own orders only
DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 3. Admins can view all orders
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. Orders INSERT: anyone can create (for guest checkout)
-- Keep existing "Anyone can create orders" as-is

-- 5. Orders UPDATE: admin only
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 6. Create secure guest order lookup function
CREATE OR REPLACE FUNCTION public.get_guest_order(order_num TEXT, email TEXT)
RETURNS SETOF public.orders
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.orders
  WHERE order_number = order_num
    AND guest_email = email
    AND user_id IS NULL;
$$;

-- 7. Tighten products: only admins can write
DROP POLICY IF EXISTS "Anyone can insert products" ON public.products;
DROP POLICY IF EXISTS "Anyone can update products" ON public.products;
DROP POLICY IF EXISTS "Anyone can delete products" ON public.products;

CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 8. Tighten categories: only admins can write
DROP POLICY IF EXISTS "Anyone can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can update categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can delete categories" ON public.categories;

CREATE POLICY "Admins can insert categories" ON public.categories
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories" ON public.categories
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete categories" ON public.categories
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 9. Tighten coupons: only admins can manage
DROP POLICY IF EXISTS "Anyone can manage coupons" ON public.coupons;

CREATE POLICY "Anyone can view coupons" ON public.coupons
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert coupons" ON public.coupons
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update coupons" ON public.coupons
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete coupons" ON public.coupons
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 10. Tighten product_inquiries: public can insert/view, admin can update/delete
DROP POLICY IF EXISTS "Anyone can update inquiries" ON public.product_inquiries;
DROP POLICY IF EXISTS "Anyone can delete inquiries" ON public.product_inquiries;

CREATE POLICY "Admins can update inquiries" ON public.product_inquiries
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete inquiries" ON public.product_inquiries
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 11. Tighten contact_inquiries: public can insert, admin can manage rest
DROP POLICY IF EXISTS "Anyone can manage contact inquiries" ON public.contact_inquiries;

CREATE POLICY "Anyone can view contact inquiries" ON public.contact_inquiries
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact inquiries" ON public.contact_inquiries
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete contact inquiries" ON public.contact_inquiries
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 12. Tighten profiles: users manage own, admins can view all
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can update profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 13. Add admin management policies for user_roles
CREATE POLICY "Admins can insert user roles" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update user roles" ON public.user_roles
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete user roles" ON public.user_roles
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
