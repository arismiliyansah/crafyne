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
