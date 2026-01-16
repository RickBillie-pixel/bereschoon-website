-- Add new columns for Portfolio 2.0 structure
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS challenge TEXT NULL DEFAULT 'Vervuiling, groene aanslag en weersinvloeden hebben het oppervlak aangetast.',
ADD COLUMN IF NOT EXISTS solution TEXT NULL DEFAULT 'Specialistische dieptereiniging met gepaste druk en temperatuur, gevolgd door een beschermende coating.',
ADD COLUMN IF NOT EXISTS category TEXT NULL DEFAULT 'Project',
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 99;

-- Update existing categories based on name patterns (Migration logic)
UPDATE public.projects SET category = 'Oprit' WHERE name ILIKE '%oprit%' OR name ILIKE '%terras%' OR name ILIKE '%drive%';
UPDATE public.projects SET category = 'Gevel' WHERE name ILIKE '%gevel%' OR name ILIKE '%muur%';
UPDATE public.projects SET category = 'Tuin' WHERE name ILIKE '%tuin%' OR name ILIKE '%onkruid%';
UPDATE public.projects SET category = 'Bedrijf' WHERE name ILIKE '%bedrijf%' OR name ILIKE '%pand%';

-- Set the 3 most recent projects as featured by default
WITH recent_projects AS (
  SELECT id FROM public.projects ORDER BY created_at DESC LIMIT 3
)
UPDATE public.projects 
SET is_featured = TRUE, featured_order = 1 
WHERE id IN (SELECT id FROM recent_projects);
