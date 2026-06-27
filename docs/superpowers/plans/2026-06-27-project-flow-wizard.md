# ProjectFlow Wizard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two flat inquiry forms with one animated, 4-step "Start your project" wizard tied to the pricing packages.

**Architecture:** A client component `ProjectFlow` (in `components/public/project-flow/`) holds all form state and renders one of four step views inside a `motion` `AnimatePresence` transition. It is embedded on both `/contact` (with package/care pre-selected from `searchParams`) and the homepage CTA section. Submission reuses the existing `submitInquiry` server action, extended with three new `project_inquiries` columns. The component renders its own cream "card" surface so it looks identical on the cream `/contact` page and the navy homepage panel.

**Tech Stack:** Next.js 16 (App Router, async `searchParams`), React 19, TypeScript, Supabase, Resend, and the `motion` animation library (Framer Motion successor).

**Verification model:** No unit-test runner exists in this repo. Each task ends with `npx tsc --noEmit`; integration tasks also run `npm run build`; the final task does a runtime smoke. Commit after each task.

---

## File structure

**New — `components/public/project-flow/`**
- `types.ts` — `FormState`, option constants, helpers.
- `ProjectFlow.tsx` — controller (state, validation gating, motion step transitions, submit, success).
- `Progress.tsx` — animated step indicator.
- `StepPackage.tsx` / `StepScope.tsx` / `StepDetails.tsx` / `StepReview.tsx` — step views.

**Modified**
- `lib/supabase/types.ts` — extend `ProjectInquiry`.
- `lib/actions/inquiries.ts` — extend `submitInquiry` (read + insert + email rows).
- `app/(public)/contact/page.tsx` — render `ProjectFlow`, read `searchParams`, fetch tiers.
- `app/(public)/page.tsx` — pass `tiers` to `CTA`.
- `components/public/landing/CTA.tsx` — embed `ProjectFlow`.
- `components/public/landing/Pricing.tsx` — tier CTA hrefs + Care link.
- `components/public/landing/Hero.tsx`, `components/public/landing/Nav.tsx` — CTA targets → `/contact`.
- `app/admin/(cms)/inquiries/page.tsx` + `app/admin/(cms)/inquiries/[id]/page.tsx` — show new fields.
- `app/globals.css` — `pf` styles + `.btn--ghost`.
- `package.json` — add `motion`.

**Deleted**
- `components/public/InquiryForm.tsx`
- `components/public/landing/ContactForm.tsx`

**Migration**
- `supabase/migrations/015_inquiry_order_fields.sql`

---

## Task 1: Install and verify the `motion` library

**Files:** `package.json`, `package-lock.json`

- [ ] **Step 1: Install**

Run: `npm install motion`

- [ ] **Step 2: Verify it resolves and is React-19 compatible**

Run: `npm ls motion`
Expected: prints a single `motion@<version>` with no peer-dependency errors.

- [ ] **Step 3: Smoke-build a trivial import**

Add a temporary file `app/_motion_check.ts`:

```ts
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
export const _check = { motion, AnimatePresence, useReducedMotion }
```

Run: `npx tsc --noEmit`
Expected: exit 0 (imports resolve). Then delete the file: `rm app/_motion_check.ts`

> If install or typecheck fails, STOP and fall back to the CSS-only animation approach: skip `motion` imports, use CSS classes + `transition`/`@keyframes` for the same effects, and drop `AnimatePresence` in favor of a CSS-transitioned active step. The rest of the plan is unchanged.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "Add motion library for the project wizard"
```

---

## Task 2: Data model — migration + types

**Files:**
- Create: `supabase/migrations/015_inquiry_order_fields.sql`
- Modify: `lib/supabase/types.ts` (the `ProjectInquiry` interface)

- [ ] **Step 1: Write the migration**

```sql
-- ============================================================
-- 015 — Inquiry "ordering" fields for the ProjectFlow wizard
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

alter table project_inquiries
  add column if not exists package text,
  add column if not exists wants_care boolean not null default false,
  add column if not exists design_references text;
```

- [ ] **Step 2: Extend the `ProjectInquiry` type**

In `lib/supabase/types.ts`, find the `ProjectInquiry` interface and add the three fields (place them after `message`):

```ts
  message: string
  package: string | null
  wants_care: boolean
  design_references: string | null
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/015_inquiry_order_fields.sql lib/supabase/types.ts
git commit -m "Add package/wants_care/design_references to inquiries"
```

---

## Task 3: Extend the `submitInquiry` server action

**Files:** Modify `lib/actions/inquiries.ts`

- [ ] **Step 1: Read the new fields**

After the existing `const message = (...)` line in `submitInquiry`, add:

```ts
  const pkg               = (formData.get('package') as string ?? '').trim()
  const wants_care        = (formData.get('wants_care') as string ?? '') === 'true'
  const design_references = (formData.get('design_references') as string ?? '').trim()
