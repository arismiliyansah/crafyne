'use client'

import { useEffect } from 'react'

// Global scroll-reveal observer. Content is visible by default; we add `.js-reveal`
// to opt elements into the hidden state, then reveal them with `.in` on intersect.
// A 2s safety net and reduced-motion bypass guarantee nothing stays hidden.
export default function RevealController() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    els.forEach(el => el.classList.add('js-reveal'))

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )
    els.forEach(el => io.observe(el))

    const safety = setTimeout(() => els.forEach(el => el.classList.add('in')), 2000)

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(el => el.classList.add('in'))
    }

    return () => { io.disconnect(); clearTimeout(safety) }
  }, [])

  return null
}
