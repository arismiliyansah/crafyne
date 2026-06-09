# Crafyne Landing Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the public homepage to match the Crafyne Landing design handoff (bold crimson redesign), wiring existing Supabase data and adding CMS-managed data for the new sections.

**Architecture:** Port the design's CSS verbatim into `globals.css`; swap fonts/tokens globally. The homepage stays a Server Component that fetches all data in parallel and composes 14 section components in `components/public/landing/`; interactive sections (Nav, Stats, CaseStudies, FAQ + a global RevealController) are client components. New data lives in 5 new Supabase tables with admin CRUD; existing tables get small column additions; a seed migration tops content up to the design's richness.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Supabase (Postgres + RLS + Auth) · Tailwind v4 + ported custom CSS · `next/font/google`.

---

## Reference material (already committed)

- **Design source:** `docs/superpowers/design-ref/crafyne-landing/project/` — `styles.css`, `sections.css`, and `components/*.jsx` (one per section), `app.jsx`, `nav.jsx`. These are the **pixel source of truth**; read the relevant file before porting each piece.
- **Spec:** `docs/superpowers/specs/2026-06-09-crafyne-landing-redesign-design.md`.
- **Existing admin pattern to mirror:** `app/admin/(cms)/team/page.tsx` and `app/admin/(cms)/testimonials/page.tsx` (single-page list + inline edit forms + `<details>` add-new block).

## Verification strategy (read first)

This repo has **no test runner** (package.json scripts: `dev`, `build`, `start`, `lint`). Adding one is out of scope. Verification per task is therefore:
- **Typecheck:** `npx tsc --noEmit` → expect no errors.
- **Lint:** `npm run lint` → expect no errors/warnings in changed files.
- **Build (milestones):** `npm run build` → expect success.
- **Visual (milestones):** `npm run dev`, open `http://localhost:3000`, verify the named behavior.

Migrations are applied **manually by the user** in the Supabase SQL Editor (this project has no migration runner — see the `-- Run in: Supabase Dashboard` headers in `supabase/migrations/`). Components must tolerate empty data (guard with `length > 0`) so the site builds/renders before migrations are applied.

---

## Shared conventions (apply in every relevant task)

### S1. JSX → TSX porting rules
When converting a `docs/superpowers/design-ref/crafyne-landing/project/components/<x>.jsx` to `components/public/landing/<X>.tsx`:
1. Delete the trailing `window.<X> = <X>;` line and the `const { ... } = React;` lines.
2. `export default function <X>(props) { ... }`. Keep **all `className` values exactly** (they map to ported CSS).
3. Replace hard-coded data arrays inside the component with values from `props` (each task specifies the prop interface).
4. For interactive components add `'use client'` as the first line and `import { useState, useEffect, useRef } from 'react'`; replace `React.useState`→`useState`, etc.
5. SVGs are already JSX-valid (`strokeWidth`, `fill`, etc.) — keep as-is.
6. Replace any `window.CRAFYNE_PATHS`/`paths.js` usage with the explicit `href` values given in the task (in-page anchors).
7. Where real images exist (team `photo_url`, case `cover_image_url`), render `next/image` with `fill` inside the existing visual container; otherwise keep the CSS placeholder/initials markup.
8. Escape literal apostrophes in JSX text as in the design (`&rsquo;`, `&ldquo;`), or use `{"'"}`.

### S2. CSS font-family rewrite map
When porting `styles.css`/`sections.css`, replace every font-family declaration:
| Design CSS | Replace with |
|---|---|
| `"Bricolage Grotesque", ...` | `var(--font-display)` |
| `"DM Sans", ...` | `var(--font-sans)` |
| `"Instrument Serif", serif` | `var(--font-serif)` |
| `"JetBrains Mono", ...` | `var(--font-mono)` |

### S3. Tone/shape derivation helper
Create once in **Task 6**, used by CaseStudies/Team/Testimonials to assign rotating colors without per-row admin fields. **Caveat:** not every section's CSS defines all six tone variants. Team (`.tm--*`) and CaseStudies (`.case--*`) define all six (the design used 6 items each). Testimonials (`.q--*`) define only four (crimson/peach/navy/orange) — so Testimonials must cycle within those four (see Task 22).

### S4. Nav links (Next version)
The landing is single-page, so nav links are in-page anchors:
```ts
const links = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#team', label: 'Team' },
  { href: '#faq', label: 'FAQ' },
]
```
`nav__book` "Book a call" → `#contact`. `nav__login` → the studio email as `mailto:` (mono).

### S5. Per-task git commit
Each task ends by committing only its files. Use a clear message; end the body with:
```
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
```

---

# Phase 1 — Design system foundation

### Task 1: Swap fonts in the root layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace the font imports/instances**

Replace the `Instrument_Serif`/`Inter` block (lines ~2–19) with four families exposed as CSS variables:

```tsx
import { Bricolage_Grotesque, DM_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google'

const display = Bricolage_Grotesque({
  variable: '--font-display', subsets: ['latin'], weight: ['400','500','600','700'], display: 'swap',
})
const sans = DM_Sans({
  variable: '--font-sans', subsets: ['latin'], weight: ['400','500','600','700'], display: 'swap',
})
const serif = Instrument_Serif({
  variable: '--font-serif', subsets: ['latin'], weight: ['400'], style: ['normal','italic'], display: 'swap',
})
const mono = JetBrains_Mono({
  variable: '--font-mono', subsets: ['latin'], weight: ['400','500'], display: 'swap',
})
```

