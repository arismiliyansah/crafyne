-- ============================================================
-- 012 — Remove fictional sample content (seeded by 001/010)
-- Run in: Supabase Dashboard → SQL Editor
-- REVIEW FIRST: this deletes specific seeded rows by slug/name.
-- If you repurposed any of these into a real project/testimonial,
-- remove it from the list before running. Your own entries
-- (different slugs/names) are untouched.
-- ============================================================

-- Sample case studies (fictional projects from the seed)
delete from case_studies
where slug in ('meridian', 'holm-systems', 'verdant', 'croft', 'halcyon', 'moray-bank');

-- Sample testimonials (fictional people / companies from the seed)
delete from testimonials
where author_name in ('Elina Vosch', 'Priya Anand', 'Tomás Reyes', 'Yuki Hoshino');

-- Sample client logos in the "trusted by" strip → clear (logo strip hides when empty).
-- Replace with real client names later in /admin/settings (Proof Strip).
update site_settings set value = '' where key = 'proof_clients';
