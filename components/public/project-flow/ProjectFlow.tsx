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