- [ ] **Step 2: Update the `<html>` className**

```tsx
<html lang="en" className={`${display.variable} ${sans.variable} ${serif.variable} ${mono.variable}`} data-scroll-behavior="smooth">
```

- [ ] **Step 3: Verify** — Read `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` to confirm multi-family + `variable` usage for v16. Then `npx tsc --noEmit` → no errors.

- [ ] **Step 4: Commit** (`app/layout.tsx`) — "Swap homepage fonts to redesign families".

---

### Task 2: Port design tokens + base into globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace the `:root` token block** (lines 3–13) with the design palette (from `design-ref/.../styles.css` `:root`):

```css
:root {
  --crimson: #B91C1C;  --crimson-deep: #931414;
  --peach: #FFD9CF;    --peach-soft: #FFE9E2;
  --orange: #FB923C;   --orange-deep: #F97316;
  --navy: #0E1530;     --navy-2: #161E3D;
  --cream: #FFF6EE;    --paper: #FBF5EC;
  --ink: #0F0A07;      --ink-soft: #2B2018;   --mute: #6B5E55;
  --hair: rgba(15,10,7,0.08);
}
```

- [ ] **Step 2: Replace the `@theme inline` block** (lines 15–27) so Tailwind tokens resolve to the new vars and fonts:

```css
@theme inline {
  --color-cream: var(--cream);   --color-paper: var(--paper);
  --color-ink: var(--ink);       --color-ink-soft: var(--ink-soft);
  --color-mute: var(--mute);     --color-crimson: var(--crimson);
  --color-peach: var(--peach);   --color-orange: var(--orange);
  --color-navy: var(--navy);
  --font-display: var(--font-display);
  --font-sans: var(--font-sans);
  --font-serif: var(--font-serif);
  --font-mono: var(--font-mono);
}
```

- [ ] **Step 3: Update `body` + remove the grain overlay** — set `body` background/color/font to the new system and **delete** the `body::after` grain block (lines ~42–51) and its `@media (prefers-reduced-motion)` `body::after` line:

```css
body {
  background: var(--cream);
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 17px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
}
```

- [ ] **Step 4:** Keep the existing `.prose-editor` / `.prose-crafyne` blocks (they reference `--font-serif`/`--accent`). Replace remaining `var(--accent)` usages in those prose blocks with `var(--crimson)`. Leave the legacy `.reveal { opacity:0 } .reveal.is-visible {...} .d1/.d2/.d3` rules **in place** (the deferred blog/work pages still use them).

