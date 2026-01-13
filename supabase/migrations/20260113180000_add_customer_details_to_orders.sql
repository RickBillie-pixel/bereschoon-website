-- Add customer name and phone to orders table for better tracking
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Add comments
COMMENT ON COLUMN public.orders.customer_name IS 'Full name of the customer at time of order';
COMMENT ON COLUMN public.orders.customer_phone IS 'Phone number of the customer at time of order';

-- Note: order_items already has product_id and quantity columns
-- This migration just adds customer contact info to orders

