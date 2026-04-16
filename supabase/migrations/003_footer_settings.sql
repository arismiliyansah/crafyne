-- ============================================================
-- Crafyne — Footer Settings
-- Jalankan di: Supabase Dashboard → SQL Editor
-- ============================================================

INSERT INTO site_settings (key, value) VALUES
  ('footer_instagram_url', '#'),
  ('footer_facebook_url',  '#'),
  ('footer_threads_url',   '#'),
  ('footer_github_url',    '#'),
  ('footer_copyright',     'Crafyne Studio. All rights reserved.')
ON CONFLICT (key) DO NOTHING;
