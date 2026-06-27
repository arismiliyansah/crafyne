-- ============================================================
-- 010 — Redesign seed: settings, new-section content, top-up
-- Run in: Supabase Dashboard → SQL Editor (after 009)
-- ============================================================

-- ── Settings: studio facts + new copy ──
insert into site_settings (key, value) values
  ('agency_location', 'Jakarta, Indonesia'),
  ('agency_email',    'hello@crafyne.studio'),
  ('agency_address',  'Setiabudi One, 14th floor'),
  ('hero_chip',       'Independent software studio · Booking Q3 2026'),
  ('hero_lede',       'Crafyne is a small studio of engineers and designers building products that feel right. We partner with founders and ops teams to ship measurable, lovable software — fast.'),
  ('hero_meta_1',     'Based in Jakarta · working globally'),
  ('hero_meta_2',     'Avg. 6–14 week engagements'),
  ('hero_meta_3',     'Senior team, no juniors on your account'),
  ('hero_cta_primary',   'Start a project'),
  ('hero_cta_secondary', 'Watch reel — 1:24'),
  ('stats_eyebrow',   'by the numbers'),
  ('stats_title',     'Eight years of shipped products, measured in trust not tickets.'),
  ('cta_eyebrow',     'next slot opens August 4'),
  ('cta_title',       'Let''s build something people open on purpose.'),
  ('cta_sub',         'Tell us about the project. We reply within one working day with honest first impressions — and whether we''re the right team.'),
  ('pricing_care_title',    'Care & hosting'),
  ('pricing_care_blurb',    'Optional. Keep your product secure, monitored, and online after launch — no big retainer.'),
  ('pricing_care_price',    'from 200'),
  ('pricing_care_unit',     '/mo'),
  ('pricing_care_features', 'Security & dependency updates,Uptime monitoring & backups,Hosting / server management,Small changes each month')
on conflict (key) do update set value = excluded.value;

-- ── Services (5) — only if empty ──
insert into services (title, body, bullets, tone, glyph, span, display_order)
select * from (values
  ('Web Engineering','Marketing sites, dashboards, internal tools — built fast, typed end-to-end, and easy to hand off.', array['Next.js · TypeScript · tRPC','Headless CMS integrations','Performance budgets, real ones'],'peach','▤','trio',1),
  ('Mobile Apps','Native-feel iOS and Android from one team. We sweat the small details: gestures, haptics, offline.', array['React Native + native modules','App Store / Play submission','Crashlytics, Sentry, the works'],'navy','▢','trio',2),
  ('AI & ML','Pragmatic AI features that earn their keep. We pick the smallest model that solves the job and ship it.', array['RAG over your own data','Evals & guardrails','Cost-aware inference pipelines'],'orange','✺','trio',3),
  ('Product Design','From the first sketch to a system that scales. Research, IA, interaction, motion — design that ships.', array['Discovery & UX research','Design system + component library','Hi-fi prototypes for testing'],'crimson','◐','wide',4),
  ('Enterprise Software','We work alongside in-house teams on long horizons — modernization, internal tools, platform work.', array['Auth, audit, RBAC, SSO','Legacy migrations','Documentation engineers love'],'cream','▣','wide',5)
) as v(title, body, bullets, tone, glyph, span, display_order)
where not exists (select 1 from services);

-- ── Stats (4) — only if empty ──
insert into stats (value, suffix, decimals, label, display_order)
select * from (values
  (142::numeric, '', 0, 'Products shipped', 1),
  (38::numeric, '', 0, 'Active retainer clients', 2),
  (4.9::numeric, '/5', 1, 'Avg. client rating', 3),
  (96::numeric, '%', 0, 'Retention after first year', 4)
) as v(value, suffix, decimals, label, display_order)
where not exists (select 1 from stats);

-- ── Pricing tiers (3) — only if empty ──
insert into pricing_tiers (name, tag, price, unit, blurb, features, tone, cta_label, featured, display_order)
select * from (values
  ('Sprint','Two weeks, fixed scope','12,500','/project','For when you need a deliverable, not a discovery doc. We pick one problem and ship.', array['1 designer + 1 engineer','10 working days','Daily Loom updates','Shipped artifact (prototype or feature)','30-day Slack support'],'cream','Book a sprint',false,1),
  ('Build','6–14 weeks, full team','from 48,000','/project','Our most common engagement. A senior pair plus support — from scope to launch.', array['Senior pair + part-time PM','Weekly Thursday demo','Design system + production code','Live staging from week 1','30-day post-launch stabilization'],'crimson','Start a project',true,2),
  ('Tend','Large / multi-phase build','from 18,000','/project','For bigger or multi-phase products. A senior pair plus support, scoped in stages so you see value before committing to the next one.', array['Senior pair + part-time PM','Phased scope, fixed price per phase','Weekly demo + shared board','Design system + production code','Post-launch stabilization'],'navy','Talk it through',false,3)
) as v(name, tag, price, unit, blurb, features, tone, cta_label, featured, display_order)
where not exists (select 1 from pricing_tiers);

