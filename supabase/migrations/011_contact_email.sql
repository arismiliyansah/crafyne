-- ============================================================
-- 011 — Update the public contact email to contact@crafyne.com
-- Run in: Supabase Dashboard → SQL Editor
-- (Or change `agency_email` in /admin/settings — no rebuild needed.)
-- ============================================================

insert into site_settings (key, value) values ('agency_email', 'contact@crafyne.com')
on conflict (key) do update set value = excluded.value;
