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
