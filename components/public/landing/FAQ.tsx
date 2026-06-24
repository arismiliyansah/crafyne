'use client'

import { useState } from 'react'
import type { Faq } from '@/lib/supabase/types'

export default function FAQ({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState(0)
  if (faqs.length === 0) return null
  return (
    <section className="faq section" id="faq">
      <div className="wrap faq__wrap">
        <div className="faq__head">
          <span className="eyebrow reveal">/ honest answers</span>
          <h2 className="faq__title h2 display reveal" data-d="1">
            Things people <span className="italic">actually</span> ask us.
          </h2>
          <p className="faq__sub reveal" data-d="2">
            Don&rsquo;t see your question? Email{' '}
            <a className="mono" href="mailto:contact@crafyne.com">contact@crafyne.com</a> and you&rsquo;ll
            get a real answer from a real person.
          </p>
        </div>
        <ul className="faq__list">
          {faqs.map((it, i) => (
            <li className={'faq__item reveal ' + (open === i ? 'is-open' : '')} data-d={(i % 3) + 1} key={it.id}>
              <button
                className="faq__q"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                <span className="faq__qNum mono">/{String(i + 1).padStart(2, '0')}</span>
                <span className="faq__qText">{it.question}</span>
                <span className="faq__toggle" aria-hidden="true">
                  <svg viewBox="0 0 16 16"><path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                </span>
              </button>
              <div className="faq__a">
                <p>{it.answer}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
