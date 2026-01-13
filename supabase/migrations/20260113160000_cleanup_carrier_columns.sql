-- Cleanup: Remove unused carrier columns
-- The carrier_name column is used, but chosen_carrier_code and chosen_carrier_name are not

-- Drop unused columns if they exist
ALTER TABLE public.orders DROP COLUMN IF EXISTS chosen_carrier_code;
ALTER TABLE public.orders DROP COLUMN IF EXISTS chosen_carrier_name;

-- Drop the unused index if it exists
DROP INDEX IF EXISTS idx_orders_carrier;

-- Ensure carrier_name column exists (this is the one we use)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS carrier_name TEXT;

-- Update comment
COMMENT ON COLUMN public.orders.carrier_name IS 'Name of shipping carrier chosen by customer (e.g., PostNL, DHL)';

