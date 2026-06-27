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
