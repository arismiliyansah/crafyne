import type { SiteSettings } from '@/lib/supabase/types'
import InquiryForm from '@/components/public/InquiryForm'

// CTA banner (navy panel) followed by the real inquiry form.
export default function CTA({ settings }: { settings: SiteSettings }) {
  const email = settings.agency_email ?? 'hello@crafyne.studio'
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
              <span className="eyebrow cta__eye reveal">/ {settings.cta_eyebrow ?? 'next slot opens August 4'}</span>
              <h2 className="cta__title display reveal" data-d="1">
                {settings.cta_title ?? 'Let’s build something people open on purpose.'}
              </h2>
              <p className="cta__sub reveal" data-d="2">
                {settings.cta_sub ?? 'Tell us about the project. We reply within one working day with honest first impressions — and whether we’re the right team.'}
              </p>
              <div className="cta__row reveal" data-d="3">
                <a className="btn btn--orange cta__primary" href="#contact-form">
                  Start the conversation
                  <span className="btn__arrow" aria-hidden="true">
                    <svg viewBox="0 0 12 12"><path d="M3 9 9 3M9 3H4M9 3v5" stroke="#0E1530" strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
                  </span>
                </a>
                <a className="cta__mail mono" href={`mailto:${email}`}>{email}</a>
              </div>
            </div>
            <div className="cta__arrow reveal" data-d="2" aria-hidden="true">
              <svg viewBox="0 0 200 200">
                <path d="M30 170 L170 30 M170 30 H80 M170 30 V120" stroke="#FFD9CF" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <div id="contact-form" style={{ marginTop: 56, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
          <InquiryForm />
        </div>
      </div>
    </section>
  )
}
