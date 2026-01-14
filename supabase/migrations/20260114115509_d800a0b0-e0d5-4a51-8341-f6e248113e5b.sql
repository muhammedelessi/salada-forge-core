-- Create product_inquiries table for storing customer inquiries
CREATE TABLE public.product_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id VARCHAR(255) NOT NULL,
  product_title VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_company VARCHAR(255),
  quantity INTEGER,
  message TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.product_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all inquiries
CREATE POLICY "Admins can view all inquiries"
ON public.product_inquiries
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Create policy for admins to update inquiries
CREATE POLICY "Admins can update inquiries"
ON public.product_inquiries
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Create policy for admins to delete inquiries
CREATE POLICY "Admins can delete inquiries"
ON public.product_inquiries
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Allow anyone to insert inquiries (public form submission)
CREATE POLICY "Anyone can submit inquiries"
ON public.product_inquiries
FOR INSERT
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_product_inquiries_updated_at
BEFORE UPDATE ON public.product_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();