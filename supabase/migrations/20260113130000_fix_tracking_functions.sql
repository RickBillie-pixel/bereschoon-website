-- Create tracking code generator function
CREATE OR REPLACE FUNCTION public.generate_tracking_code()
RETURNS TRIGGER AS $$
DECLARE
  year_part TEXT;
  sequence_num INTEGER;
  new_tracking_code TEXT;
BEGIN
  -- Get current year
  year_part := to_char(NOW(), 'YYYY');
  
  -- Get the next sequence number for this year
  SELECT COALESCE(MAX(
    CASE 
      WHEN tracking_code LIKE 'TRACK-' || year_part || '-%' 
      THEN CAST(SUBSTRING(tracking_code FROM 'TRACK-\d{4}-(\d+)') AS INTEGER)
      ELSE 0 
    END
  ), 0) + 1 INTO sequence_num
  FROM orders
  WHERE tracking_code LIKE 'TRACK-' || year_part || '-%';
  
  -- Generate tracking code: TRACK-YYYY-XXXX
  new_tracking_code := 'TRACK-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  -- Set the tracking code
  NEW.tracking_code := new_tracking_code;
  
  -- Generate tracking link
  NEW.tracking_link := 'https://bereschoon.nl/track/' || new_tracking_code;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS auto_set_tracking_code ON orders;

-- Create trigger to auto-generate tracking code
CREATE TRIGGER auto_set_tracking_code
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.tracking_code IS NULL)
  EXECUTE FUNCTION generate_tracking_code();

-- Add tracking columns if they don't exist
DO $$ 
BEGIN
  -- Add tracking_code column if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'tracking_code') THEN
    ALTER TABLE orders ADD COLUMN tracking_code TEXT;
  END IF;
  
  -- Add tracking_link column if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'tracking_link') THEN
    ALTER TABLE orders ADD COLUMN tracking_link TEXT;
  END IF;
  
  -- Add tracking_url column for carrier tracking if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'carrier_tracking_url') THEN
    ALTER TABLE orders ADD COLUMN carrier_tracking_url TEXT;
  END IF;
  
  -- Add carrier_name column if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'carrier_name') THEN
    ALTER TABLE orders ADD COLUMN carrier_name TEXT;
  END IF;
END $$;

-- Create order_tracking_history table if not exists
CREATE TABLE IF NOT EXISTS order_tracking_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  description TEXT,
  location TEXT,
  is_automated BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_order_tracking_history_order_id ON order_tracking_history(order_id);

-- Enable RLS on tracking history
ALTER TABLE order_tracking_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own order tracking history" ON order_tracking_history;
DROP POLICY IF EXISTS "Service role full access to tracking history" ON order_tracking_history;
DROP POLICY IF EXISTS "Public can view tracking history by order" ON order_tracking_history;

-- Policy: Users can view tracking history for their own orders
CREATE POLICY "Users can view own order tracking history"
  ON order_tracking_history
  FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

-- Policy: Service role can do everything
CREATE POLICY "Service role full access to tracking history"
  ON order_tracking_history
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Public can view tracking history by tracking code (for guest checkout)
CREATE POLICY "Public can view tracking history by order"
  ON order_tracking_history
  FOR SELECT
  USING (true);

