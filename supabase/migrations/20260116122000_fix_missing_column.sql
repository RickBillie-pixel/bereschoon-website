-- The API error indicates sorting by 'featured_order' fails, likely because it's missing.
-- Add it safely.

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 99;

-- Re-apply the logic to set top 3 as featured (just in case)
WITH recent_projects AS (
  SELECT id FROM public.projects ORDER BY created_at DESC LIMIT 3
)
UPDATE public.projects 
SET is_featured = TRUE, featured_order = 1 
WHERE id IN (SELECT id FROM recent_projects);