-- ── Tech groups (5) — only if empty ──
insert into tech_groups (label, items, display_order)
select * from (values
  ('Frontend', array['React','Next.js','TypeScript','Astro','SwiftUI','Jetpack Compose'], 1),
  ('Backend', array['Node','Go','PostgreSQL','tRPC','GraphQL','Redis'], 2),
  ('AI / ML', array['Anthropic','OpenAI','Weaviate','LangChain','Eval-driven dev'], 3),
  ('Infra', array['Vercel','Fly.io','AWS','Terraform','GitHub Actions','Sentry'], 4),
  ('Design', array['Figma','Framer','Rive','Lottie','Linear','Notion'], 5)
) as v(label, items, display_order)
where not exists (select 1 from tech_groups);

-- ── FAQs (6) — only if empty ──
insert into faqs (question, answer, display_order)
select * from (values
  ('How small is too small for Crafyne?','If you have at least two weeks of work and a real decision-maker on the project, we''ll talk. We''ve taken on focused sprints as small as $12.5k.',1),
  ('Do you take equity in lieu of cash?','Rarely, and only when we''d want to use the product ourselves. We''ll usually suggest a smaller paid scope first so both sides can find out if we work well together.',2),
  ('Where is the team based?','Our core team is in Jakarta with a few collaborators in Singapore and Lisbon. We overlap with most timezones for at least four hours a day.',3),
  ('Who owns the code and the designs?','You do, on payment of the final invoice. Source files, design files, prototypes — all yours. We keep the right to talk about the work publicly unless you ask us not to.',4),
  ('Can you work alongside our in-house team?','Yes — about half of our engagements are mixed. We''ll embed in your Linear, Slack, and standup, and review PRs from your team if helpful.',5),
  ('What does "senior pair" actually mean?','Every project is anchored by one principal-level engineer and one design director or staff designer. They make the calls and write most of the code. No project is run by a junior solo.',6)
) as v(question, answer, display_order)
where not exists (select 1 from faqs);

-- ── Case studies: backfill existing + add 2 (mobile, enterprise) ──
update case_studies set kind='Platform · Web', tags='{web}',        summary='Legacy monolith rebuilt into a fast, modern platform.'     where slug='meridian';
update case_studies set kind='Design system',  tags='{design}',     summary='A token-based system serving 40+ product teams.'          where slug='holm-systems';
update case_studies set kind='AI integration',  tags='{ai,web}',     summary='Progressive AI recommendations layered into existing UX.' where slug='verdant';
update case_studies set kind='Consumer launch', tags='{web,design}', summary='Lean MVP launched to 100k users in ten weeks.'           where slug='croft';

insert into case_studies (slug, name, year, tagline, kind, summary, outcome, tags, featured, published, display_order)
select 'halcyon','Halcyon',2026,'Mobile app','Mobile app','A calming sleep companion that doubled trial-to-paid conversions in six weeks.','+118% paid conversion','{mobile,design}',false,true,5
where not exists (select 1 from case_studies where slug='halcyon');

insert into case_studies (slug, name, year, tagline, kind, summary, outcome, tags, featured, published, display_order)
select 'moray-bank','Moray Bank Console',2025,'Enterprise','Enterprise','We rebuilt the ops console used by 4,200 bankers — and cut average task time in half.','−54% time-on-task','{enterprise,web}',false,true,6
where not exists (select 1 from case_studies where slug='moray-bank');

-- ── Team: add 2 to reach 6 ──
insert into team_members (name, role, bio, display_order, active)
select 'Arjun Pillai','AI / Platform Lead','ML engineer focused on pragmatic, cost-aware AI features.',5,true
where not exists (select 1 from team_members where name='Arjun Pillai');
insert into team_members (name, role, bio, display_order, active)
select 'Hana Pratiwi','Product Designer','Interaction and systems designer who ships.',6,true
where not exists (select 1 from team_members where name='Hana Pratiwi');

-- ── Testimonials: add 3 to reach 4 (rating defaults to 5 via 009) ──
insert into testimonials (quote, author_name, author_role, author_company, featured, display_order, rating)
select 'Crafyne shipped what our last two agencies couldn''t even scope. They asked harder questions and made us better at our own product.','Priya Anand','VP Product','Halcyon',false,2,5
where not exists (select 1 from testimonials where author_name='Priya Anand');
insert into testimonials (quote, author_name, author_role, author_company, featured, display_order, rating)
select 'Felt like working with two senior people I''d hired full-time — except the work landed on Thursday like clockwork.','Tomás Reyes','Founder','Lumenpath',false,3,5
where not exists (select 1 from testimonials where author_name='Tomás Reyes');
insert into testimonials (quote, author_name, author_role, author_company, featured, display_order, rating)
select 'They cut our internal tool from a 90-second login to a 4-second one. The team still talks about it in standups.','Yuki Hoshino','Eng Director','Moray Bank',false,4,5
where not exists (select 1 from testimonials where author_name='Yuki Hoshino');
