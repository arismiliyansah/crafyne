# Crafyne Landing Redesign — Design Spec

_Date: 2026-06-09 · Status: approved-pending-review_

## 1. Goal

Rebuild the public homepage (`app/(public)/page.tsx`) to match the **Crafyne Landing** design
handed off from Claude Design (a bold crimson redesign of the existing Crafyne brand). Wire the
new sections to existing Supabase data where it exists, and add new CMS-managed data where the
design introduces sections the current site does not have.

The design source lives (un-committed) at the extracted bundle `landingpage/project/` —
`styles.css`, `sections.css`, and per-section JSX components. This spec captures everything needed
to implement without that bundle present.

## 2. Scope

**In scope (this round):**
- Replace the homepage with the new design, section-for-section.
- Swap global design tokens + fonts to the new system (affects the whole site).
- Port the design's CSS verbatim (not a Tailwind rewrite).
- New Supabase tables + admin CRUD for: `services`, `stats`, `pricing_tiers`, `tech_groups`, `faqs`.
- Extend `testimonials` (+rating) and `case_studies` (+kind, +summary).
- Seed migration topping existing content up to the design's richness.
- Adopt design facts: HQ **Jakarta, Indonesia**; email **hello@crafyne.studio**.

**Out of scope (deferred, follow-up work):**
- Restyling existing public pages `/work`, `/work/[slug]`, `/blog`, `/privacy` (they will inherit
  the new global tokens but are not polished to the new design this round).
- New sub-pages from the design (About, Contact, Careers, Journal) and multi-page nav.
- The design's "tweaks panel" (a design-tool artifact — never shipped).
- The design's hand-drawn inline hero graphics fidelity is best-effort (pure CSS/SVG, no data).

## 3. Locked decisions (from brainstorming)

| Decision | Choice |
|---|---|
| Scope | Landing page first; global tokens change; other pages follow later |
| New-section data | Full CMS — new tables + admin forms |
| Sample data | Top up existing Supabase rows with a new seed migration |
| Studio facts | Adopt the design's: Jakarta · hello@crafyne.studio |
| CSS strategy | Port the design's CSS verbatim |

## 4. Design system

### 4.1 Tokens (`app/globals.css`)
Replace the green/earthy palette with the design's tokens (from `styles.css`):

```
--crimson #B91C1C  --crimson-deep #931414
--peach #FFD9CF     --peach-soft #FFE9E2
--orange #FB923C    --orange-deep #F97316
--navy #0E1530      --navy-2 #161E3D
--cream #FFF6EE     --paper #FBF5EC
--ink #0F0A07       --ink-soft #2B2018   --mute #6B5E55
--hair rgba(15,10,7,0.08)
```

Keep `@import "tailwindcss"` and the `@theme inline` block, but remap the Tailwind color/font
tokens to the new variables so any Tailwind utilities used in admin/blog still resolve. The
**admin panel keeps its own neutral styling** (it already hardcodes `#F9F9F7`, `#111`, etc.,
not the public tokens) so the CMS is unaffected by the palette swap.

### 4.2 Fonts (`app/layout.tsx`, via `next/font/google`)
Replace `Instrument_Serif + Inter` with four families, exposed as CSS variables on `<html>`:

| Variable | Family | Use |
|---|---|---|
| `--font-display` | Bricolage Grotesque | display/headings (wght 400–700, `wdth` 90, tight tracking) |
| `--font-sans` | DM Sans | body (400–700) |
| `--font-serif` | Instrument Serif (italic) | italic accents (unchanged family — keeps blog prose working) |
| `--font-mono` | JetBrains Mono | eyebrows, labels, meta |

The ported CSS references font families by name; rewrite those declarations to use the variables
(e.g. `font-family: var(--font-display)`). Drop the design's Anton/Archivo Black/Space Grotesk —
those existed only for the tweaks panel.

### 4.3 CSS porting
- **`styles.css`** (tokens, base, `.btn*`, `.wrap`, `.section`, `.eyebrow`, `.placeholder`,
  reveal, `::selection`) → merge into `app/globals.css`.
