-- =====================================================
-- ORDER TRACKING SYSTEM
-- =====================================================

-- 1. Add tracking link column to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_link TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_code TEXT UNIQUE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS carrier_tracking_url TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS carrier_name TEXT;

-- Create index for tracking code lookups
CREATE INDEX IF NOT EXISTS idx_orders_tracking_code ON public.orders(tracking_code);

-- 2. Create order_tracking_history table for status updates
CREATE TABLE IF NOT EXISTS public.order_tracking_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    location TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_automated BOOLEAN DEFAULT false,
    carrier_status TEXT
);

-- Enable RLS
ALTER TABLE public.order_tracking_history ENABLE ROW LEVEL SECURITY;

-- Users can view tracking history for their own orders
CREATE POLICY "Users can view own order tracking history" ON public.order_tracking_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o 
            WHERE o.id = order_id AND o.user_id = auth.uid()
        )
    );

-- Anyone can view tracking history with valid tracking code
CREATE POLICY "Anyone can view tracking history by code" ON public.order_tracking_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o 
            WHERE o.id = order_id AND o.tracking_code IS NOT NULL
        )
    );

-- Service role can manage all tracking history
CREATE POLICY "Service role can manage tracking history" ON public.order_tracking_history
    FOR ALL USING (auth.role() = 'service_role');

-- Admins can manage all tracking history
CREATE POLICY "Admins can manage tracking history" ON public.order_tracking_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au 
            WHERE au.user_id = auth.uid()
        )
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tracking_history_order_id ON public.order_tracking_history(order_id);
CREATE INDEX IF NOT EXISTS idx_tracking_history_created_at ON public.order_tracking_history(created_at DESC);

-- 3. Function to generate unique tracking code
CREATE OR REPLACE FUNCTION generate_tracking_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- No confusing chars like I,O,0,1
    result TEXT := 'BS-';
    i INTEGER;
    code_exists BOOLEAN := true;
    random_code TEXT;
BEGIN
    WHILE code_exists LOOP
        random_code := '';
        FOR i IN 1..12 LOOP
            random_code := random_code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
        END LOOP;
        
        -- Format: BS-XXXX-XXXX-XXXX
        result := 'BS-' || substr(random_code, 1, 4) || '-' || substr(random_code, 5, 4) || '-' || substr(random_code, 9, 4);
        
        -- Check if code exists
        SELECT EXISTS(SELECT 1 FROM public.orders WHERE tracking_code = result) INTO code_exists;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 4. Function to auto-generate tracking code on order creation
CREATE OR REPLACE FUNCTION set_tracking_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tracking_code IS NULL THEN
        NEW.tracking_code := generate_tracking_code();
        
        -- Generate tracking link
        -- This will be the public URL where customers can track their order
        NEW.tracking_link := 'https://bereschoon.nl/track/' || NEW.tracking_code;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate tracking code
DROP TRIGGER IF EXISTS auto_set_tracking_code ON public.orders;
CREATE TRIGGER auto_set_tracking_code
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION set_tracking_code();

-- 5. Function to add tracking history entry
CREATE OR REPLACE FUNCTION add_tracking_history(
    p_order_id UUID,
    p_status TEXT,
    p_location TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_is_automated BOOLEAN DEFAULT false,
    p_carrier_status TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    history_id UUID;
BEGIN
    INSERT INTO public.order_tracking_history (
        order_id,
        status,
        location,
        description,
        is_automated,
        carrier_status,
        updated_by
    ) VALUES (
        p_order_id,
        p_status,
        p_location,
        p_description,
        p_is_automated,
        p_carrier_status,
        auth.uid()
    ) RETURNING id INTO history_id;
    
    RETURN history_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Update RLS policies to allow tracking code lookups
-- Drop existing policy and recreate to include tracking code access
DROP POLICY IF EXISTS "Anyone can view orders by payment_id" ON public.orders;

CREATE POLICY "Anyone can view orders by payment_id or tracking_code" ON public.orders
    FOR SELECT USING (
        payment_id IS NOT NULL 
        OR tracking_code IS NOT NULL
    );

-- 7. Add initial tracking history entries for existing orders
DO $$
DECLARE
    order_record RECORD;
BEGIN
    FOR order_record IN SELECT id, status, created_at FROM public.orders WHERE tracking_code IS NULL LOOP
        -- Set tracking code for existing orders
        UPDATE public.orders 
        SET tracking_code = generate_tracking_code(),
            tracking_link = 'https://bereschoon.nl/track/' || generate_tracking_code()
        WHERE id = order_record.id;
        
        -- Add initial tracking entry
        INSERT INTO public.order_tracking_history (order_id, status, description, is_automated)
        VALUES (
            order_record.id,
            order_record.status,
            CASE 
                WHEN order_record.status = 'pending' THEN 'Bestelling geplaatst en wacht op betaling'
                WHEN order_record.status = 'paid' THEN 'Betaling ontvangen'
                WHEN order_record.status = 'processing' THEN 'Bestelling wordt verwerkt'
                WHEN order_record.status = 'shipped' THEN 'Bestelling verzonden'
                WHEN order_record.status = 'delivered' THEN 'Bestelling afgeleverd'
                WHEN order_record.status = 'cancelled' THEN 'Bestelling geannuleerd'
                ELSE 'Bestelling geplaatst'
            END,
            true
        );
    END LOOP;
END $$;

-- Comments
COMMENT ON COLUMN public.orders.tracking_link IS 'Public tracking URL for customers (with or without account)';
COMMENT ON COLUMN public.orders.tracking_code IS 'Unique code for tracking order (e.g., BS-XXXX-XXXX-XXXX)';
COMMENT ON COLUMN public.orders.carrier_tracking_url IS 'Tracking URL from shipping carrier (PostNL, DHL, etc.)';
COMMENT ON COLUMN public.orders.carrier_name IS 'Name of shipping carrier';
COMMENT ON TABLE public.order_tracking_history IS 'History of order status updates and tracking events';