```

- [ ] **Step 2: Include them in the insert**

Change the `.insert({ ... })` object to add the three columns:

```ts
  const { error } = await supabase.from('project_inquiries').insert({
    name,
    email,
    company:      company      || null,
    project_type,
    budget_range: budget_range || null,
    timeline:     timeline     || null,
    message,
    package:           pkg               || null,
    wants_care,
    design_references: design_references || null,
  })
```

- [ ] **Step 3: Add them to the Resend email**

In the email `html`, add these rows to the `<table>` (after the Timeline row):

```html
            <tr><td style="padding:8px 0;border-top:1px solid #eee;font-size:13px;color:#888">Package</td><td style="padding:8px 0;border-top:1px solid #eee;font-size:14px">${pkg || '—'}${wants_care ? ' + Care & hosting' : ''}</td></tr>
```

And after the Message block, add a references block:

```html
          ${design_references ? `<div style="background:#f7f5f0;border-radius:6px;padding:16px 20px;margin-bottom:24px"><p style="font-size:13px;color:#888;margin:0 0 8px">Design references</p><p style="font-size:14px;line-height:1.7;margin:0">${design_references.replace(/\n/g, '<br/>')}</p></div>` : ''}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add lib/actions/inquiries.ts
git commit -m "Persist package/care/references on inquiry submit"
```

---

## Task 4: Wizard types and constants

**Files:** Create `components/public/project-flow/types.ts`

- [ ] **Step 1: Write the file**

```ts
export type StepId = 'package' | 'scope' | 'details' | 'review'

export interface FormState {
  package: string          // tier display name, '' = none, NOT_SURE = explicit "unsure"
  wantsCare: boolean
  services: string[]
  budget: string
  timeline: string
  name: string
  email: string
  company: string
  role: string
  description: string
  references: string[]     // URL strings; always at least one (possibly empty) row
  referenceNotes: string
  how: string
  website: string          // honeypot
}

export interface StepProps {
  value: FormState
  onChange: (patch: Partial<FormState>) => void
}

export const NOT_SURE = 'Not sure yet'

export const SERVICES  = ['Web', 'Mobile', 'AI / ML', 'Product Design', 'Enterprise', 'Other']
export const BUDGETS   = ['Under $25k', '$25k–$75k', '$75k–$200k', '$200k+', 'Not sure yet']
export const TIMELINES = ['ASAP', 'Within a month', 'Within a quarter', 'Just exploring']

export const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())

export const emptyForm = (initialPackage = '', initialCare = false): FormState => ({
  package: initialPackage,
  wantsCare: initialCare,
  services: [],
  budget: '',
  timeline: '',
  name: '',
  email: '',
  company: '',
  role: '',
  description: '',
  references: [''],
  referenceNotes: '',
  how: '',
  website: '',
})
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/public/project-flow/types.ts
git commit -m "Add ProjectFlow form types and constants"
```

---

## Task 5: Progress indicator

**Files:** Create `components/public/project-flow/Progress.tsx`

- [ ] **Step 1: Write the file**

```tsx
'use client'

import { motion } from 'motion/react'