- **`sections.css`** (~44KB: all `.hero`, `.stats`, `.svcs`, `.proc`, `.cases`, `.team`,
  `.quotes`, `.price`, `.stack`, `.cta`, `.faq`, `.foot`, `.nav`, `.navMenu` rules) → port into
  `app/globals.css` (imported in the root layout, so global CSS import rules are satisfied).
  Class names are specific enough that global scope is safe.
- Verify against `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` and
  `13-fonts.md` during implementation (per AGENTS.md).

### 4.4 Reveal-animation reconciliation
The existing site uses `.reveal.is-visible` + `.d1/.d2/.d3` (driven by `components/public/ScrollReveal.tsx`).
The design uses `.js-reveal.reveal.in` + `data-d="1..6"` driven by **one global IntersectionObserver**.
Both systems will **coexist**:
- Keep the existing `.reveal.is-visible` rules + `ScrollReveal` component for deferred blog/work pages.
- Add the design's `.js-reveal.reveal.in` + `data-d` rules for the landing.
- Add a tiny client controller `components/public/landing/RevealController.tsx` (`'use client'`)
  that, on mount, marks `.reveal` elements `.js-reveal`, observes them, adds `.in` on intersect,
  with a 2s safety net + reduced-motion bypass (exactly as the design's `app.jsx` `useScrollReveal`).
  This lets section components stay **server components** while still animating. Mounted once in the page.

Note: the existing grain overlay (`body::after`) is **not** in the new design — remove it for a
cleaner crimson look (it currently sits over everything at `z-index:9998`).

## 5. Page & component architecture

`app/(public)/page.tsx` stays a **Server Component**. It fetches all data in parallel and renders
the section components in order. New components live in `components/public/landing/`.

```
<Nav/>                  client  — scroll state + mobile menu (settings: brand, email)
<RevealController/>     client  — global IntersectionObserver
<Hero/>                 server  — settings copy
<Stats/>                client  — animated counters; data: stats[]
<LogoStrip/>            server  — proof_clients (settings) or client names
<Services/>             server  — services[]
<Process/>             server  — process steps (settings JSON or hardcoded — see 6.5)
<CaseStudies/>          client  — filter tabs; data: case_studies[]
<Team/>                 server  — team_members[]
<Testimonials/>         server  — testimonials[] (with rating)
<Pricing/>              server  — pricing_tiers[]
<TechStack/>            server  — tech_groups[]
<CTA/>                  server  — settings copy + existing <InquiryForm/>
<FAQ/>                  client  — accordion; data: faqs[]
<Footer/>               server  — settings (address, links, email)
```

`InquiryForm` (existing) is reused inside the CTA/contact area. The page keeps `export const
revalidate = 60` and the existing JSON-LD/metadata, updated for the new facts.

### 5.1 Data → component field mapping
- **Hero**: the 3-line title + inline graphics are **hardcoded structure**; chip, lede, 3 meta
  items, and CTA labels come from settings keys (see 6.7).
- **Stats**: `stats` rows → `{value, suffix, decimals, label}`; counter animates on scroll-in.
- **Services**: `services` rows → `{title, body, bullets[], tone, glyph, span, display_order}`;
  layout is the **3 + 2 bento** (first three `span=trio`, last two `span=wide`).
- **CaseStudies**: `case_studies` rows → name, `kind` (label), year, `tags` (filter), `summary`
  (teaser), `outcome` (metric). `tone` + decorative `shape` are **derived by index** (rotating
  palette + cycling shape) to avoid extra admin fields. Filter tabs: All/Web/Mobile/AI/Design/Enterprise
  match against `tags`.
- **Team**: `team_members` rows → name, role, `photo_url` (or initials fallback). `tone` derived by index.
- **Testimonials**: `testimonials` rows → quote, author_name, author_role/company, `rating` (stars).
  `tone` derived by index.
- **Pricing**: `pricing_tiers` rows → all fields incl. `featured`, `features[]`.
- **TechStack**: `tech_groups` rows → `{label, items[]}`.
- **FAQ**: `faqs` rows → `{question, answer}`.

## 6. Data model

All new tables follow the existing RLS pattern: **public read where active/visible**, **authenticated
full access**. `id uuid pk default gen_random_uuid()`, `display_order int default 0`.

### 6.1 New table: `services` (supersedes the `site_settings.services` JSON)
```
title          text not null
body           text not null
bullets        text[]  default '{}'
tone           text    not null default 'cream'   -- peach|navy|orange|crimson|cream
glyph          text                                -- e.g. ▤ ▢ ✺ ◐ ▣
span           text    default 'trio'              -- trio|wide
display_order  int     default 0
active         boolean default true
```
RLS: public read `active = true`; authenticated all.

### 6.2 New table: `stats`
```
value          numeric not null     -- 142, 38, 4.9, 96
suffix         text default ''      -- '', '/5', '%'
decimals       int  default 0
label          text not null
display_order  int  default 0
```
RLS: public read all; authenticated all.

### 6.3 New table: `pricing_tiers`
```
name           text not null        -- Sprint | Build | Tend
tag            text                 -- 'Two weeks, fixed scope'
price          text not null        -- '12,500' | 'from 48,000'
unit           text                 -- 'USD' | 'USD / mo'
blurb          text
features       text[] default '{}'
tone           text default 'cream'
cta_label      text default 'Get started'
featured       boolean default false
display_order  int default 0
```
RLS: public read all; authenticated all.

### 6.4 New tables: `tech_groups`, `faqs`
```
tech_groups: label text not null, items text[] default '{}', display_order int
faqs:        question text not null, answer text not null, display_order int
```
RLS: public read all; authenticated all.

### 6.5 Process steps
The 4 process steps (Listen/Shape/Build/Tend) are **hardcoded** in `<Process/>` (they are stable
brand copy, identical in spirit to the current hardcoded process). Not CMS-managed this round.
(If desired later, promote to a `process_steps` table — noted, not built.)

### 6.6 Extended tables
- **`testimonials`**: `ADD COLUMN rating int NOT NULL DEFAULT 5`.
- **`case_studies`**: `ADD COLUMN kind text` (category label, e.g. "Mobile app"),
  `ADD COLUMN summary text` (card teaser sentence). `outcome` is reused as the metric;
  `tags` drives the filter.

### 6.7 Settings (`site_settings`) updates
- `agency_location` → `Jakarta, Indonesia`
- `agency_email` → `hello@crafyne.studio`
- `agency_address` (new) → `Setiabudi One, 14th floor`
- Hero keys (new/updated): `hero_chip` (`Independent software studio · Booking Q3 2026`),
  `hero_lede`, `hero_meta_1/2/3`, `hero_cta_primary` (`Start a project`),
  `hero_cta_secondary` (`Watch reel — 1:24`). The **3-line title itself is structural and
  hardcoded** in `<Hero/>` (the "WE BUILD SOFTWARE / for people WHO CARE / HOW IT FEELS" lockup
  with its inline window/phone/badge graphics and italic "for people") — it is not settings-driven,
  matching the design exactly. The legacy `hero_headline`/`hero_subheadline` settings become unused.
- Stats heading: `stats_eyebrow`, `stats_title`.
- CTA keys: `cta_eyebrow` (`/ next slot opens August 4`), `cta_title`, `cta_sub`.
- Keep existing footer social keys.

### 6.8 Seed migration (top-up, idempotent)
Schema changes (6.1–6.6: new tables, RLS, column adds) go in migration `009_redesign_schema.sql`.
The seed/top-up goes in a separate migration `010_redesign_seed.sql` that:
1. `UPDATE site_settings` for the facts/copy in 6.7.
2. Backfills `case_studies.kind/summary/tags/outcome` on existing rows, and inserts additional
   case studies so there are **≥6 published**, covering all filter categories.
3. Inserts team members up to **6** (keep existing, add the rest).
4. Inserts testimonials up to **4** and sets `rating` on all.
5. Inserts the `services` (5), `stats` (4), `pricing_tiers` (3), `tech_groups` (5), `faqs` (6)
   content below.
   Uses `ON CONFLICT DO NOTHING` / guarded inserts to stay idempotent.

#### Seed content — services (5)
| title | tone | glyph | span | body (short) | bullets |
|---|---|---|---|---|---|
| Web Engineering | peach | ▤ | trio | Marketing sites, dashboards, internal tools — fast, typed end-to-end, easy to hand off. | Next.js · TypeScript · tRPC; Headless CMS; Real performance budgets |
| Mobile Apps | navy | ▢ | trio | Native-feel iOS & Android from one team. Gestures, haptics, offline. | React Native + native modules; App Store / Play; Crashlytics, Sentry |
| AI & ML | orange | ✺ | trio | Pragmatic AI features that earn their keep — smallest model that solves it. | RAG over your data; Evals & guardrails; Cost-aware inference |
| Product Design | crimson | ◐ | wide | From first sketch to a system that scales. Research, IA, interaction, motion. | Discovery & UX research; Design system + components; Hi-fi prototypes |
| Enterprise Software | cream | ▣ | wide | Long-horizon work alongside in-house teams — modernization, internal tools, platforms. | Auth, audit, RBAC, SSO; Legacy migrations; Docs engineers love |

#### Seed content — stats (4)
142 · "Products shipped" | 38 · "Active retainer clients" | 4.9 `/5` (1 decimal) · "Avg. client rating" | 96 `%` · "Retention after first year"

#### Seed content — pricing_tiers (3)
- **Sprint** — tag "Two weeks, fixed scope", price "12,500", unit "USD", tone cream, cta "Book a sprint". Features: 1 designer + 1 engineer; 10 working days; Daily Loom updates; Shipped artifact; 30-day Slack support.
- **Build** *(featured)* — tag "6–14 weeks, full team", price "from 48,000", unit "USD / mo", tone crimson, cta "Start a project". Features: Senior pair + part-time PM; Weekly Thursday demo; Design system + production code; Live staging from week 1; 30-day post-launch stabilization.
- **Tend** — tag "Ongoing retainer", price "from 18,000", unit "USD / mo", tone navy, cta "Talk about a retainer". Features: Reserved weekly capacity; Roadmap + critique; Shared Linear board; Right of refusal on new clients; Quarterly product review.

#### Seed content — tech_groups (5)
- Frontend: React, Next.js, TypeScript, Astro, SwiftUI, Jetpack Compose
- Backend: Node, Go, PostgreSQL, tRPC, GraphQL, Redis
- AI / ML: Anthropic, OpenAI, Weaviate, LangChain, Eval-driven dev
- Infra: Vercel, Fly.io, AWS, Terraform, GitHub Actions, Sentry
- Design: Figma, Framer, Rive, Lottie, Linear, Notion

#### Seed content — faqs (6)
1. How small is too small for Crafyne? — Two weeks of work + a real decision-maker. Sprints as small as $12.5k.
2. Do you take equity in lieu of cash? — Rarely, only products we'd use; usually suggest a smaller paid scope first.
3. Where is the team based? — Core team in Jakarta, collaborators in Singapore & Lisbon; ~4h timezone overlap.
4. Who owns the code and the designs? — You do, on final payment. We keep the right to talk about the work unless asked not to.
5. Can you work alongside our in-house team? — Yes, ~half of engagements are mixed (Linear, Slack, standup, PR review).
6. What does "senior pair" mean? — One principal engineer + one design director/staff designer; no project run by a junior solo.

#### Seed content — case studies / team / testimonials top-up
Use the design's sample set for any rows added beyond what exists (Halcyon, Moray Bank Console,
Lumenpath, Porter & Rye, Fieldwise, Tessera for cases; Sari Wibowo, Daniel Okafor, Mei Tanaka,
Arjun Pillai, Hana Pratiwi, Lucas Marin for team; Priya Anand, Tomás Reyes, Yuki Hoshino,
Anya Müller for testimonials), each with category `tags`, `kind`, `summary`/`outcome` metric,
and `rating`. Existing rows are kept and backfilled.

