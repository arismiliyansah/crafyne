-- ============================================================
-- 013 — Pricing: per-project model + optional Care & hosting
-- Run in: Supabase Dashboard → SQL Editor
-- Names & prices are unchanged. Only the unit/model changes,
-- plus a new optional monthly "Care & hosting" add-on strip.
-- ============================================================

-- 1) All tiers become per-project (one-time). Same names, same prices.
--    (Also drops the old "USD / mo" wording so it no longer reads as monthly.)
update pricing_tiers set unit = '/project'
where name in ('Sprint', 'Build', 'Tend');

-- 2) "Tend" is no longer a monthly retainer — realign its copy to per-project.
--    (Price unchanged.)
update pricing_tiers
set tag = 'Large / multi-phase build',
    blurb = 'For bigger or multi-phase products. A senior pair plus support, scoped in stages so you see value before committing to the next one.',
    cta_label = 'Talk it through',
    features = array[
      'Senior pair + part-time PM',
      'Phased scope, fixed price per phase',
      'Weekly demo + shared board',
      'Design system + production code',
      'Post-launch stabilization'
    ]
where name = 'Tend';

-- 3) Optional "Care & hosting" add-on (renders as a strip under the tiers).
--    Placeholders — set the real numbers later in
--    /admin/settings → "Pricing — Care & hosting".
insert into site_settings (key, value) values
  ('pricing_care_title',    'Care & hosting'),
  ('pricing_care_blurb',    'Optional. Keep your product secure, monitored, and online after launch — no big retainer.'),
  ('pricing_care_price',    'from 200'),
  ('pricing_care_unit',     '/mo'),
  ('pricing_care_features', 'Security & dependency updates,Uptime monitoring & backups,Hosting / server management,Small changes each month')
on conflict (key) do nothing;
