-- Delete test orders that may be causing conflicts
DELETE FROM order_items WHERE order_id IN (
  SELECT id FROM orders WHERE email = 'test@test.com'
);
DELETE FROM order_tracking_history WHERE order_id IN (
  SELECT id FROM orders WHERE email = 'test@test.com'
);
DELETE FROM orders WHERE email = 'test@test.com';

-- Reset sequences to ensure unique values
SELECT setval('order_number_seq', (
  SELECT COALESCE(MAX(
    CASE 
      WHEN order_number ~ '-(\d+)$'
      THEN CAST(SUBSTRING(order_number FROM '-(\d+)$') AS INTEGER)
      ELSE 0 
    END
  ), 0) + 1 FROM orders
), false);

SELECT setval('tracking_code_seq', (
  SELECT COALESCE(MAX(
    CASE 
      WHEN tracking_code ~ '-(\d+)$'
      THEN CAST(SUBSTRING(tracking_code FROM '-(\d+)$') AS INTEGER)
      ELSE 0 
    END
  ), 0) + 1 FROM orders
), false);

