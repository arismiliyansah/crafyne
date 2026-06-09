-- ============================================================
-- 009 — Redesign schema: new tables + column extensions
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  bullets text[] default '{}',
  tone text not null default 'cream',
  glyph text,
  span text default 'trio',
  display_order int default 0,
  active boolean default true
);

create table if not exists stats (
  id uuid primary key default gen_random_uuid(),
  value numeric not null,
  suffix text default '',
  decimals int default 0,
  label text not null,
  display_order int default 0
);

create table if not exists pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tag text,
  price text not null,
  unit text,
  blurb text,
  features text[] default '{}',
  tone text default 'cream',
  cta_label text default 'Get started',
  featured boolean default false,
  display_order int default 0
);

create table if not exists tech_groups (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  items text[] default '{}',
  display_order int default 0
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  display_order int default 0
);

alter table testimonials add column if not exists rating int not null default 5;
alter table case_studies add column if not exists kind text;
alter table case_studies add column if not exists summary text;

alter table services      enable row level security;
alter table stats         enable row level security;
alter table pricing_tiers enable row level security;
alter table tech_groups   enable row level security;
alter table faqs          enable row level security;

drop policy if exists "public_read_services" on services;
create policy "public_read_services" on services for select using (active = true);
drop policy if exists "public_read_stats" on stats;
create policy "public_read_stats" on stats for select using (true);
drop policy if exists "public_read_pricing" on pricing_tiers;
create policy "public_read_pricing" on pricing_tiers for select using (true);
drop policy if exists "public_read_tech" on tech_groups;
create policy "public_read_tech" on tech_groups for select using (true);
drop policy if exists "public_read_faqs" on faqs;
create policy "public_read_faqs" on faqs for select using (true);

drop policy if exists "admin_all_services" on services;
create policy "admin_all_services" on services for all using (auth.role() = 'authenticated');
drop policy if exists "admin_all_stats" on stats;
create policy "admin_all_stats" on stats for all using (auth.role() = 'authenticated');
drop policy if exists "admin_all_pricing" on pricing_tiers;
create policy "admin_all_pricing" on pricing_tiers for all using (auth.role() = 'authenticated');
drop policy if exists "admin_all_tech" on tech_groups;
create policy "admin_all_tech" on tech_groups for all using (auth.role() = 'authenticated');
drop policy if exists "admin_all_faqs" on faqs;
create policy "admin_all_faqs" on faqs for all using (auth.role() = 'authenticated');
