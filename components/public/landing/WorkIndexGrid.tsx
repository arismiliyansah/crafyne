'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { CaseStudy } from '@/lib/supabase/types'
import { toneByIndex } from './tones'

const filters = [
  { id: 'all', label: 'All work' },
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'ai', label: 'AI' },
  { id: 'design', label: 'Design' },
  { id: 'enterprise', label: 'Enterprise' },
]

const sizeClass = (i: number) => (i === 0 ? 'workCard--feat' : i <= 2 ? 'workCard--half' : 'workCard--third')

export default function WorkIndexGrid({ cases }: { cases: CaseStudy[] }) {
  const [filter, setFilter] = useState('all')
  const visible = filter === 'all' ? cases : cases.filter(c => c.tags.includes(filter))

  return (
    <section className="workIdx">
      <div className="wrap">
        <div className="workIdx__head">
          <div className="workIdx__count mono reveal">Showing {visible.length} of {cases.length} projects</div>
          <div className="workIdx__filters reveal" data-d="1">
            {filters.map(f => (
              <button key={f.id} className={'cases__filter ' + (filter === f.id ? 'is-active' : '')} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="workIdx__grid">
          {visible.map((c, i) => (
            <Link className={`workCard ${sizeClass(i)} reveal`} data-d={(i % 3) + 1} key={c.id} href={`/work/${c.slug}`}>
              <div className={`workCard__visual workCard__visual--${toneByIndex(i)}`}>
                {c.tags?.[0] && <span className="workCard__pill">{c.tags[0]}</span>}
                {c.cover_image_url && (
                  <Image src={c.cover_image_url} alt={c.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                )}
                {c.outcome && <span className="workCard__metric">{c.outcome}</span>}
              </div>
              <div className="workCard__body">
                <div className="workCard__meta">
                  <span>{c.kind ?? c.tagline}</span><span>·</span><span>{c.year}</span>
                </div>
                <h3 className="workCard__name">{c.name}</h3>
                <p className="workCard__teaser">{c.summary ?? c.tagline}</p>
                <span className="workCard__link">
                  Read case study
                  <svg viewBox="0 0 14 14"><path d="M3 11 11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
