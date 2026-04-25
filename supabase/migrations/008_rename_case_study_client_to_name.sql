-- ============================================================
-- Crafyne CMS — Rename case_studies.client → case_studies.name
-- Jalankan di: Supabase Dashboard → SQL Editor
-- ============================================================

ALTER TABLE case_studies RENAME COLUMN client TO name;
