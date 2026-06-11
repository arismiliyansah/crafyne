/* Hero — crimson, oversized type w/ inline visuals */
function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__inner wrap">
        <div className="hero__chip eyebrow reveal">
          <span className="hero__dot" /> Independent software studio · Booking Q3 2026
        </div>

        <h1 className="hero__title display">
          <span className="hero__line reveal" data-d="1">
            <span>WE&nbsp;BUILD</span>
            <span className="hero__inline hero__inline--window" aria-hidden="true">
              <span className="winDots"><i /><i /><i /></span>
              <span className="winBars">
                <span /><span /><span />
              </span>
            </span>
            <span>SOFTWARE</span>
          </span>

          <span className="hero__line reveal" data-d="2">
            <span className="italic">for&nbsp;people</span>
            <span className="hero__inline hero__inline--phone" aria-hidden="true">
              <span className="phoneNotch" />
              <span className="phoneScreen">
                <span />
                <span />
                <span />
              </span>
            </span>
            <span>WHO&nbsp;CARE</span>
          </span>

          <span className="hero__line reveal" data-d="3">
            <span>HOW&nbsp;IT&nbsp;</span>
            <span className="hero__feels">
              FEELS
            </span>
            <span className="hero__inline hero__inline--badge" aria-hidden="true">
              <span className="badgeRing"><span /></span>
            </span>
          </span>
        </h1>

        <div className="hero__row">
          <div className="hero__cta reveal" data-d="3">
            <a href="#contact" className="btn btn--cream hero__primary">
              Start a project
              <span className="btn__arrow" aria-hidden="true">
                <svg viewBox="0 0 12 12"><path d="M3 9 9 3M9 3H4M9 3v5" stroke="#B91C1C" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
              </span>
            </a>
            <a href="#work" className="hero__second">
              <span className="hero__playBtn"><svg viewBox="0 0 12 12"><path d="M4 3v6l5-3z" fill="currentColor"/></svg></span>
              <span>Watch reel <span className="mono">— 1:24</span></span>
            </a>
          </div>

          <p className="hero__lede reveal" data-d="4">
            Crafyne is a small studio of engineers and designers building products that feel right.
            We partner with founders and ops teams to ship measurable, lovable software — fast.
          </p>
        </div>

        <div className="hero__meta reveal" data-d="5">
          <div className="hero__metaItem">
            <span className="mono">01</span>
            <span>Based in Jakarta · working globally</span>
          </div>
          <div className="hero__metaItem">
            <span className="mono">02</span>
            <span>Avg. 6&ndash;14 week engagements</span>
          </div>
          <div className="hero__metaItem">
            <span className="mono">03</span>
            <span>Senior team, no juniors on your account</span>
          </div>
        </div>
      </div>

      <span className="hero__corner mono" aria-hidden="true">CRF · 26</span>
    </section>
  );
}
window.Hero = Hero;
