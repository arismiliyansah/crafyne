import type { PricingTier } from '@/lib/supabase/types'

export default function Pricing({ tiers }: { tiers: PricingTier[] }) {
  if (tiers.length === 0) return null
  return (
    <section className="price section" id="pricing">
      <div className="wrap">
        <div className="price__head">
          <span className="eyebrow reveal">/ engagement models</span>
          <h2 className="price__title h2 display reveal" data-d="1">
            Three ways to <span className="italic">work together</span>.
          </h2>
          <p className="price__sub reveal" data-d="2">
            Every engagement is sized to the problem. Prices below are starting points —
            we&rsquo;ll quote firmly after the first session.
          </p>
        </div>
        <div className="price__grid">
          {tiers.map((t, i) => (
            <article
              className={`tier tier--${t.tone} ${t.featured ? 'tier--featured' : ''} reveal`}
              data-d={i + 1}
              key={t.id}
            >
              {t.featured && <span className="tier__ribbon mono">Most popular</span>}
              <div className="tier__head">
                <div>
                  <div className="tier__name display">{t.name}</div>
                  <div className="tier__tag mono">{t.tag}</div>
                </div>
                <div className="tier__price">
                  <span className="tier__currency">$</span>
                  <span className="tier__amt display">{t.price}</span>
                  <span className="tier__unit mono">{t.unit}</span>
                </div>
              </div>
              <p className="tier__blurb">{t.blurb}</p>
              <ul className="tier__feats">
                {t.features.map((f, j) => (
                  <li key={j}>
                    <span className="tier__check" aria-hidden="true">
                      <svg viewBox="0 0 14 14"><path d="M2 8 6 12 12 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <a className={'btn tier__cta ' + (t.featured ? 'btn--cream' : t.tone === 'navy' ? 'btn--cream' : 'btn--ink')} href="#contact">
                {t.cta_label}
                <span className="btn__arrow" aria-hidden="true">
                  <svg viewBox="0 0 12 12"><path d="M3 9 9 3M9 3H4M9 3v5" stroke={t.featured ? '#B91C1C' : t.tone === 'navy' ? '#0E1530' : 'white'} strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
