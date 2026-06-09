'use client'

import { useState, useEffect, useRef } from 'react'
import type { Stat } from '@/lib/supabase/types'

function useCountUp(target: number, start: boolean, duration = 1600) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(target * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, target, duration])
  return value
}

function StatItem({ value, suffix, label, decimals, started }: {
  value: number; suffix: string; label: string; decimals: number; started: boolean
}) {
  const v = useCountUp(value, started)
  const display = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString()
  return (
    <div className="stat">
      <div className="stat__num display">{display}<span className="stat__suffix">{suffix}</span></div>
      <div className="stat__label">{label}</div>
    </div>
  )
}

export default function Stats({ stats, eyebrow, title }: { stats: Stat[]; eyebrow: string; title: string }) {
  const ref = useRef<HTMLElement>(null)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setStarted(true); io.disconnect() }
    }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (stats.length === 0) return null

  return (
    <section className="stats" ref={ref}>
      <div className="wrap">
        <div className="stats__head reveal">
          <span className="eyebrow">/ {eyebrow}</span>
          <h2 className="stats__title h2 display">{title}</h2>
        </div>
        <div className="stats__grid">
          {stats.map(s => (
            <StatItem key={s.id} value={s.value} suffix={s.suffix} decimals={s.decimals} label={s.label} started={started} />
          ))}
        </div>
      </div>
    </section>
  )
}
