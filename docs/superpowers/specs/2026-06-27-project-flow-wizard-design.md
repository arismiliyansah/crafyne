# Spec — Interactive "Start your project" wizard (`ProjectFlow`)

- **Date:** 2026-06-27
- **Status:** Draft for review
- **Topic:** Replace the two flat inquiry forms with one animated, multi-step ordering flow tied to the pricing packages.

## 1. Goal

Turn the contact/inquiry experience into a single, highly interactive multi-step wizard that feels like "ordering" a package. A prospective client picks a package, configures scope, shares details + design references, reviews, and submits. No online payment — submission creates an inquiry (quote request) exactly like today.

## 2. Locked decisions

1. **Form factor:** 4-step wizard with a progress indicator.
2. **Package tie-in:** pricing CTAs deep-link into the wizard with the package pre-selected.
3. **Scope:** unify the two existing forms into one `ProjectFlow` component used on `/contact` **and** the homepage CTA section. Delete `InquiryForm.tsx` and `ContactForm.tsx`.
4. **Payment:** none. Submission → `project_inquiries` row + Resend email (existing path).
5. **Animation:** add the `motion` library (Framer Motion, React 19-compatible). Very interactive throughout. Respect `prefers-reduced-motion`.
6. **Design references:** links-only. A clearly-noticed, optional field where the client can add reference URLs (Figma, sites they like, competitors) + notes. Stored as text.

## 3. Entry points

| Trigger | Behaviour |
|---|---|
| Pricing tier CTA (Sprint/Build/Tend) | → `/contact?package=<slug>` — wizard opens with that package selected |
| Care strip link | → `/contact?care=1` — wizard opens with Care toggled on |
| Nav "Book a call" / Hero primary CTA | → `/contact` — general, nothing pre-selected |
| Homepage CTA section "Start the conversation" | scrolls to the embedded `ProjectFlow` (general) |

`/contact` is a **server component**; it reads `searchParams` (`package`, `care`) and passes them as props (`initialPackage`, `initialCare`) to `ProjectFlow`. No `useSearchParams` / Suspense boundary needed.

## 4. Steps

Progress bar shows 4 steps with labels; completed steps animate to a check. `Next` is disabled until the current step is valid; `Back` always available (except step 1).

**Step 1 — Package**
- One card per `pricing_tiers` row (name, tag, price) + a "Not sure yet" card. Single-select.
- Care & hosting toggle (only if Care is enabled in settings).
- Pre-selected from `initialPackage` / `initialCare`.
- Valid when a card is chosen (a package or "Not sure yet").

