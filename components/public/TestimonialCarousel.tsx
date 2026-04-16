'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Testimonial } from '@/lib/supabase/types'

export default function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  const goTo = useCallback((index: number) => {
    setVisible(false)
    setTimeout(() => {
      setCurrent(index)
      setVisible(true)
    }, 350)
  }, [])

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = setInterval(() => {
      goTo((current + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [current, testimonials.length, goTo])

  if (testimonials.length === 0) return null

  const t = testimonials[current]

  return (
    <div className="max-w-[1160px] mx-auto">
      {/* Quote mark */}
      <span className="block font-serif text-[60px] md:text-[88px] text-accent leading-[0.6] mb-10 md:mb-12">
        "
      </span>

      {/* Quote + attribution — fades on transition */}
      <div
        className="transition-opacity duration-350"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <blockquote className="font-serif italic text-[clamp(20px,3.2vw,38px)] leading-[1.35] tracking-[-0.015em] max-w-[840px] mx-auto text-ink mb-8 md:mb-10">
          {t.quote}
        </blockquote>
        <p className="text-[13px] text-ink-3 tracking-[0.04em]">
          <strong className="text-ink-2 font-medium">{t.author_name}</strong>
          {t.author_role && ` — ${t.author_role}`}
          {t.author_company && `, ${t.author_company}`}
        </p>
      </div>

      {/* Dot indicators — only show if more than 1 */}
      {testimonials.length > 1 && (
        <div className="flex items-center justify-center gap-2.5 mt-10 md:mt-14">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-5 h-1.5 bg-ink/50'
                  : 'w-1.5 h-1.5 bg-ink/20 hover:bg-ink/35'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
