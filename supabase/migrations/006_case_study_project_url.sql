-- Add project_url column to case_studies
-- Run in: Supabase Dashboard → SQL Editor

ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS project_url TEXT;
