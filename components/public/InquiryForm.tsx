'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { submitInquiry } from '@/lib/actions/inquiries'

// ── Options ──────────────────────────────────────────────────────────────────
const PROJECT_TYPES = [
  'Web Application',
  'Design System',
  'Mobile App',
  'E-commerce',
  'Redesign & Refresh',
  'Other',
]

const BUDGET_RANGES = [
  'Small (< 1 month)',
  'Medium (1–3 months)',
  'Large (3–6 months)',
  'Enterprise',
  "Let's discuss",
]

const TIMELINES = [
  'ASAP (< 1 month)',
  '1 – 3 months',
  '3 – 6 months',
  '6+ months',
  'Flexible',
]

// ── Custom Select ─────────────────────────────────────────────────────────────
function Select({
  name,
  options,
  placeholder,
  defaultValue = '',
  required,
}: {
  name: string
  options: string[]
  placeholder: string
  defaultValue?: string
  required?: boolean
}) {
  const [open, setOpen]       = useState(false)
  const [value, setValue]     = useState(defaultValue)
  const containerRef          = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const displayLabel = value || placeholder

  return (
    <div ref={containerRef} className="relative">
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value} />

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-[14px] transition
          ${open ? 'border-white/40' : 'border-white/15 hover:border-white/25'}
          ${value ? 'text-white' : 'text-white/30'}`}
      >
        <span>{displayLabel}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`text-white/35 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown panel */}
      <div
        className={`absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-xl border border-white/10
          bg-[#161614] shadow-[0_16px_48px_rgba(0,0,0,0.6)]
          overflow-hidden transition-all duration-200 origin-top
          ${open ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'}`}
      >
        <ul className="py-1.5 max-h-52 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {options.map(opt => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => { setValue(opt); setOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-[13.5px] transition-colors
                  ${value === opt
                    ? 'text-white bg-white/8'
                    : 'text-white/55 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className="flex items-center justify-between">
                  {opt}
                  {value === opt && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className="text-accent-light flex-shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ── Field styles ──────────────────────────────────────────────────────────────
const fieldClass =
  'w-full bg-transparent border border-white/15 rounded-lg px-4 py-3 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition'

// ── Main form ─────────────────────────────────────────────────────────────────
export default function InquiryForm() {
  const [error, setError]            = useState<string | null>(null)
  const [success, setSuccess]        = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await submitInquiry(formData)
      if (result.error) setError(result.error)
      else setSuccess(true)
    })
  }

  if (success) {
    return (
      <div className="max-w-[520px] mx-auto text-center py-10">
        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="text-white/70">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-serif text-[24px] text-white mb-3">Message received.</h3>
        <p className="text-[15px] text-white/50 font-light leading-[1.7]">
          Thank you for reaching out. We review every inquiry personally and will be in touch within 2 business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-[600px] mx-auto w-full text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

        <div>
          <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-white/40 mb-2">
            Name <span className="text-white/25">*</span>
          </label>
          <input name="name" required placeholder="Your name" className={fieldClass} />
        </div>

        <div>
          <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-white/40 mb-2">
            Email <span className="text-white/25">*</span>
          </label>
          <input name="email" type="email" required placeholder="you@company.com" className={fieldClass} />
        </div>

        <div>
          <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-white/40 mb-2">
            Company
          </label>
          <input name="company" placeholder="Company name" className={fieldClass} />
        </div>

        <div>
          <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-white/40 mb-2">
            Project type <span className="text-white/25">*</span>
          </label>
          <Select name="project_type" options={PROJECT_TYPES} placeholder="Select type…" required />
        </div>

        <div>
          <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-white/40 mb-2">
            Project scope
          </label>
          <Select name="budget_range" options={BUDGET_RANGES} placeholder="Not sure yet" />
        </div>

        <div>
          <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-white/40 mb-2">
            Timeline
          </label>
          <Select name="timeline" options={TIMELINES} placeholder="Flexible" />
        </div>

      </div>

      <div className="mb-6">
        <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-white/40 mb-2">
          Tell us about your project <span className="text-white/25">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="What are you building? What problem does it solve? Any existing work we should know about?"
          className={`${fieldClass} resize-none`}
        />
      </div>

      {error && (
        <p className="mb-4 text-[13px] text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto bg-white text-[#0F0F0D] px-8 py-3.5 rounded-full text-[14px] font-medium
          hover:opacity-85 disabled:opacity-40 transition tracking-[0.01em]"
      >
        {isPending ? 'Sending…' : 'Send inquiry'}
      </button>
    </form>
  )
}