## 7. Data layer (`lib/supabase/`)
- **`types.ts`**: add `services`, `stats`, `pricing_tiers`, `tech_groups`, `faqs` to the `Database`
  interface; add `rating` to `testimonials`, `kind`+`summary` to `case_studies`; add convenience
  type exports (`Service`, `Stat`, `PricingTier`, `TechGroup`, `Faq`).
  Note: the existing `Service` interface (settings-JSON shape) is replaced by the table Row type.
- **`queries.ts`**: change `getServices()` to read the `services` table; add `getStats()`,
  `getPricingTiers()`, `getTechGroups()`, `getFaqs()`. Keep existing query signatures otherwise.
- **`server.ts`**: optional — type the clients with `<Database>` to begin removing `as any` casts
  in new actions (nice-to-have, not required for this round).

## 8. Admin CMS (`app/admin/(cms)/`)
Add list + new + edit + delete for each new entity, mirroring the existing `work`/`team` pattern
(server component list, `FormField`/`ImageUpload`/`MultiImageUpload` as needed, server-action submit,
`DeleteButton`):
- `services/` (page, new, [id]) — title, body, bullets (comma/textarea), tone (select), glyph, span (select), order, active.
- `stats/` — value, suffix, decimals, label, order.
- `pricing/` — name, tag, price, unit, blurb, features, tone, cta_label, featured, order.
- `tech-stack/` — label, items, order.
- `faq/` — question, answer, order.
- Extend `testimonials` form (+rating) and `work` form (+kind, +summary).
- **`AdminSidebar.tsx`**: add nav items Services, Stats, Pricing, Tech Stack, FAQ.
- **`lib/actions/content.ts`**: add `upsert*`/`delete*` server actions for each new entity,
  each `revalidatePath('/')` + its admin path.

