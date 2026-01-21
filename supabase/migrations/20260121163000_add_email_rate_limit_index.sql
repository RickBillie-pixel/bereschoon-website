-- Migration: Add index for email rate limiting
-- This index optimizes the rate limit check query by allowing efficient lookups
-- by normalized (lowercase) email and ordering by created_at descending.

-- Create composite index for email rate limit checks
-- Using LOWER(email) for case-insensitive matching
CREATE INDEX IF NOT EXISTS idx_driveway_submissions_email_created 
ON public.driveway_submissions (LOWER(email), created_at DESC);

-- Add comment explaining the index purpose
COMMENT ON INDEX idx_driveway_submissions_email_created IS 
'Composite index for email-based rate limiting: 1 submission per email per 24h';
