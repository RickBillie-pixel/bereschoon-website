-- Fix order number generator to avoid duplicates
-- Uses a sequence for reliable unique numbers

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS set_order_number ON orders;
DROP FUNCTION IF EXISTS generate_order_number();

-- Create a sequence for order numbers (will be reset per year manually if needed)
CREATE SEQUENCE IF NOT EXISTS order_number_seq;

-- Reset sequence to be higher than existing orders
DO $$
DECLARE
  max_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(
    CASE 
      WHEN order_number ~ '^BS-\d{8}-\d+$'
      THEN CAST(SUBSTRING(order_number FROM 'BS-\d{8}-(\d+)$') AS INTEGER)
      ELSE 0 
    END
  ), 0) INTO max_num FROM orders;
  
  -- Set sequence to max + 1
  PERFORM setval('order_number_seq', GREATEST(max_num, 1), false);
END $$;

-- Create new order number generator that uses sequence
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'BS-' || to_char(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_number_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

-- Also fix tracking code generator to use sequence
CREATE SEQUENCE IF NOT EXISTS tracking_code_seq;

-- Reset tracking sequence
DO $$
DECLARE
  max_track INTEGER;
BEGIN
  SELECT COALESCE(MAX(
    CASE 
      WHEN tracking_code ~ '^TRACK-\d{4}-\d+$'
      THEN CAST(SUBSTRING(tracking_code FROM 'TRACK-\d{4}-(\d+)$') AS INTEGER)
      ELSE 0 
    END
  ), 0) INTO max_track FROM orders;
  
  PERFORM setval('tracking_code_seq', GREATEST(max_track, 1), false);
END $$;

-- Drop and recreate tracking code generator
DROP TRIGGER IF EXISTS auto_set_tracking_code ON orders;
DROP FUNCTION IF EXISTS generate_tracking_code();

CREATE OR REPLACE FUNCTION generate_tracking_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tracking_code IS NULL THEN
    NEW.tracking_code := 'TRACK-' || to_char(NOW(), 'YYYY') || '-' || LPAD(nextval('tracking_code_seq')::TEXT, 4, '0');
    NEW.tracking_link := 'https://bereschoon.nl/track/' || NEW.tracking_code;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_set_tracking_code
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.tracking_code IS NULL)
  EXECUTE FUNCTION generate_tracking_code();

-- Ensure carrier_name column exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'carrier_name') THEN
    ALTER TABLE orders ADD COLUMN carrier_name TEXT;
  END IF;
END $$;