## 9. Interactivity (client components)
- **Nav**: `scrolled` state on `window.scrollY > 40` (white text over hero → cream-bg + ink text);
  mobile hamburger → X overlay menu with staggered links, Esc + X close, `html`+`body` scroll lock
  + `overscroll-behavior: contain`. Port from `nav.jsx` (drop multi-page path helper — links are
  in-page anchors `#services/#process/#pricing/#work/...` + future routes).
- **Stats**: `useCountUp` (rAF eased) triggered by an IntersectionObserver at threshold 0.3.
- **CaseStudies**: `useState` filter; client-side filter over the server-fetched rows by `tags`.
- **FAQ**: `useState` open index accordion.
- **RevealController**: the global observer described in 4.4.

## 10. Next.js 16 considerations (per AGENTS.md)
Before coding, read: `01-app/01-getting-started/13-fonts.md`, `11-css.md`, `12-images.md`.
Confirm: `next/font/google` multi-family + variable usage; global CSS import location; `next/image`
`remotePatterns` already allow `*.supabase.co`. Server Actions + `revalidatePath` patterns unchanged
from current `content.ts`.

## 11. Verification
- `npm run build` and `npm run lint` clean.
- Homepage renders all 13 sections with seeded data; no console errors.
- Counters animate on scroll; case filter, FAQ accordion, mobile menu, nav scroll-state all work.
- Admin: each new section is creatable/editable/deletable; changes revalidate the homepage.
- Reduced-motion: reveals + counters degrade gracefully.
- Existing `/blog`, `/work` still load (new tokens applied, not broken).

## 12. File change summary
**New:** `components/public/landing/{Nav,Hero,Stats,LogoStrip,Services,Process,CaseStudies,Team,Testimonials,Pricing,TechStack,CTA,FAQ,Footer,RevealController}.tsx`;
`supabase/migrations/009_redesign_schema.sql` + `010_redesign_seed.sql`;
`app/admin/(cms)/{services,stats,pricing,tech-stack,faq}/...`.
**Modified:** `app/globals.css`, `app/layout.tsx`, `app/(public)/page.tsx`,
`lib/supabase/types.ts` (new tables + `Service` shape change), `lib/supabase/queries.ts`,
`lib/actions/content.ts`, `components/admin/AdminSidebar.tsx`, admin `testimonials` + `work` forms.
**Removed:** grain overlay; `site_settings.services` JSON dependency in `getServices()`.
