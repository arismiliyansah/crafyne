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