**Step 2 — Scope**
- Service chips (multi-select): Web, Mobile, AI / ML, Product Design, Enterprise, Other.
- Budget select (optional; placeholder hints the picked package's price).
- Timeline select (optional).
- Always valid (all optional) — keeps momentum.

**Step 3 — Details**
- Name (required), Email (required + format), Company (optional), Role (optional).
- Project description textarea (required).
- **Design references** (optional): repeatable list of URL inputs (add/remove rows) + a notes line, introduced by a friendly notice: *"Got designs or inspiration? Drop links — Figma, sites you like, competitors. It helps us calibrate fast."* Invalid-looking URLs are flagged but never block submit.
- "How did you find us?" (optional).
- Valid when name + email (valid) + description are filled.

**Step 4 — Review & send**
- Read-only summary grouped by step (package + care, scope, details, N references). Each group has an "Edit" affordance that jumps back to that step.
- Hidden honeypot field (`website`).
- Submit → loading → success state (animated). On server error, show inline message and stay on review.

## 5. Data model

Migration `015_inquiry_order_fields.sql` adds to `project_inquiries`:

- `package text` — selected package name, or null for "Not sure yet" / general.
- `wants_care boolean not null default false`.
- `design_references text` — newline-separated URLs + notes block, or null.

`submitInquiry` (server action) is extended:
- Reads `package`, `wants_care` (`'true'`/`'on'` → boolean), `design_references`.
- Keeps the honeypot drop and existing required validation (name, email, message). `package` is optional.
- Inserts the three new columns.

`lib/supabase/types.ts` — `ProjectInquiry` gains `package: string | null`, `wants_care: boolean`, `design_references: string | null`.

**Field mapping onto existing columns** (so the current required-field checks still hold):
- `project_type` ← Step 2 services joined with `, `, falling back to `"General inquiry"` when none picked (mirrors the old `ContactForm`). Always non-empty.
- `budget_range` ← Step 2 budget; `timeline` ← Step 2 timeline.
- `message` ← Step 3 description (required). Role and "how did you find us" are appended to `message` (`Role: …`, `Found us via: …`) since they have no dedicated columns.
- `package` slug rule: the URL/param slug is the tier `name` lowercased (`Sprint` → `sprint`); pre-select matches a tier whose lowercased name equals the param. Stored value is the tier's display name (or null for "Not sure yet").
- `design_references` ← reference URLs joined by newline; if notes are present, appended after a blank line as `Notes: …`.

## 6. Admin + email

- `/admin/inquiries` list: show package as a small badge (and a care indicator).
- `/admin/inquiries/[id]` detail: show package, care (yes/no), and design references rendered as clickable links.
- Resend email: add rows for Package, Care, and Design references.

## 7. Animation spec (`motion`)

- **Step transitions:** `<AnimatePresence mode="wait">` around the active step. Enter from +x (slide) + fade + slight y; exit to −x. Direction flips for Back. Spring transition.
- **Progress:** animated fill (`motion` width); step dots animate scale + SVG check `pathLength` draw on completion.
- **Package cards:** `whileHover` lift, `whileTap` scale; selected state animates a ring + check draw; subtle `layout` emphasis on the selected card.
- **Chips:** `whileTap` pop; background/color transition on toggle.
- **Reference rows:** animate in/out on add/remove (`AnimatePresence`).
- **Buttons:** arrow nudges on hover; submit shows a spinner.
- **Success:** checkmark SVG `pathLength` draw, then staggered reveal of the confirmation copy.
- **Reduced motion:** `useReducedMotion()` → drop transforms/spring, keep instant opacity changes only.

## 8. Components & files

**New — `components/public/project-flow/`**
- `ProjectFlow.tsx` — client controller: holds form state, current step + direction, validation gating, submit. Receives `tiers`, `careEnabled`, `initialPackage`, `initialCare`.
- `Progress.tsx` — animated step indicator.
- `StepPackage.tsx`, `StepScope.tsx`, `StepDetails.tsx`, `StepReview.tsx` — step views; each takes `value` + `onChange` (and `tiers`/`careEnabled` where needed).
- `types.ts` — `FormState`, `StepProps`, package/option constants.

**Changed**
- `app/(public)/contact/page.tsx` — render `ProjectFlow`; read `searchParams`; fetch `pricing_tiers` + settings; compute `careEnabled`.
- `app/(public)/page.tsx` — pass `tiers` to `CTA`.
- `components/public/landing/CTA.tsx` — embed `ProjectFlow` (general); accept `tiers`.
- `components/public/landing/Pricing.tsx` — tier CTA `href` → `/contact?package=<slug>`; Care strip link → `/contact?care=1`.
- `components/public/landing/Hero.tsx`, `Nav.tsx` — ensure primary/"Book a call" CTAs point to `/contact`.
- `lib/actions/inquiries.ts` — extend `submitInquiry`.
- `app/admin/(cms)/inquiries/page.tsx` + `[id]/page.tsx` — show new fields.
- `lib/supabase/types.ts` — extend `ProjectInquiry`.
- `app/globals.css` — `project-flow` styles (reuse `field`, `chip`, `btn` tokens).
- `package.json` — add `motion`.

**Deleted**
- `components/public/InquiryForm.tsx`
- `components/public/landing/ContactForm.tsx`

**Migration**
- `supabase/migrations/015_inquiry_order_fields.sql`

## 9. Accessibility

- Steps as a labelled group; progress conveys current/total with `aria-current`.
- On step change, move focus to the step heading or first field.
- All controls keyboard-operable; chips/cards are real buttons with `aria-pressed`/`aria-selected`.
- Honeypot stays visually hidden + `aria-hidden`.
- Honour `prefers-reduced-motion`.

## 10. Verification

- `tsc --noEmit` clean; `npm run build` succeeds.
- Runtime smoke: walk all 4 steps, test Back/Next gating, add/remove reference rows, submit; confirm a `project_inquiries` row with `package`/`wants_care`/`design_references`; confirm pre-select via `/contact?package=build` and `/contact?care=1`.
- No automated test runner exists in this project; verification is build + manual smoke.

## 11. Risks / notes

- **`motion` compatibility** with this Next 16 / React 19 build is verified as the first implementation step. If it cannot install/run cleanly, fall back to the CSS-only animation approach (same step structure) rather than blocking.
- Per `AGENTS.md`, consult `node_modules/next/dist/docs/` before using any Next API that may differ from older versions (e.g. `searchParams` shape on server pages).
- Deploy is auto-pull **without** rebuild → after merge: run migration 015, then `npm run build` + restart on the server.

## 12. Out of scope

Online payment/checkout, file uploads, calendar/scheduling integration, live chat, multi-language. These can be separate specs later.
