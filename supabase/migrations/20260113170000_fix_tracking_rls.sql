-- Fix RLS policies for tracking page to allow public access via tracking_code

-- Allow public read access to orders via tracking_code (for tracking page)
DROP POLICY IF EXISTS "Public can view orders by tracking code" ON public.orders;
CREATE POLICY "Public can view orders by tracking code" ON public.orders
    FOR SELECT USING (tracking_code IS NOT NULL);

-- Allow public read access to order_items for orders they can access
DROP POLICY IF EXISTS "Public can view order items for trackable orders" ON public.order_items;
CREATE POLICY "Public can view order items for trackable orders" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o 
            WHERE o.id = order_id AND o.tracking_code IS NOT NULL
        )
    );

-- Allow public read access to order_tracking_history
DROP POLICY IF EXISTS "Public can view tracking history" ON public.order_tracking_history;
CREATE POLICY "Public can view tracking history" ON public.order_tracking_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o 
            WHERE o.id = order_id AND o.tracking_code IS NOT NULL
        )
    );

