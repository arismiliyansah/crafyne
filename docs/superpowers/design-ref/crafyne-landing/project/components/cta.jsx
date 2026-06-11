/* CTA banner — big navy panel with arrow */
function CTA() {
  return (
    <section className="cta section--tight" id="contact">
      <div className="wrap">
        <div className="cta__panel">
          <div className="cta__bg" aria-hidden="true">
            <span className="cta__blob cta__blob--a" />
            <span className="cta__blob cta__blob--b" />
          </div>
          <div className="cta__inner">
            <div className="cta__copy">
              <span className="eyebrow cta__eye reveal">/ next slot opens August 4</span>
              <h2 className="cta__title display reveal" data-d="1">
                Let&rsquo;s build something <span className="italic">people open on purpose.</span>
              </h2>
              <p className="cta__sub reveal" data-d="2">
                Tell us about the project. We reply within one working day with honest first impressions —
                and whether we&rsquo;re the right team.
              </p>
              <div className="cta__row reveal" data-d="3">
                <a className="btn btn--orange cta__primary" href="#">
                  Start the conversation
                  <span className="btn__arrow" aria-hidden="true">
                    <svg viewBox="0 0 12 12"><path d="M3 9 9 3M9 3H4M9 3v5" stroke="#0E1530" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
                  </span>
                </a>
                <a className="cta__mail mono" href="mailto:hello@crafyne.studio">hello@crafyne.studio</a>
              </div>
            </div>
            <div className="cta__arrow reveal" data-d="2" aria-hidden="true">
              <svg viewBox="0 0 200 200">
                <path d="M30 170 L170 30 M170 30 H80 M170 30 V120" stroke="#FFD9CF" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
window.CTA = CTA;
