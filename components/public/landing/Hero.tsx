import type { SiteSettings } from '@/lib/supabase/types'

// Hero — crimson, oversized type with inline visuals. The 3-line title and its
// inline window/phone/badge graphics are structural and hard-coded; surrounding
// copy (chip, CTAs, lede, meta) comes from site settings.
export default function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="hero" id="top">
      <div className="hero__inner wrap">
        <div className="hero__chip eyebrow reveal">
          <span className="hero__dot" /> {settings.hero_chip ?? 'Independent software studio · Booking Q3 2026'}
        </div>

        <h1 className="hero__title display">
          <span className="hero__line reveal" data-d="1">
            <span>WE&nbsp;BUILD</span>
            <span className="hero__inline hero__inline--window" aria-hidden="true">
              <span className="winDots"><i /><i /><i /></span>
              <span className="winBars"><span /><span /><span /></span>
            </span>
            <span>SOFTWARE</span>
          </span>

          <span className="hero__line reveal" data-d="2">
            <span className="italic">for&nbsp;people</span>
            <span className="hero__inline hero__inline--phone" aria-hidden="true">
              <span className="phoneNotch" />
              <span className="phoneScreen"><span /><span /><span /></span>
            </span>
            <span>WHO&nbsp;CARE</span>
          </span>

          <span className="hero__line reveal" data-d="3">
            <span>HOW&nbsp;IT&nbsp;</span>
            <span className="hero__feels">FEELS</span>
            <span className="hero__inline hero__inline--badge" aria-hidden="true">
              <span className="badgeRing"><span /></span>
            </span>
          </span>
        </h1>

        <div className="hero__row">
          <div className="hero__cta reveal" data-d="3">
            <a href="#contact" className="btn btn--cream hero__primary">
              {settings.hero_cta_primary ?? 'Start a project'}
              <span className="btn__arrow" aria-hidden="true">
                <svg viewBox="0 0 12 12"><path d="M3 9 9 3M9 3H4M9 3v5" stroke="#B91C1C" strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
              </span>
            </a>
            <a href="#work" className="hero__second">
              <span className="hero__playBtn"><svg viewBox="0 0 12 12"><path d="M4 3v6l5-3z" fill="currentColor" /></svg></span>
              <span>{settings.hero_cta_secondary ?? 'Watch reel — 1:24'}</span>
            </a>
          </div>

          <p className="hero__lede reveal" data-d="4">
            {settings.hero_lede ?? 'Crafyne is a small studio of engineers and designers building products that feel right. We partner with founders and ops teams to ship measurable, lovable software — fast.'}
          </p>
        </div>

        <div className="hero__meta reveal" data-d="5">
          <div className="hero__metaItem">
            <span className="mono">01</span>
            <span>{settings.hero_meta_1 ?? 'Based in Jakarta · working globally'}</span>
          </div>
          <div className="hero__metaItem">
            <span className="mono">02</span>
            <span>{settings.hero_meta_2 ?? 'Avg. 6–14 week engagements'}</span>
          </div>
          <div className="hero__metaItem">
            <span className="mono">03</span>
            <span>{settings.hero_meta_3 ?? 'Senior team, no juniors on your account'}</span>
          </div>
        </div>
      </div>

      <span className="hero__corner mono" aria-hidden="true">CRF · 26</span>
    </section>
  )
}