export default function Progress({ steps, current, reduce }: { steps: string[]; current: number; reduce: boolean }) {
  const pct = steps.length > 1 ? (current / (steps.length - 1)) * 100 : 0
  return (
    <div className="pf__progress">
      <div className="pf__track" aria-hidden="true">
        <motion.div
          className="pf__fill"
          animate={{ width: `${pct}%` }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 30 }}
        />
      </div>
      <ol className="pf__steps">
        {steps.map((label, i) => {
          const done = i < current
          const active = i === current
          return (
            <li key={label} className={'pf__step' + (active ? ' is-active' : '') + (done ? ' is-done' : '')}>
              <span className="pf__dot" aria-current={active ? 'step' : undefined}>
                {done ? (
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <motion.path
                      d="M20 6 9 17 4 12" fill="none" stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"
                      initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }}
                    />
                  </svg>
                ) : i + 1}
              </span>
              <span className="pf__stepLabel">{label}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/public/project-flow/Progress.tsx
git commit -m "Add animated ProjectFlow progress indicator"
```

---

## Task 6: Step 1 — Package

**Files:** Create `components/public/project-flow/StepPackage.tsx`

- [ ] **Step 1: Write the file**

```tsx
'use client'

import { motion } from 'motion/react'
import type { PricingTier } from '@/lib/supabase/types'
import type { StepProps } from './types'
import { NOT_SURE } from './types'

export default function StepPackage({ tiers, careEnabled, value, onChange }: StepProps & { tiers: PricingTier[]; careEnabled: boolean }) {
  const options = [
    ...tiers.map(t => ({ name: t.name, tag: t.tag ?? '', price: t.price, unit: t.unit ?? '' })),
    { name: NOT_SURE, tag: 'Tell us and we’ll guide you', price: '', unit: '' },
  ]
  return (
    <div className="pf__body">
      <div className="pf__head"><span className="eyebrow pf__eye">/ step 01</span><h2 className="pf__title">Pick a starting point</h2></div>
      <div className="pf__pkgs">
        {options.map(o => {
          const on = value.package === o.name
          return (
            <motion.button
              type="button" key={o.name} aria-pressed={on}
              className={'pf__pkg' + (on ? ' is-on' : '')}
              onClick={() => onChange({ package: o.name })}
              whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
            >
              <span className="pf__pkgName">{o.name}</span>
              <span className="pf__pkgTag">{o.tag}</span>
              {o.price && (
                <span className="pf__pkgPrice mono">
                  {/^from\s+/i.test(o.price) && <em className="pf__pkgFrom">from </em>}
                  {'$'}{o.price.replace(/^from\s+/i, '')}<i>{o.unit}</i>
                </span>
              )}
              {on && (
                <motion.span className="pf__pkgCheck" aria-hidden="true"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>✓</motion.span>
              )}
            </motion.button>
          )
        })}
      </div>
      {careEnabled && (
        <button type="button" aria-pressed={value.wantsCare}
          className={'pf__care' + (value.wantsCare ? ' is-on' : '')}
          onClick={() => onChange({ wantsCare: !value.wantsCare })}>
          <span className="pf__careBox" aria-hidden="true">{value.wantsCare ? '✓' : ''}</span>
          <span>Add <strong>Care &amp; hosting</strong> — keep it secure &amp; online after launch</span>
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/public/project-flow/StepPackage.tsx
git commit -m "Add ProjectFlow package step"
```

---

## Task 7: Step 2 — Scope

**Files:** Create `components/public/project-flow/StepScope.tsx`

- [ ] **Step 1: Write the file**

```tsx
'use client'

import { motion } from 'motion/react'
import type { StepProps } from './types'
import { SERVICES, BUDGETS, TIMELINES } from './types'

export default function StepScope({ value, onChange }: StepProps) {
  const toggle = (s: string) =>
    onChange({ services: value.services.includes(s) ? value.services.filter(x => x !== s) : [...value.services, s] })
  return (
    <div className="pf__body">
      <div className="pf__head"><span className="eyebrow pf__eye">/ step 02</span><h2 className="pf__title">What do you need?</h2></div>
      <div className="field">
        <label className="field__label">Services (pick any)</label>
        <div className="field__chips">
          {SERVICES.map(s => (
            <motion.button type="button" key={s} whileTap={{ scale: 0.92 }} aria-pressed={value.services.includes(s)}
              className={'field__chip' + (value.services.includes(s) ? ' is-on' : '')} onClick={() => toggle(s)}>{s}</motion.button>
          ))}
        </div>
      </div>
      <div className="pf__row2">
        <div className="field">
          <label className="field__label">Budget</label>
          <select value={value.budget} onChange={e => onChange({ budget: e.target.value })}>
            <option value="">Pick a range</option>
            {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field__label">Timeline</label>
          <select value={value.timeline} onChange={e => onChange({ timeline: e.target.value })}>
            <option value="">When to start?</option>
            {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/public/project-flow/StepScope.tsx
git commit -m "Add ProjectFlow scope step"
```

---

## Task 8: Step 3 — Details (with design references)

**Files:** Create `components/public/project-flow/StepDetails.tsx`

- [ ] **Step 1: Write the file**

```tsx
'use client'

import { motion, AnimatePresence } from 'motion/react'
import type { StepProps } from './types'

export default function StepDetails({ value, onChange }: StepProps) {
  const setRef = (i: number, v: string) => onChange({ references: value.references.map((r, j) => (j === i ? v : r)) })
  const addRef = () => onChange({ references: [...value.references, ''] })
  const removeRef = (i: number) => {
    const next = value.references.filter((_, j) => j !== i)
    onChange({ references: next.length ? next : [''] })
  }
  return (
    <div className="pf__body">
      <div className="pf__head"><span className="eyebrow pf__eye">/ step 03</span><h2 className="pf__title">About you &amp; the project</h2></div>
      <div className="pf__row2">
        <div className="field"><label className="field__label">Your name *</label><input value={value.name} onChange={e => onChange({ name: e.target.value })} placeholder="Jane Doe" /></div>
        <div className="field"><label className="field__label">Email *</label><input type="email" value={value.email} onChange={e => onChange({ email: e.target.value })} placeholder="jane@company.com" /></div>
      </div>
      <div className="pf__row2">
        <div className="field"><label className="field__label">Company</label><input value={value.company} onChange={e => onChange({ company: e.target.value })} placeholder="Acme Inc." /></div>
        <div className="field"><label className="field__label">Your role</label><input value={value.role} onChange={e => onChange({ role: e.target.value })} placeholder="Head of Product" /></div>
      </div>
      <div className="field"><label className="field__label">Tell us about it *</label><textarea value={value.description} onChange={e => onChange({ description: e.target.value })} placeholder="What are you building? Who's it for?" /></div>

      <div className="pf__refs">
        <div className="pf__notice">
          <span className="pf__noticeIcon" aria-hidden="true">✦</span>
          <p><strong>Got designs or inspiration?</strong> Drop links — Figma, sites you like, competitors. It helps us calibrate fast. <span className="pf__noticeOpt">(optional)</span></p>
        </div>
        <AnimatePresence initial={false}>
          {value.references.map((r, i) => (
            <motion.div key={i} className="pf__refRow"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <input type="url" value={r} onChange={e => setRef(i, e.target.value)} placeholder="https://figma.com/… or a site you like" />
              {value.references.length > 1 && (
                <button type="button" className="pf__refDel" onClick={() => removeRef(i)} aria-label="Remove link">×</button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <button type="button" className="pf__refAdd" onClick={addRef}>+ Add another link</button>
        <div className="field"><label className="field__label">Reference notes (optional)</label><input value={value.referenceNotes} onChange={e => onChange({ referenceNotes: e.target.value })} placeholder="What do you like about them?" /></div>
      </div>

      <div className="field"><label className="field__label">How did you find us? (optional)</label><input value={value.how} onChange={e => onChange({ how: e.target.value })} placeholder="A friend, Google, a talk…" /></div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/public/project-flow/StepDetails.tsx
git commit -m "Add ProjectFlow details step with design references"
```

---

## Task 9: Step 4 — Review

**Files:** Create `components/public/project-flow/StepReview.tsx`

- [ ] **Step 1: Write the file**

```tsx
'use client'

import type { FormState } from './types'
import { NOT_SURE } from './types'

function Row({ label, children, onEdit }: { label: string; children: React.ReactNode; onEdit: () => void }) {
  return (
    <div className="pf__reviewRow">
      <dt>{label}</dt>
      <dd>{children}</dd>
      <button type="button" className="pf__edit" onClick={onEdit}>Edit</button>
    </div>
  )
}

export default function StepReview({ value, onEdit }: { value: FormState; onEdit: (stepIndex: number) => void }) {
  const refs = value.references.map(r => r.trim()).filter(Boolean)
  const pkg = !value.package || value.package === NOT_SURE ? 'Not sure yet' : value.package
  return (
    <div className="pf__body">
      <div className="pf__head"><span className="eyebrow pf__eye">/ step 04</span><h2 className="pf__title">Quick review</h2></div>
      <dl className="pf__review">
        <Row label="Package" onEdit={() => onEdit(0)}>{pkg}{value.wantsCare ? ' + Care & hosting' : ''}</Row>
        <Row label="Scope" onEdit={() => onEdit(1)}>{[value.services.join(', '), value.budget, value.timeline].filter(Boolean).join(' · ') || '—'}</Row>
        <Row label="You" onEdit={() => onEdit(2)}>{[value.name, value.email, value.company].filter(Boolean).join(' · ') || '—'}</Row>
        <Row label="Project" onEdit={() => onEdit(2)}>{value.description || '—'}</Row>
        {refs.length > 0 && <Row label="References" onEdit={() => onEdit(2)}>{refs.length} link{refs.length > 1 ? 's' : ''}</Row>}
      </dl>
      <p className="pf__reviewNote">We never share your details. You’ll get one human reply within a working day — no sequence.</p>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/public/project-flow/StepReview.tsx
git commit -m "Add ProjectFlow review step"
```

---

## Task 10: Controller — `ProjectFlow.tsx`

**Files:** Create `components/public/project-flow/ProjectFlow.tsx`

- [ ] **Step 1: Write the file**

```tsx
'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import type { PricingTier } from '@/lib/supabase/types'
import { submitInquiry } from '@/lib/actions/inquiries'
import { type FormState, type StepId, emptyForm, isValidEmail, NOT_SURE } from './types'
import Progress from './Progress'
import StepPackage from './StepPackage'
import StepScope from './StepScope'
import StepDetails from './StepDetails'
import StepReview from './StepReview'

const STEPS: { id: StepId; label: string }[] = [
  { id: 'package', label: 'Package' },
  { id: 'scope', label: 'Scope' },
  { id: 'details', label: 'Details' },
  { id: 'review', label: 'Review' },
]

function SuccessView({ name, reduce }: { name: string; reduce: boolean }) {
  return (
    <div className="pf pf--done">
      <motion.div className="pf__check"
        initial={reduce ? false : { scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
        <svg viewBox="0 0 24 24" width="32" height="32">
          <motion.path d="M20 6 9 17 4 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.1 }} />
        </svg>
      </motion.div>
      <h2 className="pf__title">Got it{name ? `, ${name}` : ''}.</h2>
      <p className="pf__doneSub">A real person replies within one working day. While you wait, see our <a href="/work">recent work</a>.</p>
    </div>
  )
}

export default function ProjectFlow({
  tiers, careEnabled, initialPackage = '', initialCare = false,
}: {
  tiers: PricingTier[]
  careEnabled: boolean
  initialPackage?: string
  initialCare?: boolean
}) {
  const reduce = !!useReducedMotion()
  const [form, setForm] = useState<FormState>(() => emptyForm(initialPackage, initialCare))
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  const patch = (p: Partial<FormState>) => setForm(f => ({ ...f, ...p }))

  const stepValid = (i: number): boolean => {
    const s = STEPS[i].id
    if (s === 'package') return form.package !== ''
    if (s === 'details') return form.name.trim() !== '' && isValidEmail(form.email) && form.description.trim() !== ''
    return true
  }

  const go = (next: number) => {
    setDir(next > index ? 1 : -1)
    setError(null)
    setIndex(Math.max(0, Math.min(STEPS.length - 1, next)))
  }

  function onSubmit() {
    setError(null)
    const fd = new FormData()
    fd.set('name', form.name)
    fd.set('email', form.email)
    fd.set('company', form.company)
    fd.set('project_type', form.services.join(', ') || 'General inquiry')
    fd.set('budget_range', form.budget)
    fd.set('timeline', form.timeline)
    const message = [form.description, form.role && `Role: ${form.role}`, form.how && `Found us via: ${form.how}`]
      .filter(Boolean).join('\n\n')
    fd.set('message', message)
    fd.set('package', form.package === NOT_SURE ? '' : form.package)
    fd.set('wants_care', form.wantsCare ? 'true' : '')
    const refs = form.references.map(r => r.trim()).filter(Boolean).join('\n')
    fd.set('design_references', refs + (form.referenceNotes.trim() ? `\n\nNotes: ${form.referenceNotes.trim()}` : ''))
    fd.set('website', form.website)
    startTransition(async () => {
      const res = await submitInquiry(fd)
      if (res.error) setError(res.error)
      else setSubmitted(true)
    })
  }

  if (submitted) return <SuccessView name={form.name} reduce={reduce} />

  const isReview = STEPS[index].id === 'review'
  const variants = {
    enter: (d: number) => ({ x: reduce ? 0 : d * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: reduce ? 0 : d * -40, opacity: 0 }),
  }

  return (
    <div className="pf">
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
        value={form.website} onChange={e => patch({ website: e.target.value })}
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />

      <Progress steps={STEPS.map(s => s.label)} current={index} reduce={reduce} />

      <div className="pf__stage">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={STEPS[index].id} custom={dir} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 30 }}>
            {STEPS[index].id === 'package' && <StepPackage tiers={tiers} careEnabled={careEnabled} value={form} onChange={patch} />}
            {STEPS[index].id === 'scope' && <StepScope value={form} onChange={patch} />}
            {STEPS[index].id === 'details' && <StepDetails value={form} onChange={patch} />}
            {STEPS[index].id === 'review' && <StepReview value={form} onEdit={go} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {error && <p className="pf__error">{error}</p>}

      <div className="pf__nav">
        {index > 0 ? <button type="button" className="btn btn--ghost" onClick={() => go(index - 1)}>Back</button> : <span />}
        {isReview ? (
          <button type="button" className="btn btn--ink" disabled={isPending} onClick={onSubmit}>
            {isPending ? 'Sending…' : 'Send to Crafyne'}
          </button>
        ) : (
          <button type="button" className="btn btn--ink" disabled={!stepValid(index)} onClick={() => go(index + 1)}>Next</button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/public/project-flow/ProjectFlow.tsx
git commit -m "Add ProjectFlow controller with motion step transitions"
```

---

## Task 11: Styles

**Files:** Modify `app/globals.css`

- [ ] **Step 1: Add a `.btn--ghost` variant**

Find the existing `.btn--ink` rule and add directly after it:

```css
.btn--ghost { background: transparent; color: var(--ink); border: 1px solid var(--hair); }
.btn--ghost:hover { background: rgba(15,10,7,0.04); }
.btn:disabled { opacity: 0.4; pointer-events: none; }
```

- [ ] **Step 2: Append the ProjectFlow block at the end of the file**

```css
/* ===== PROJECT FLOW (wizard) ===== */
.pf { background: var(--cream); color: var(--ink); border: 1px solid var(--hair); border-radius: 24px; padding: clamp(22px, 4vw, 40px); }
.pf__progress { margin-bottom: 28px; }
.pf__track { height: 4px; border-radius: 999px; background: rgba(15,10,7,0.10); overflow: hidden; }
.pf__fill { height: 100%; background: var(--crimson); border-radius: 999px; }
.pf__steps { list-style: none; display: flex; justify-content: space-between; gap: 8px; padding: 14px 0 0; margin: 0; }
.pf__step { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--mute); }
.pf__dot { width: 24px; height: 24px; border-radius: 999px; display: grid; place-items: center; background: rgba(15,10,7,0.08); color: var(--mute); font-size: 12px; font-weight: 600; flex-shrink: 0; }
.pf__step.is-active .pf__dot { background: var(--crimson); color: var(--cream); }
.pf__step.is-done .pf__dot { background: var(--ink); color: var(--cream); }
.pf__step.is-active { color: var(--ink); font-weight: 600; }
.pf__stepLabel { white-space: nowrap; }
.pf__stage { position: relative; overflow: hidden; }
.pf__body { display: flex; flex-direction: column; gap: 18px; }
.pf__head { margin-bottom: 4px; }
.pf__eye { color: var(--crimson); display: block; margin-bottom: 6px; }
.pf__title { font-family: var(--font-display); font-size: clamp(22px, 3vw, 30px); font-weight: 700; letter-spacing: -0.02em; margin: 0; }
.pf__pkgs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.pf__pkg { text-align: left; position: relative; display: flex; flex-direction: column; gap: 4px; padding: 18px; border-radius: 16px; border: 1px solid var(--hair); background: var(--paper); cursor: pointer; }
.pf__pkg.is-on { border-color: var(--crimson); box-shadow: 0 0 0 2px var(--crimson) inset; }
.pf__pkgName { font-family: var(--font-display); font-size: 18px; font-weight: 700; }
.pf__pkgTag { font-size: 12px; color: var(--mute); }
.pf__pkgPrice { font-size: 13px; margin-top: 6px; }
.pf__pkgPrice i { font-style: normal; opacity: 0.6; margin-left: 2px; }
.pf__pkgFrom { font-style: normal; opacity: 0.6; }
.pf__pkgCheck { position: absolute; top: 12px; right: 12px; width: 22px; height: 22px; border-radius: 999px; background: var(--crimson); color: var(--cream); display: grid; place-items: center; font-size: 13px; }
.pf__care { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 14px; border: 1px dashed var(--hair); background: transparent; cursor: pointer; text-align: left; font-size: 14px; }
.pf__care.is-on { border-style: solid; border-color: var(--crimson); }
.pf__careBox { width: 22px; height: 22px; border-radius: 6px; border: 1px solid var(--hair); display: grid; place-items: center; flex-shrink: 0; color: var(--crimson); font-size: 13px; }
.pf__care.is-on .pf__careBox { background: var(--crimson); color: var(--cream); border-color: var(--crimson); }
.pf__row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.pf__refs { border-top: 1px solid var(--hair); padding-top: 18px; display: flex; flex-direction: column; gap: 12px; }
.pf__notice { display: flex; gap: 10px; align-items: flex-start; background: var(--peach); color: var(--ink); border-radius: 12px; padding: 12px 14px; font-size: 14px; line-height: 1.5; }
.pf__notice p { margin: 0; }
.pf__noticeIcon { color: var(--crimson); font-size: 16px; line-height: 1.4; }
.pf__noticeOpt { opacity: 0.6; }
.pf__refRow { display: flex; gap: 8px; align-items: center; overflow: hidden; }
.pf__refRow input { flex: 1; }
.pf__refDel { width: 36px; height: 36px; flex-shrink: 0; border-radius: 10px; border: 1px solid var(--hair); background: transparent; cursor: pointer; font-size: 18px; line-height: 1; color: var(--mute); }
.pf__refAdd { align-self: flex-start; background: transparent; border: none; color: var(--crimson); font-weight: 600; font-size: 14px; cursor: pointer; padding: 0; }
.pf__review { display: flex; flex-direction: column; gap: 0; margin: 0; border: 1px solid var(--hair); border-radius: 14px; overflow: hidden; }
.pf__reviewRow { display: grid; grid-template-columns: 110px 1fr auto; gap: 12px; align-items: baseline; padding: 14px 16px; border-bottom: 1px solid var(--hair); }
.pf__reviewRow:last-child { border-bottom: none; }
.pf__reviewRow dt { font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--mute); margin: 0; }
.pf__reviewRow dd { margin: 0; font-size: 14px; line-height: 1.5; }
.pf__edit { background: transparent; border: none; color: var(--crimson); font-size: 13px; font-weight: 600; cursor: pointer; padding: 0; }
.pf__reviewNote { font-size: 13px; color: var(--mute); margin: 0; }
.pf__error { color: var(--crimson); font-size: 14px; margin: 12px 0 0; }
.pf__nav { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 24px; }
.pf--done { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; padding: clamp(28px, 6vw, 56px) clamp(22px, 4vw, 40px); }
.pf__check { width: 64px; height: 64px; border-radius: 999px; background: var(--crimson); color: var(--cream); display: grid; place-items: center; }
.pf__doneSub { font-size: 16px; color: var(--ink-soft); margin: 0; max-width: 440px; }
.pf__doneSub a { color: var(--crimson); font-weight: 600; }
@media (max-width: 640px) {
  .pf__pkgs { grid-template-columns: 1fr; }
  .pf__row2 { grid-template-columns: 1fr; }
  .pf__stepLabel { display: none; }
}
```

- [ ] **Step 3: Typecheck (CSS has no types; just confirm nothing else broke)**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "Add ProjectFlow wizard styles"
```

---

## Task 12: Wire the `/contact` page

**Files:** Modify `app/(public)/contact/page.tsx`

- [ ] **Step 1: Update imports**

Replace the `ContactForm` import line with:

```tsx
import { getSettings, getPricingTiers } from '@/lib/supabase/queries'
import ProjectFlow from '@/components/public/project-flow/ProjectFlow'
```

(remove the old `import ContactForm from '@/components/public/landing/ContactForm'` and the existing single `getSettings` import if duplicated.)

- [ ] **Step 2: Read searchParams + tiers in the component signature/body**

Change the function signature and top of the body to:

```tsx
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ package?: string; care?: string }> }) {
  const [settings, tiers] = await Promise.all([getSettings(), getPricingTiers()])
  const sp = await searchParams
  const email = settings.agency_email ?? 'contact@crafyne.com'
  const careEnabled = Boolean((settings.pricing_care_title ?? '').trim() && (settings.pricing_care_price ?? '').trim())
  const initialPackage = sp.package ? (tiers.find(t => t.name.toLowerCase() === sp.package!.toLowerCase())?.name ?? '') : ''
  const initialCare = sp.care === '1' || sp.care === 'true'
```

- [ ] **Step 3: Replace the form usage**

Replace `<ContactForm />` with:

```tsx
            <ProjectFlow tiers={tiers} careEnabled={careEnabled} initialPackage={initialPackage} initialCare={initialCare} />
```

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit` then `npm run build`
Expected: both exit 0. (`searchParams` is awaited per Next 16 async dynamic APIs — if the build complains, consult `node_modules/next/dist/docs/` for the current `searchParams` contract.)

- [ ] **Step 5: Commit**

```bash
git add "app/(public)/contact/page.tsx"
git commit -m "Use ProjectFlow on the contact page with package pre-select"
```

---

## Task 13: Wire the homepage CTA section

**Files:** Modify `components/public/landing/CTA.tsx` and `app/(public)/page.tsx`

- [ ] **Step 1: Update `CTA.tsx` imports + signature**

Replace the `InquiryForm` import with:

```tsx
import ProjectFlow from '@/components/public/project-flow/ProjectFlow'
import type { PricingTier, SiteSettings } from '@/lib/supabase/types'
```

Change the signature to accept `tiers`:

```tsx
export default function CTA({ settings, tiers }: { settings: SiteSettings; tiers: PricingTier[] }) {
  const email = settings.agency_email ?? 'contact@crafyne.com'
  const careEnabled = Boolean((settings.pricing_care_title ?? '').trim() && (settings.pricing_care_price ?? '').trim())
```

- [ ] **Step 2: Replace the inline navy form box**

Replace the entire `<div id="contact-form" style={{ ... }}><InquiryForm /></div>` block with:

```tsx
        <div id="contact-form" style={{ marginTop: 28, maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' }}>
          <ProjectFlow tiers={tiers} careEnabled={careEnabled} />
        </div>
```

- [ ] **Step 3: Pass `tiers` from the homepage**

In `app/(public)/page.tsx`, change the CTA render line to:

```tsx
      <CTA settings={settings} tiers={tiers} />
```

(`tiers` is already fetched and in scope on this page.)

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit` then `npm run build`
Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add components/public/landing/CTA.tsx "app/(public)/page.tsx"
git commit -m "Embed ProjectFlow in the homepage CTA section"
```

---

## Task 14: Deep-link the pricing CTAs + Care strip, and align Hero/Nav

**Files:** Modify `components/public/landing/Pricing.tsx`, `components/public/landing/Hero.tsx`, `components/public/landing/Nav.tsx`

- [ ] **Step 1: Pricing tier CTA href**

In `Pricing.tsx`, change the tier CTA anchor `href="#contact"` to a package deep-link:

```tsx
              <a className={'btn tier__cta ' + (t.featured ? 'btn--cream' : t.tone === 'navy' ? 'btn--cream' : 'btn--ink')} href={`/contact?package=${t.name.toLowerCase()}`}>
```

- [ ] **Step 2: Care strip link**

In `Pricing.tsx`, inside the `price__care` block, add a link after the `price__carePrice` div:

```tsx
            <a className="pf-careLink" href="/contact?care=1">Add to a project →</a>
```

Then add this style to `app/globals.css` (next to the other `.price__care*` rules):

```css
.pf-careLink { flex-shrink: 0; color: var(--crimson); font-weight: 600; font-size: 14px; white-space: nowrap; }
```

- [ ] **Step 3: Align Hero + Nav CTAs**

Open `components/public/landing/Hero.tsx`: find the primary CTA anchor (the one using `hero_cta_primary`). If its `href` is `#contact` or `#`, change it to `href="/contact"`. Leave the secondary "Watch reel" CTA unchanged.

Open `components/public/landing/Nav.tsx`: confirm the "Book a call" link points to `/contact`. If it points to `#contact`, change it to `/contact`. (No change if already `/contact`.)

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit` then `npm run build`
Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add components/public/landing/Pricing.tsx components/public/landing/Hero.tsx components/public/landing/Nav.tsx app/globals.css
git commit -m "Deep-link pricing/care CTAs into the wizard"
```

---

## Task 15: Show the new fields in the admin inquiries views

**Files:** Modify `app/admin/(cms)/inquiries/page.tsx` and `app/admin/(cms)/inquiries/[id]/page.tsx`

- [ ] **Step 1: Read the current files**

Run: open both files and locate (a) the list row markup in `page.tsx` and (b) the detail field rendering in `[id]/page.tsx`. They both already read inquiry rows via Supabase; the new columns are returned automatically by `select('*')` or need adding to an explicit `select` list — check and include `package, wants_care, design_references` if the select is explicit.

- [ ] **Step 2: List — show a package badge**

In `app/admin/(cms)/inquiries/page.tsx`, in the row where `project_type` is shown, add the package (when present) next to it:

```tsx
{inquiry.package && <span className="ml-2 inline-block text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/5 text-[#555]">{inquiry.package}{inquiry.wants_care ? ' + care' : ''}</span>}
```

(Match the surrounding class style; adjust the wrapper to the file's existing Tailwind conventions.)

- [ ] **Step 3: Detail — show package, care, references**

In `app/admin/(cms)/inquiries/[id]/page.tsx`, in the block that lists fields (near project type / budget / timeline), add:

```tsx
<div><dt className="text-xs uppercase tracking-wider text-[#888]">Package</dt><dd className="text-sm mt-1">{inquiry.package || '—'}{inquiry.wants_care ? ' + Care & hosting' : ''}</dd></div>
{inquiry.design_references && (
  <div className="sm:col-span-2"><dt className="text-xs uppercase tracking-wider text-[#888]">Design references</dt>
    <dd className="text-sm mt-1 space-y-1">
      {inquiry.design_references.split('\n').filter(Boolean).map((line, i) =>
        /^https?:\/\//.test(line)
          ? <a key={i} href={line} target="_blank" rel="noopener noreferrer" className="block text-[#B91C1C] underline break-all">{line}</a>
          : <p key={i} className="break-all">{line}</p>
      )}
    </dd>
  </div>
)}
```

(Adjust `dt`/`dd` wrappers to match the file's existing field markup; if it uses a different layout, mirror that layout instead.)

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit` then `npm run build`
Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add "app/admin/(cms)/inquiries/page.tsx" "app/admin/(cms)/inquiries/[id]/page.tsx"
git commit -m "Show package/care/references in admin inquiries"
```

---

## Task 16: Remove the old forms + final verification

**Files:** Delete `components/public/InquiryForm.tsx`, `components/public/landing/ContactForm.tsx`

- [ ] **Step 1: Confirm no remaining imports**

Run: `git grep -n "InquiryForm\|ContactForm"`
Expected: no matches in `app/` or `components/` (only this plan / spec / design-ref docs may match). If any source file still imports them, fix it before deleting.

- [ ] **Step 2: Delete the files**

```bash
git rm components/public/InquiryForm.tsx components/public/landing/ContactForm.tsx
```

- [ ] **Step 3: Full build**

Run: `npm run build`
Expected: exit 0, all routes compile.

- [ ] **Step 4: Runtime smoke**

Run the production server on a spare port and exercise the flow:

```bash
PORT=3123 npm start
```

Then in a browser (or via curl for HTML presence): open `/contact`, `/contact?package=build` (Build card should start selected), `/contact?care=1` (Care toggled). Walk all 4 steps, confirm Back/Next gating, add/remove a reference row, submit, and confirm the success view. Check the homepage CTA section renders the wizard. Stop the server when done.

- [ ] **Step 5: Verify a submission landed (after migration 015 is applied in Supabase)**

> NOTE: migration 015 must be run in the Supabase SQL Editor before a live submission will persist the new columns. After running it, submit once and confirm a `project_inquiries` row exists with `package`, `wants_care`, `design_references` populated (check `/admin/inquiries`).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Remove legacy inquiry forms (replaced by ProjectFlow)"
```

---

## Post-merge (server) checklist

1. Run `supabase/migrations/015_inquiry_order_fields.sql` in the Supabase SQL Editor.
2. On the server: `git pull` → `npm run build` → restart the Node app (deploy auto-pulls but does **not** rebuild).
3. Smoke-test `/contact` and a package deep-link on production.

---

## Self-review notes

- **Spec coverage:** wizard 4 steps (T6–T10), progress (T5), package pre-select via async `searchParams` (T12), care deep-link (T14), unify + delete old forms (T13, T16), motion animations incl. reduced-motion (T5, T10), design references links + notice (T8), DB columns + action + types (T2, T3), admin + email (T3, T15), CSS (T11), `motion` install w/ fallback (T1). All spec sections map to a task.
- **Type consistency:** `FormState` field names are identical across `types.ts`, every step component, and the controller's `onSubmit` mapping. `StepProps` is shared. `package` slug rule (`name.toLowerCase()`) is used identically in `Pricing.tsx` (T14) and `/contact` resolution (T12).
- **No placeholders:** every code step shows complete file content or an exact edit. The two admin edits (T15) instruct mirroring existing markup because that file's exact structure must be read first — the inserted JSX is complete; only wrapper classes adapt.
