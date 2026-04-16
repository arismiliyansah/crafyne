-- ============================================================
-- Crafyne — Project Inquiries
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS project_inquiries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  company       TEXT,
  project_type  TEXT NOT NULL,
  budget_range  TEXT,
  timeline      TEXT,
  message       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'new', -- new | reviewing | contacted | won | lost
  admin_notes   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Reuse existing trigger function from migration 001
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON project_inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE project_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an inquiry (no auth required)
CREATE POLICY "public can submit inquiries"
  ON project_inquiries FOR INSERT TO anon
  WITH CHECK (true);

-- Authenticated admins have full access
CREATE POLICY "admin full access to inquiries"
  ON project_inquiries FOR ALL TO authenticated
  USING (true);
