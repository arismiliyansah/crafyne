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
