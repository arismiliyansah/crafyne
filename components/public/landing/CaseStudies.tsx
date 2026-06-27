'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { CaseStudy } from '@/lib/supabase/types'
import { toneByIndex, shapeByIndex, type CaseShape } from './tones'

const filters = [
  { id: 'all', label: 'All work' },
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'ai', label: 'AI' },
  { id: 'design', label: 'Design' },
  { id: 'enterprise', label: 'Enterprise' },
]

function CaseShapeView({ kind }: { kind: CaseShape }) {
  if (kind === 'phone') return (
    <div className="cshape cshape--phone">
      <div className="cshape__notch" />
      <div className="cshape__line" /><div className="cshape__line" style={{ width: '60%' }} />
      <div className="cshape__block" />
      <div className="cshape__row"><div /><div /><div /></div>
    </div>
  )
  if (kind === 'dashboard') return (
    <div className="cshape cshape--dash">
      <div className="cshape__bar"><i /><i /><i /></div>
      <div className="cshape__cols"><span /><span /><span /></div>
      <div className="cshape__graph">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none">
          <path d="M0 30 L20 22 L40 26 L60 12 L80 18 L100 6" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </div>
  )
  if (kind === 'blocks') return (
    <div className="cshape cshape--blocks">
      <div className="cshape__q"><span>?</span></div>
      <div className="cshape__a">
        <div className="cshape__line" /><div className="cshape__line" style={{ width: '80%' }} /><div className="cshape__line" style={{ width: '45%' }} />
      </div>
    </div>
  )
  if (kind === 'card') return (
    <div className="cshape cshape--card">
      <div className="cshape__bottle" />
      <div className="cshape__tag">D2C<br />SHOP</div>
    </div>
  )
  if (kind === 'grid') return (
    <div className="cshape cshape--grid">
      {Array.from({ length: 9 }).map((_, i) => <span key={i} />)}
    </div>
  )
  return null
}

export default function CaseStudies({ cases }: { cases: CaseStudy[] }) {
  const [filter, setFilter] = useState('all')
  if (cases.length === 0) return null
  const visible = filter === 'all' ? cases : cases.filter(c => c.tags.includes(filter))
  return (
    <section className="cases section" id="work">
      <div className="wrap">
        <div className="cases__head">
          <div>
            <span className="eyebrow reveal">/ selected work</span>
            <h2 className="cases__title h2 display reveal" data-d="1">
              Recent things <span className="italic">we&rsquo;re proud</span> of.
            </h2>
          </div>
          <div className="cases__filters reveal" data-d="2" role="tablist">
            {filters.map(f => (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                className={'cases__filter ' + (filter === f.id ? 'is-active' : '')}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="cases__grid">
          {visible.map((c, i) => (
            <article className={`case case--${toneByIndex(i)} reveal`} data-d={(i % 3) + 1} key={c.id}>
              <div className="case__visual">
                {c.cover_image_url
                  ? <Image src={c.cover_image_url} alt={c.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                  : <CaseShapeView kind={shapeByIndex(i)} />}
              </div>
              <div className="case__body">
                <div className="case__meta mono">
                  <span>{c.kind ?? c.tagline}</span><span>·</span><span>{c.year}</span>
                </div>
                <h3 className="case__name display">{c.name}</h3>
                <div className="case__foot">
                  <Link className="case__link" href={`/work/${c.slug}`}>
                    Read case study
                    <span className="case__arr" aria-hidden="true">
                      <svg viewBox="0 0 14 14"><path d="M3 11 11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
                    </span>
                  </Link>
                  {c.outcome && <span className="case__result mono">{c.outcome}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