- [ ] **Step 5: Verify** `npx tsc --noEmit` (CSS doesn't typecheck, but ensures nothing else broke) and `npm run lint`. Commit (`app/globals.css`) — "Swap global design tokens to crimson system, remove grain".

---

### Task 3: Port styles.css utilities into globals.css

**Files:**
- Modify: `app/globals.css`
- Read: `docs/superpowers/design-ref/crafyne-landing/project/styles.css`

- [ ] **Step 1:** Append the design's utility/base layer from `styles.css` (everything after `:root`): the type helpers (`.display`, `.h1/.h2/.h3`, `.italic`, `.mono`, `.eyebrow`), `.wrap`, `.section`/`.section--tight`, the full `.btn*` set, `.row/.between/.center/.gap-*/.grid`, the **design reveal rules** (`.js-reveal.reveal`, `.reveal.in`, `.reveal[data-d="1..6"]`, the reduced-motion override), `.placeholder*`, and `::selection`. Apply the **S2 font rewrite**.

- [ ] **Step 2:** Confirm no class-name collisions with the legacy reveal rules: the design rules are scoped to `.js-reveal.reveal` / `.reveal.in` / `.reveal[data-d]`, while legacy uses `.reveal.is-visible` / `.reveal.d1`. They coexist. (Landing markup uses `data-d`; blog uses `.d1`.)

- [ ] **Step 3: Verify** `npm run lint`. Commit — "Port design utility/base CSS".

---

### Task 4: Port sections.css into globals.css

**Files:**
- Modify: `app/globals.css`
- Read: `docs/superpowers/design-ref/crafyne-landing/project/sections.css` (~44KB)

- [ ] **Step 1:** Append the **entire** `sections.css` to `globals.css` (all `.nav`, `.navMenu`, `.hero`, `.stats`, `.logos`, `.svcs`, `.proc`, `.cases`, `.cshape*`, `.team`, `.quotes`, `.price`, `.tier*`, `.stack`, `.chip`, `.cta`, `.faq`, `.foot` rules, including their `@media` blocks). Apply the **S2 font rewrite** across the whole block.

- [ ] **Step 2:** Do **not** include any `.tweaks*` rules (the tweaks panel is dropped). Search the appended block for `tweak` and remove those rules if present.

- [ ] **Step 3: Verify** `npm run lint`; `npm run build` should still succeed (the current homepage may show unstyled-but-not-broken; it gets replaced in Phase 3). Commit — "Port section CSS for landing redesign".

---

### Task 5: Verify the foundation renders (smoke)

- [ ] **Step 1:** `npm run dev`, open `http://localhost:3000`. The current homepage will look different (new tokens/fonts) but must **not** error in the console. Confirm fonts load (DM Sans body, Bricolage headings via any `.display` element). No commit (verification only). If errors appear, fix in the relevant Task 1–4 file before continuing.

---

# Phase 2 — Data model & data layer

### Task 6: Tone/shape helper

**Files:**
- Create: `components/public/landing/tones.ts`

- [ ] **Step 1:** 

```ts
export const TONES = ['crimson', 'peach', 'navy', 'orange', 'cream', 'navy-2'] as const
export type Tone = (typeof TONES)[number]
export const toneByIndex = (i: number): Tone => TONES[i % TONES.length]

export const CASE_SHAPES = ['phone', 'dashboard', 'blocks', 'card', 'grid'] as const
export type CaseShape = (typeof CASE_SHAPES)[number]
export const shapeByIndex = (i: number): CaseShape => CASE_SHAPES[i % CASE_SHAPES.length]
```

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

---

### Task 7: Schema migration (009)

**Files:**
- Create: `supabase/migrations/009_redesign_schema.sql`

- [ ] **Step 1:** Write the full schema migration:

```sql
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
```

- [ ] **Step 2: Verify** the SQL parses (visual review; no DB run here). Commit.

---

### Task 8: Seed migration (010)

**Files:**
- Create: `supabase/migrations/010_redesign_seed.sql`

- [ ] **Step 1:** Write the seed/top-up migration. Each block is guarded for idempotency.

```sql
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
  ('cta_sub',         'Tell us about the project. We reply within one working day with honest first impressions — and whether we''re the right team.')
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
  ('Sprint','Two weeks, fixed scope','12,500','USD','For when you need a deliverable, not a discovery doc. We pick one problem and ship.', array['1 designer + 1 engineer','10 working days','Daily Loom updates','Shipped artifact (prototype or feature)','30-day Slack support'],'cream','Book a sprint',false,1),
  ('Build','6–14 weeks, full team','from 48,000','USD / mo','Our most common engagement. A senior pair plus support — from scope to launch.', array['Senior pair + part-time PM','Weekly Thursday demo','Design system + production code','Live staging from week 1','30-day post-launch stabilization'],'crimson','Start a project',true,2),
  ('Tend','Ongoing retainer','from 18,000','USD / mo','For teams that want a partner in the chair, not a vendor on call. Capacity-based, no minimums.', array['Reserved weekly capacity','Roadmap + critique sessions','Shared Linear board','Right of refusal on new clients','Quarterly product review'],'navy','Talk about a retainer',false,3)
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
update case_studies set kind='Platform · Web', tags='{web}',      summary='Legacy monolith rebuilt into a fast, modern platform.'        where slug='meridian';
update case_studies set kind='Design system',  tags='{design}',   summary='A token-based system serving 40+ product teams.'             where slug='holm-systems';
update case_studies set kind='AI integration',  tags='{ai,web}',   summary='Progressive AI recommendations layered into existing UX.'    where slug='verdant';
update case_studies set kind='Consumer launch', tags='{web,design}', summary='Lean MVP launched to 100k users in ten weeks.'              where slug='croft';

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
```

- [ ] **Step 2: Verify** SQL parses (visual review). Commit. **Then tell the user to run `009` then `010` in the Supabase SQL Editor.**

---

### Task 9: Update `types.ts`

**Files:**
- Modify: `lib/supabase/types.ts`

- [ ] **Step 1:** Add the five new tables to `Database['public']['Tables']`, following the existing `Row/Insert/Update` shape. Example for `services` (repeat the analogous shape for `stats`, `pricing_tiers`, `tech_groups`, `faqs` using the columns from Task 7):

```ts
services: {
  Row: {
    id: string; title: string; body: string; bullets: string[]
    tone: string; glyph: string | null; span: string
    display_order: number; active: boolean
  }
  Insert: Omit<Database['public']['Tables']['services']['Row'], 'id'>
  Update: Partial<Database['public']['Tables']['services']['Insert']>
}
stats: {
  Row: { id: string; value: number; suffix: string; decimals: number; label: string; display_order: number }
  Insert: Omit<Database['public']['Tables']['stats']['Row'], 'id'>
  Update: Partial<Database['public']['Tables']['stats']['Insert']>
}
pricing_tiers: {
  Row: {
    id: string; name: string; tag: string | null; price: string; unit: string | null
    blurb: string | null; features: string[]; tone: string; cta_label: string
    featured: boolean; display_order: number
  }
  Insert: Omit<Database['public']['Tables']['pricing_tiers']['Row'], 'id'>
  Update: Partial<Database['public']['Tables']['pricing_tiers']['Insert']>
}
tech_groups: {
  Row: { id: string; label: string; items: string[]; display_order: number }
  Insert: Omit<Database['public']['Tables']['tech_groups']['Row'], 'id'>
  Update: Partial<Database['public']['Tables']['tech_groups']['Insert']>
}
faqs: {
  Row: { id: string; question: string; answer: string; display_order: number }
  Insert: Omit<Database['public']['Tables']['faqs']['Row'], 'id'>
  Update: Partial<Database['public']['Tables']['faqs']['Insert']>
}
```

- [ ] **Step 2:** Add `rating: number` to `testimonials.Row`; add `kind: string | null` and `summary: string | null` to `case_studies.Row`.

- [ ] **Step 3:** Replace the old `Service` interface (the `{ order; name; description }` settings shape, lines ~91–95) with table-derived convenience types, and add the rest:

```ts
export type Service     = Database['public']['Tables']['services']['Row']
export type Stat        = Database['public']['Tables']['stats']['Row']
export type PricingTier = Database['public']['Tables']['pricing_tiers']['Row']
export type TechGroup   = Database['public']['Tables']['tech_groups']['Row']
export type Faq         = Database['public']['Tables']['faqs']['Row']
```

- [ ] **Step 4: Verify** `npx tsc --noEmit` (expect errors in `queries.ts`/`page.tsx` that consume the old `Service` shape — fixed in Tasks 10/26). Commit.

---

### Task 10: Update `queries.ts`

**Files:**
- Modify: `lib/supabase/queries.ts`

- [ ] **Step 1:** Update the import to include new types and replace `getServices`:

```ts
import type { CaseStudy, Post, TeamMember, Testimonial, SiteSettings, Service, Stat, PricingTier, TechGroup, Faq } from './types'

export async function getServices(): Promise<Service[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('services').select('*').eq('active', true).order('display_order', { ascending: true })
  return (data ?? []) as Service[]
}
```

- [ ] **Step 2:** Append four getters (same shape, all tolerate missing tables via `?? []`):

```ts
export async function getStats(): Promise<Stat[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('stats').select('*').order('display_order', { ascending: true })
  return (data ?? []) as Stat[]
}
export async function getPricingTiers(): Promise<PricingTier[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('pricing_tiers').select('*').order('display_order', { ascending: true })
  return (data ?? []) as PricingTier[]
}
export async function getTechGroups(): Promise<TechGroup[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('tech_groups').select('*').order('display_order', { ascending: true })
  return (data ?? []) as TechGroup[]
}
export async function getFaqs(): Promise<Faq[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('faqs').select('*').order('display_order', { ascending: true })
  return (data ?? []) as Faq[]
}
```

- [ ] **Step 3:** Remove the now-unused `getServices` JSON-parsing logic and the `Service` import from the old shape if any lint error remains. `npx tsc --noEmit` → no errors in this file. Commit.

---

### Task 11: New server actions in `content.ts`

**Files:**
- Modify: `lib/actions/content.ts`

- [ ] **Step 1:** Extend the existing `upsertTestimonial` payload with `rating: parseInt(formData.get('rating') as string) || 5`, and `upsertCaseStudy` payload with `kind: (formData.get('kind') as string) || null` and `summary: (formData.get('summary') as string) || null`.

- [ ] **Step 2:** Append CRUD actions for the five new entities. Pattern mirrors existing actions (cast `as any` like the rest of this file, `revalidatePath('/')` + admin path, `redirect`). Full code:

```ts
// ── Services ──
export async function upsertService(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null
  const payload = {
    title: (formData.get('title') as string).trim(),
    body: (formData.get('body') as string).trim(),
    bullets: (formData.get('bullets') as string).split('\n').map(s => s.trim()).filter(Boolean),
    tone: (formData.get('tone') as string) || 'cream',
    glyph: (formData.get('glyph') as string) || null,
    span: (formData.get('span') as string) || 'trio',
    display_order: parseInt(formData.get('display_order') as string) || 0,
    active: formData.get('active') === 'on',
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (id) await (supabase.from('services') as any).update(payload).eq('id', id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else await (supabase.from('services') as any).insert(payload)
  revalidatePath('/admin/services'); revalidatePath('/'); redirect('/admin/services')
}
export async function deleteService(id: string) {
  const supabase = await createClient()
  await supabase.from('services').delete().eq('id', id)
  revalidatePath('/admin/services'); revalidatePath('/'); redirect('/admin/services')
}

// ── Stats ──
export async function upsertStat(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null
  const payload = {
    value: parseFloat(formData.get('value') as string) || 0,
    suffix: (formData.get('suffix') as string) || '',
    decimals: parseInt(formData.get('decimals') as string) || 0,
    label: (formData.get('label') as string).trim(),
    display_order: parseInt(formData.get('display_order') as string) || 0,
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (id) await (supabase.from('stats') as any).update(payload).eq('id', id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else await (supabase.from('stats') as any).insert(payload)
  revalidatePath('/admin/stats'); revalidatePath('/'); redirect('/admin/stats')
}
export async function deleteStat(id: string) {
  const supabase = await createClient()
  await supabase.from('stats').delete().eq('id', id)
  revalidatePath('/admin/stats'); revalidatePath('/'); redirect('/admin/stats')
}

// ── Pricing ──
export async function upsertPricingTier(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null
  const payload = {
    name: (formData.get('name') as string).trim(),
    tag: (formData.get('tag') as string) || null,
    price: (formData.get('price') as string).trim(),
    unit: (formData.get('unit') as string) || null,
    blurb: (formData.get('blurb') as string) || null,
    features: (formData.get('features') as string).split('\n').map(s => s.trim()).filter(Boolean),
    tone: (formData.get('tone') as string) || 'cream',
    cta_label: (formData.get('cta_label') as string) || 'Get started',
    featured: formData.get('featured') === 'on',
    display_order: parseInt(formData.get('display_order') as string) || 0,
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (id) await (supabase.from('pricing_tiers') as any).update(payload).eq('id', id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else await (supabase.from('pricing_tiers') as any).insert(payload)
  revalidatePath('/admin/pricing'); revalidatePath('/'); redirect('/admin/pricing')
}
export async function deletePricingTier(id: string) {
  const supabase = await createClient()
  await supabase.from('pricing_tiers').delete().eq('id', id)
  revalidatePath('/admin/pricing'); revalidatePath('/'); redirect('/admin/pricing')
}

// ── Tech groups ──
export async function upsertTechGroup(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null
  const payload = {
    label: (formData.get('label') as string).trim(),
    items: (formData.get('items') as string).split(',').map(s => s.trim()).filter(Boolean),
    display_order: parseInt(formData.get('display_order') as string) || 0,
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (id) await (supabase.from('tech_groups') as any).update(payload).eq('id', id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else await (supabase.from('tech_groups') as any).insert(payload)
  revalidatePath('/admin/tech-stack'); revalidatePath('/'); redirect('/admin/tech-stack')
}
export async function deleteTechGroup(id: string) {
  const supabase = await createClient()
  await supabase.from('tech_groups').delete().eq('id', id)
  revalidatePath('/admin/tech-stack'); revalidatePath('/'); redirect('/admin/tech-stack')
}

// ── FAQs ──
export async function upsertFaq(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null
  const payload = {
    question: (formData.get('question') as string).trim(),
    answer: (formData.get('answer') as string).trim(),
    display_order: parseInt(formData.get('display_order') as string) || 0,
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (id) await (supabase.from('faqs') as any).update(payload).eq('id', id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else await (supabase.from('faqs') as any).insert(payload)
  revalidatePath('/admin/faq'); revalidatePath('/'); redirect('/admin/faq')
}
export async function deleteFaq(id: string) {
  const supabase = await createClient()
  await supabase.from('faqs').delete().eq('id', id)
  revalidatePath('/admin/faq'); revalidatePath('/'); redirect('/admin/faq')
}
```

- [ ] **Step 3: Verify** `npx tsc --noEmit`; `npm run lint`. Commit.

---

# Phase 3 — Landing page

> For each component: **read the matching `design-ref` jsx first**, then apply **S1** porting rules. Verification per component is `npx tsc --noEmit` (visual check happens at Task 26). Commit per component.

### Task 12: RevealController (global scroll-reveal)

**Files:**
- Create: `components/public/landing/RevealController.tsx`
- Read: `design-ref/.../app.jsx` (the `useScrollReveal` hook)

- [ ] **Step 1:** Port the hook into a render-nothing client component:

```tsx
'use client'
import { useEffect } from 'react'

export default function RevealController() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    els.forEach(el => el.classList.add('js-reveal'))
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' })
    els.forEach(el => io.observe(el))
    const safety = setTimeout(() => els.forEach(el => el.classList.add('in')), 2000)
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) els.forEach(el => el.classList.add('in'))
    return () => { io.disconnect(); clearTimeout(safety) }
  }, [])
  return null
}
```

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

---

### Task 13: Nav (client)

**Files:**
- Create: `components/public/landing/Nav.tsx`
- Read: `design-ref/.../components/nav.jsx`

- [ ] **Step 1:** Port per **S1** with `'use client'`. Keep the scroll-state effect, mobile-menu open state, scroll-lock effect, and Esc handler exactly. Props: `{ email: string }`. Replace the `P = window.CRAFYNE_PATHS` links with the **S4** array. Brand `<a href="#top">`. `nav__book` → `#contact`; `nav__login` → `mailto:${email}` showing the email (mono). Mobile menu uses the same links array; its footer "Book a call" → `#contact`, mail link → `mailto:${email}`.

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

### Task 14: Footer

**Files:**
- Create: `components/public/landing/Footer.tsx`
- Read: `design-ref/.../components/footer.jsx`

- [ ] **Step 1:** Port per **S1** as a server component. Props: `{ settings: SiteSettings }`. Replace `P.page(...)`/`P.landing(...)` hrefs with **S4** anchors (Work→#work, Services→#services, Process→#process, Pricing→#pricing; About/Journal/Careers/Press → `#` for now). Email link → `mailto:${settings.agency_email}`. Address line → `settings.agency_address` + `settings.agency_location`. Brand line uses `settings.agency_tagline`. Copyright year `{new Date().getFullYear()}`.

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

### Task 15: Hero

**Files:**
- Create: `components/public/landing/Hero.tsx`
- Read: `design-ref/.../components/hero.jsx`

- [ ] **Step 1:** Port per **S1** as a server component. **Keep the 3-line title + inline window/phone/badge graphics exactly as hard-coded markup.** Props: `{ settings: SiteSettings }`. Wire: chip text ← `settings.hero_chip`; primary CTA label ← `settings.hero_cta_primary` (href `#contact`); secondary "Watch reel" label ← `settings.hero_cta_secondary` (href `#work`); lede ← `settings.hero_lede`; the three `hero__metaItem` spans ← `settings.hero_meta_1/2/3`.

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

### Task 16: Stats (client)

**Files:**
- Create: `components/public/landing/Stats.tsx`
- Read: `design-ref/.../components/stats.jsx`

- [ ] **Step 1:** Port per **S1** with `'use client'`. Keep `useCountUp` + the `IntersectionObserver` start trigger exactly. Props: `{ stats: Stat[]; eyebrow: string; title: string }`. Render the head from `eyebrow`/`title` (wrap a key phrase in `<span className="italic">` is optional — plain text is fine). Map `stats` to `<StatItem value={s.value} suffix={s.suffix} decimals={s.decimals} label={s.label} started={started} />`. If `stats.length === 0`, return `null`.

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

### Task 17: LogoStrip

**Files:**
- Create: `components/public/landing/LogoStrip.tsx`
- Read: `design-ref/.../components/logo-strip.jsx`

- [ ] **Step 1:** Port per **S1** as a server component. Props: `{ clients: string[] }` (from `settings.proof_clients` split on commas, passed by the page). Build the marquee by mapping `clients` to `{ name }` items (drop the per-item `glyph`, or keep a single static glyph `◆`). Duplicate the array for the infinite-scroll rail (`const full = [...clients, ...clients]`). Header note text stays static. If `clients.length === 0`, return `null`.

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

### Task 18: Services

**Files:**
- Create: `components/public/landing/Services.tsx`
- Read: `design-ref/.../components/services.jsx`

- [ ] **Step 1:** Port per **S1** as a server component. Keep the `ServiceCard` sub-component markup. Props: `{ services: Service[] }`. Map each row to a card: `idx={i+1}`, `title`, `body`, `bullets`, `tone`, `glyph`, `span` (`svc--${span}`). Keep the static `svcs__head` copy. If `services.length === 0`, return `null`.

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

### Task 19: Process

**Files:**
- Create: `components/public/landing/Process.tsx`
- Read: `design-ref/.../components/process.jsx`

- [ ] **Step 1:** Port per **S1** as a server component. The 4 steps stay **hard-coded** in the component (per spec §6.5). No props. Copy the `steps` array verbatim from the design jsx.

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

### Task 20: CaseStudies (client, filter)

**Files:**
- Create: `components/public/landing/CaseStudies.tsx`
- Read: `design-ref/.../components/case-studies.jsx`

- [ ] **Step 1:** Port per **S1** with `'use client'`. Keep the `filters` array, the `useState` filter, and the `CaseShape` sub-component verbatim. Props: `{ cases: CaseStudy[] }`. Map each `CaseStudy` to the card using: `name`, `kind` (fallback `tagline`), `year`, `tags`, `summary` (teaser), `outcome` (metric). Derive `tone = toneByIndex(i)` and `shape = shapeByIndex(i)` from `components/public/landing/tones` (import). The "Read case study" link → `/work/${slug}`. The filter compares `filter` against `c.tags`. If `cases.length === 0`, return `null`.

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

### Task 21: Team

**Files:**
- Create: `components/public/landing/Team.tsx`
- Read: `design-ref/.../components/team.jsx`

- [ ] **Step 1:** Port per **S1** as a server component. Props: `{ team: TeamMember[] }`. For each: `name`, `role`, `tone = toneByIndex(i)`, `initials = name.split(' ').map(n=>n[0]).join('').slice(0,2)`. If `member.photo_url`, render `next/image` (`fill`, `sizes="(max-width:640px) 50vw, 25vw"`, `className="object-cover"`) inside `.tm__avatar` instead of the initials/tag. Keep static head copy. If `team.length === 0`, return `null`.

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

### Task 22: Testimonials

**Files:**
- Create: `components/public/landing/Testimonials.tsx`
- Read: `design-ref/.../components/testimonials.jsx`

- [ ] **Step 1:** Port per **S1** as a server component. Props: `{ testimonials: Testimonial[] }`. The `.q--*` CSS only defines four tones, so cycle within them: `const Q_TONES = ['crimson','peach','navy','orange'] as const` and `tone = Q_TONES[i % Q_TONES.length]` (do **not** use the 6-tone `toneByIndex` here). Map each: `body = quote`, `who = author_name`, `role = [author_role, author_company].filter(Boolean).join(', ')`, `rating = t.rating`. Keep the star-render loop. If `testimonials.length === 0`, return `null`.

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

### Task 23: Pricing

**Files:**
- Create: `components/public/landing/Pricing.tsx`
- Read: `design-ref/.../components/pricing.jsx`

- [ ] **Step 1:** Port per **S1** as a server component. Props: `{ tiers: PricingTier[] }`. Map each row to a `tier` with `name`, `tag`, `price`, `unit`, `blurb`, `features`, `tone`, `cta: cta_label`, `featured`. Keep the ribbon/check-list markup and the CTA arrow stroke-color logic (`featured ? #B91C1C : tone==='navy' ? #0E1530 : white`). CTA href → `#contact`. If `tiers.length === 0`, return `null`.

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

### Task 24: TechStack

**Files:**
- Create: `components/public/landing/TechStack.tsx`
- Read: `design-ref/.../components/tech-stack.jsx`

- [ ] **Step 1:** Port per **S1** as a server component. Props: `{ groups: TechGroup[] }`. Map each group: `label`, `items`. Keep static head copy. If `groups.length === 0`, return `null`.

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

### Task 25: CTA (+ InquiryForm) and FAQ (client)

**Files:**
- Create: `components/public/landing/CTA.tsx`, `components/public/landing/FAQ.tsx`
- Read: `design-ref/.../components/cta.jsx`, `design-ref/.../components/faq.jsx`, `components/public/InquiryForm.tsx`

- [ ] **Step 1 (CTA):** Port per **S1** as a server component with `id="contact"`. Props: `{ settings: SiteSettings }`. Wire `cta__eye` ← `settings.cta_eyebrow`, `cta__title` ← `settings.cta_title`, `cta__sub` ← `settings.cta_sub`, mail link → `mailto:${settings.agency_email}`. **Below the `cta__panel`**, render the existing `<InquiryForm />` (import from `@/components/public/InquiryForm`) so the lead form remains functional. The panel's primary button href → `#contact` (scrolls to the form).

- [ ] **Step 2 (FAQ):** Port per **S1** with `'use client'`. Keep the `useState` open-index accordion. Props: `{ faqs: Faq[] }`. Map each: `q = question`, `a = answer`. The sub-paragraph mail link → keep `hello@crafyne.studio` or accept an `email` prop. If `faqs.length === 0`, return `null`.

- [ ] **Step 3: Verify** `npx tsc --noEmit`. Commit.

### Task 26: Assemble the homepage

**Files:**
- Modify (replace): `app/(public)/page.tsx`

- [ ] **Step 1:** Rewrite the homepage as a Server Component that fetches everything in parallel and composes the sections. Keep `export const revalidate = 60`. Update metadata/JSON-LD facts to Jakarta + `agency_email`.

```tsx
import type { Metadata } from 'next'
import { getSettings, getServices, getCaseStudies, getTeam, getTestimonials, getStats, getPricingTiers, getTechGroups, getFaqs } from '@/lib/supabase/queries'
import Nav from '@/components/public/landing/Nav'
import RevealController from '@/components/public/landing/RevealController'
import Hero from '@/components/public/landing/Hero'
import Stats from '@/components/public/landing/Stats'
import LogoStrip from '@/components/public/landing/LogoStrip'
import Services from '@/components/public/landing/Services'
import Process from '@/components/public/landing/Process'
import CaseStudies from '@/components/public/landing/CaseStudies'
import Team from '@/components/public/landing/Team'
import Testimonials from '@/components/public/landing/Testimonials'
import Pricing from '@/components/public/landing/Pricing'
import TechStack from '@/components/public/landing/TechStack'
import CTA from '@/components/public/landing/CTA'
import FAQ from '@/components/public/landing/FAQ'
import Footer from '@/components/public/landing/Footer'

export const revalidate = 60
export const metadata: Metadata = { alternates: { canonical: '/' } }

export default async function HomePage() {
  const [settings, services, cases, team, testimonials, stats, tiers, groups, faqs] = await Promise.all([
    getSettings(), getServices(), getCaseStudies(), getTeam(), getTestimonials(),
    getStats(), getPricingTiers(), getTechGroups(), getFaqs(),
  ])
  const clients = (settings.proof_clients ?? '').split(',').map(s => s.trim()).filter(Boolean)

  return (
    <>
      <Nav email={settings.agency_email ?? 'hello@crafyne.studio'} />
      <RevealController />
      <Hero settings={settings} />
      <Stats stats={stats} eyebrow={settings.stats_eyebrow ?? 'by the numbers'} title={settings.stats_title ?? ''} />
      <LogoStrip clients={clients} />
      <Services services={services} />
      <Process />
      <CaseStudies cases={cases} />
      <Team team={team} />
      <Testimonials testimonials={testimonials} />
      <Pricing tiers={tiers} />
      <TechStack groups={groups} />
      <CTA settings={settings} />
      <FAQ faqs={faqs} />
      <Footer settings={settings} />
    </>
  )
}
```

(Keep the JSON-LD `<script>` from the old page if desired, updating `description`/`email`/`sameAs` from `settings`.)

- [ ] **Step 2: Verify (milestone)** `npx tsc --noEmit` → no errors. `npm run build` → success. `npm run dev` → all sections render top-to-bottom; reveals animate; counters run; case filter tabs work; FAQ accordion toggles; nav turns from white→ink on scroll; mobile menu opens/closes (resize to <920px). Sections with no data are hidden, not broken.

- [ ] **Step 3: Commit** — "Rebuild homepage with redesigned landing sections".

---

# Phase 4 — Admin CMS

### Task 27: Sidebar nav items

**Files:**
- Modify: `components/admin/AdminSidebar.tsx`

- [ ] **Step 1:** Add to the `navItems` array (after `Work`/before `Settings`, sensible order): `Services` (`/admin/services`, icon `✦`), `Stats` (`/admin/stats`, icon `№`), `Pricing` (`/admin/pricing`, icon `$`), `Tech Stack` (`/admin/tech-stack`, icon `⌗`), `FAQ` (`/admin/faq`, icon `?`).

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

### Task 28: Services admin page (template for Tasks 29–32)

**Files:**
- Create: `app/admin/(cms)/services/page.tsx`

- [ ] **Step 1:** Mirror `app/admin/(cms)/team/page.tsx` exactly (single page: list of inline edit forms + `<details>` add-new). Fetch `services` ordered by `display_order`. Import `upsertService, deleteService` from `@/lib/actions/content`. Form fields (use `Input`/`Textarea`/`Toggle`/`SubmitButton` from `@/components/admin/FormField`):
  - hidden `id`
  - `Input` Title `name="title"` required
  - `Textarea` Body `name="body"` rows=2
  - `Textarea` Bullets `name="bullets"` rows=3 hint="One per line"
  - `Input` Tone `name="tone"` (hint: peach|navy|orange|crimson|cream)
  - `Input` Glyph `name="glyph"`
  - `Input` Span `name="span"` (hint: trio|wide)
  - `Input` Order `name="display_order"` type=number
  - `Toggle` Active `name="active"` defaultChecked
  - `DeleteButton action={deleteService} id={s.id}`

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

### Task 29: Stats admin page

**Files:**
- Create: `app/admin/(cms)/stats/page.tsx`

- [ ] **Step 1:** Same structure as Task 28, fetching `stats`, importing `upsertStat, deleteStat`. Fields: hidden `id`; `Input` Value `name="value"` (number, step any); `Input` Suffix `name="suffix"`; `Input` Decimals `name="decimals"` type=number; `Input` Label `name="label"` required; `Input` Order `name="display_order"` type=number; `DeleteButton action={deleteStat}`.

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

### Task 30: Pricing admin page

**Files:**
- Create: `app/admin/(cms)/pricing/page.tsx`

- [ ] **Step 1:** Same structure, fetching `pricing_tiers`, importing `upsertPricingTier, deletePricingTier`. Fields: hidden `id`; `Input` Name required; `Input` Tag; `Input` Price required; `Input` Unit; `Textarea` Blurb rows=2; `Textarea` Features rows=5 hint="One per line"; `Input` Tone; `Input` CTA label `name="cta_label"`; `Input` Order type=number; `Toggle` Featured `name="featured"`; `DeleteButton action={deletePricingTier}`.

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

### Task 31: Tech-stack admin page

**Files:**
- Create: `app/admin/(cms)/tech-stack/page.tsx`

- [ ] **Step 1:** Same structure, fetching `tech_groups`, importing `upsertTechGroup, deleteTechGroup`. Fields: hidden `id`; `Input` Label required; `Textarea` Items `name="items"` rows=2 hint="Comma-separated"; `Input` Order type=number; `DeleteButton action={deleteTechGroup}`.

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

### Task 32: FAQ admin page

**Files:**
- Create: `app/admin/(cms)/faq/page.tsx`

- [ ] **Step 1:** Same structure, fetching `faqs`, importing `upsertFaq, deleteFaq`. Fields: hidden `id`; `Input` Question `name="question"` required; `Textarea` Answer `name="answer"` rows=3; `Input` Order type=number; `DeleteButton action={deleteFaq}`.

- [ ] **Step 2: Verify** `npx tsc --noEmit`. Commit.

### Task 33: Extend testimonials + work admin forms

**Files:**
- Modify: `app/admin/(cms)/testimonials/page.tsx`
- Modify: the work edit form(s) under `app/admin/(cms)/work/`

- [ ] **Step 1 (testimonials):** In both the edit form and the add-new form, add an `Input` Rating `name="rating"` type=number `min={1}` `max={5}` defaultValue `{t.rating}` / `"5"`.

- [ ] **Step 2 (work):** Read `app/admin/(cms)/work/new/page.tsx` and `app/admin/(cms)/work/[id]/page.tsx`. Add `Input` Kind `name="kind"` (hint: e.g. "Mobile app") and `Textarea` Summary `name="summary"` rows=2 (card teaser), with `defaultValue` from the record on the edit form. (The `upsertCaseStudy` action already reads them after Task 11.)

- [ ] **Step 3: Verify** `npx tsc --noEmit`; `npm run lint`. Commit.

---

# Phase 5 — Final verification

### Task 34: Full build, lint, and smoke checklist

- [ ] **Step 1:** `npm run lint` → clean. `npm run build` → success.
- [ ] **Step 2:** Confirm the user has run migrations `009` + `010` in Supabase. With data present, `npm run dev` and verify each section shows seeded content; counters animate; case filter shows all 6 across categories (Web/Mobile/AI/Design/Enterprise); pricing "Build" is featured; FAQ accordion; nav scroll-state + mobile menu; footer facts say Jakarta + hello@crafyne.studio.
- [ ] **Step 3:** Admin smoke: visit `/admin/services`, `/admin/stats`, `/admin/pricing`, `/admin/tech-stack`, `/admin/faq` — create/edit/delete one row each; confirm the homepage reflects the change after revalidation. Confirm testimonials rating + work kind/summary save.
- [ ] **Step 4:** Confirm `/blog` and `/work` still load (new tokens applied, not broken).
- [ ] **Step 5: Final commit** if anything was fixed during smoke — "Finalize Crafyne landing redesign".

---

## Notes & deferred work (not in this plan)
- Restyling `/work`, `/work/[slug]`, `/blog`, `/privacy` to the new design (they inherit tokens only).
- New sub-pages (About, Contact, Careers, Journal) + multi-page nav — `design-ref/.../pages/*.jsx` are kept for that future work.
- Optional: type the Supabase clients with `<Database>` to remove `as any` casts project-wide.
- Optional: sanitize blog `dangerouslySetInnerHTML` (pre-existing XSS surface, unrelated to this redesign).
