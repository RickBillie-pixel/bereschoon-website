-- Update order number format to YYYY-XXXX (e.g., 2026-0001)
-- This migration updates the generate_order_number function

-- Drop and recreate the function with new format
DROP FUNCTION IF EXISTS generate_order_number();

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    current_year TEXT;
    order_count INTEGER;
BEGIN
    current_year := TO_CHAR(NOW(), 'YYYY');
    
    -- Count all orders in current year
    SELECT COUNT(*) + 1 INTO order_count
    FROM public.orders
    WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
    
    -- Format: 2026-0001, 2026-0002, etc.
    NEW.order_number := current_year || '-' || LPAD(order_count::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update existing orders to new format (optional - only if you want to update old orders)
-- This will update existing order numbers to the new format
DO $$
DECLARE
    order_record RECORD;
    year_text TEXT;
    counter INTEGER;
    year_count INTEGER;
BEGIN
    -- For each year, renumber orders
    FOR year_text IN 
        SELECT DISTINCT EXTRACT(YEAR FROM created_at)::TEXT as year
        FROM public.orders
        ORDER BY year
    LOOP
        counter := 1;
        
        -- Update each order in that year
        FOR order_record IN 
            SELECT id 
            FROM public.orders 
            WHERE EXTRACT(YEAR FROM created_at)::TEXT = year_text
            ORDER BY created_at
        LOOP
            UPDATE public.orders 
            SET order_number = year_text || '-' || LPAD(counter::TEXT, 4, '0')
            WHERE id = order_record.id;
            
            counter := counter + 1;
        END LOOP;
    END LOOP;
END $$;

-- Comment
COMMENT ON FUNCTION generate_order_number IS 'Generates order numbers in format YYYY-XXXX (e.g., 2026-0001)';

