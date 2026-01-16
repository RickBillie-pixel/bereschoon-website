-- Enable RLS on the projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists to avoid errors
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON public.projects;

-- Create a policy that allows everyone (anon and authenticated) to select
CREATE POLICY "Public projects are viewable by everyone" 
ON public.projects 
FOR SELECT 
USING (true);
