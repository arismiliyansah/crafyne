-- ============================================================
-- 015 — Inquiry "ordering" fields for the ProjectFlow wizard
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

alter table project_inquiries
  add column if not exists package text,
  add column if not exists wants_care boolean not null default false,
  add column if not exists design_references text;
