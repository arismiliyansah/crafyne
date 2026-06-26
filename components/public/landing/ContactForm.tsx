'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { submitInquiry } from '@/lib/actions/inquiries'

const SERVICES = ['Product design', 'Web engineering', 'Mobile apps', 'AI & ML', 'Enterprise software', 'Not sure yet']
const BUDGETS = ['Under $25k', '$25k–$75k', '$75k–$200k', '$200k+', 'Retainer']
const TIMELINES = ['ASAP', 'Within a month', 'Within a quarter', 'Just exploring']

const heading = { fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 } as const
const crimsonEyebrow = { color: 'var(--crimson)', marginBottom: 8 } as const

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', company: '', role: '', services: [] as string[], budget: '', timeline: '', project: '', how: '', website: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const toggleService = (s: string) =>
    setForm(f => ({ ...f, services: f.services.includes(s) ? f.services.filter(x => x !== s) : [...f.services, s] }))

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData()
    fd.set('name', form.name)
    fd.set('email', form.email)
    fd.set('company', form.company)
    fd.set('project_type', form.services.join(', ') || 'General inquiry')
    fd.set('budget_range', form.budget)
    fd.set('timeline', form.timeline)
    const message = [form.project, form.role && `Role: ${form.role}`, form.how && `Found us via: ${form.how}`]
      .filter(Boolean).join('\n\n')
    fd.set('message', message)
    fd.set('website', form.website)
    startTransition(async () => {
      const res = await submitInquiry(fd)
      if (res.error) setError(res.error)
      else setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="contactForm reveal">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: 'var(--crimson)', color: 'var(--cream)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>✓</div>
          <h2 style={{ ...heading, fontSize: 32, lineHeight: 1.1 }}>Got it — {form.name || 'thank you'}.</h2>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--ink-soft)', margin: 0 }}>
            A real person will reply to {form.email || 'you'} within one working day. If it&rsquo;s urgent, email us directly — we read everything.
          </p>
          <div className="contactForm__success">
            <strong>While you wait:</strong> have a look at our{' '}
            <Link href="/work" style={{ color: 'var(--crimson)', fontWeight: 600 }}>recent work</Link>. It&rsquo;s the best window into how we actually build.
          </div>
        </div>
      </div>
    )
  }

  return (
    <form className="contactForm reveal" onSubmit={onSubmit}>
      <input type="text" name="website" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
      <div style={{ marginBottom: 24 }}>
        <div className="eyebrow" style={crimsonEyebrow}>/ section 01</div>
        <h2 style={heading}>Who&rsquo;s asking?</h2>
      </div>
      <div className="contactForm__row contactForm__row--two">
        <div className="field">
          <label className="field__label">Your name</label>
          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
        </div>
        <div className="field">
          <label className="field__label">Email</label>
          <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jane@company.com" />
        </div>
      </div>
      <div className="contactForm__row contactForm__row--two">
        <div className="field">
          <label className="field__label">Company</label>
          <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Acme Inc." />
        </div>
        <div className="field">
          <label className="field__label">Your role</label>
          <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Head of Product" />
        </div>
      </div>

      <div style={{ margin: '40px 0 24px' }}>
        <div className="eyebrow" style={crimsonEyebrow}>/ section 02</div>
        <h2 style={heading}>The project</h2>
      </div>
      <div className="contactForm__row">
        <div className="field">
          <label className="field__label">What do you need? (pick any)</label>
          <div className="field__chips">
            {SERVICES.map(s => (
              <button type="button" key={s} className={'field__chip ' + (form.services.includes(s) ? 'is-on' : '')} onClick={() => toggleService(s)}>{s}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="contactForm__row contactForm__row--two">
        <div className="field">
          <label className="field__label">Budget</label>
          <select value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}>
            <option value="">Pick a range</option>
            {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field__label">Timeline</label>
          <select value={form.timeline} onChange={e => setForm({ ...form, timeline: e.target.value })}>
            <option value="">When do you want to start?</option>
            {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="contactForm__row">
        <div className="field">
          <label className="field__label">Tell us about it</label>
          <textarea required value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} placeholder="What are you building? Who's it for? What's the messy real version?" />
        </div>
      </div>
      <div className="contactForm__row">
        <div className="field">
          <label className="field__label">How did you find us? (optional)</label>
          <input value={form.how} onChange={e => setForm({ ...form, how: e.target.value })} placeholder="A friend, a Google search, a talk we gave..." />
        </div>
      </div>

      {error && <p style={{ color: 'var(--crimson)', fontSize: 14, marginBottom: 12 }}>{error}</p>}

      <div className="contactForm__submit">
        <span className="contactForm__note">We never share your details. You&rsquo;ll get one human reply, no sequence.</span>
        <button type="submit" className="btn btn--ink" disabled={isPending}>
          {isPending ? 'Sending…' : 'Send to Crafyne'}
          <span className="btn__arrow" aria-hidden="true">
            <svg viewBox="0 0 12 12"><path d="M3 9 9 3M9 3H4M9 3v5" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
          </span>
        </button>
      </div>
    </form>
  )
}
