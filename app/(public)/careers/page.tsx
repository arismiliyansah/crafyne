import type { Metadata } from 'next'
import Link from 'next/link'
import { getSettings } from '@/lib/supabase/queries'
import Nav from '@/components/public/landing/Nav'
import Footer from '@/components/public/landing/Footer'
import RevealController from '@/components/public/landing/RevealController'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Work with a small, senior software studio in Jakarta. We hire roughly one person every 18 months — maybe that’s you.',
  alternates: { canonical: '/careers' },
  openGraph: {
    type: 'website',
    title: 'Careers — Crafyne',
    description: 'Work with people who finish things. Two senior openings at Crafyne.',
    url: '/careers',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Careers at Crafyne' }],
  },
}

const benefits = [
  { icon: '◐', t: 'Real ownership', b: "We're employee-owned. Everyone has profit share and a vote on who we hire next." },
  { icon: '▢', t: '32-hour weeks', b: 'Friday is a research day. Use it for client work, side projects, sleep — your call.' },
  { icon: '✺', t: 'Senior comp', b: 'We pay above market for senior roles because we only hire senior roles.' },
  { icon: '▣', t: 'Annual study week', b: 'One paid week per year for a conference, course, or sabbatical of your choice.' },
  { icon: '◆', t: 'Studio in Jakarta', b: 'Hybrid by default. Office is open Tue–Thu. WFH or co-work the rest.' },
  { icon: '▤', t: 'Sane on-call', b: 'Maximum one week per quarter. Capped and stipended. No surprise pages on weekends.' },
  { icon: '❍', t: 'Health, all of it', b: 'Top-tier health for you and dependents, including mental health and dental.' },
  { icon: '✶', t: 'Equipment budget', b: 'Pick your own stack: laptop, monitor, chair, headphones. Refreshed on a 3-year cycle.' },
]

const openings = [
  {
    title: 'Senior Product Designer',
    type: 'Full-time',
    where: 'Jakarta · Hybrid',
    tag: 'Design',
    desc: "You'll lead design on one large engagement and consult across the studio. 6+ years in product, strong systems thinking, opinions about typography.",
  },
  {
    title: 'Staff Software Engineer (Full-stack)',
    type: 'Full-time',
    where: 'Jakarta · Hybrid',
    tag: 'Engineering',
    desc: 'TypeScript end-to-end, comfortable shipping to production weekly, picky about APIs. 8+ years of practice, ideally including one zero-to-one.',
  },
]

export default async function CareersPage() {
  const settings = await getSettings()
  const email = settings.agency_email ?? 'hello@crafyne.studio'
  const careersEmail = `careers@${email.split('@')[1] ?? 'crafyne.studio'}`
  const apply = (role: string) => `mailto:${careersEmail}?subject=${encodeURIComponent(`Application: ${role}`)}`

  return (
    <>
      <Nav email={email} />
      <RevealController />
      <main>
        <section className="pageHero pageHero--crimson">
          <div className="wrap">
            <div className="pageHero__crumb reveal">
              <Link href="/">Crafyne</Link><span>/</span><span>Careers</span>
            </div>
            <div className="pageHero__eyebrow reveal">/ careers · {openings.length} open roles</div>
            <h1 className="pageHero__title reveal" data-d="1">
              Work with people<br />
              <span className="italic">who finish things.</span>
            </h1>
            <p className="pageHero__sub reveal" data-d="2">
              We&rsquo;re a small senior studio. We don&rsquo;t grow on purpose — but every few years we add one
              person we&rsquo;ve been quietly courting. Maybe that&rsquo;s you.
            </p>
          </div>
        </section>

        <section className="careersWhy">
          <div className="wrap careersWhy__grid">
            <div className="reveal">
              <div className="eyebrow" style={{ color: 'var(--crimson)' }}>/ why crafyne</div>
              <h2 className="careersWhy__title">
                We hire <span className="italic">people</span>,<br />not seats.
              </h2>
            </div>
            <div className="careersWhy__body reveal" data-d="1">
              <p>
                Crafyne hires roughly one person every 18 months. We take it seriously — the wrong hire would
                dilute everything we&rsquo;ve built. Which means we move slowly, ask a lot of questions, and try
                to be honest with you about what the work actually is.
              </p>
              <p>
                No one here writes code without also designing. No one designs without also writing code.
                Everyone owns one client end-to-end. Everyone reviews PRs and design crits across the studio.
                You won&rsquo;t be siloed into a specialty — you&rsquo;ll get broader and more senior at once.
              </p>
              <p>
                We expect a written work sample (one piece you&rsquo;re proud of), a paid trial week, and one
                long dinner before an offer. In return, we promise an honest 90-day onboarding and the kind
                of colleagues you&rsquo;ll be quoting in retros for years.
              </p>
            </div>
          </div>
        </section>

        <section className="benefits">
          <div className="wrap">
            <div className="benefits__head">
              <div className="eyebrow reveal">/ what you get</div>
              <h2 className="benefits__title reveal" data-d="1">Benefits, properly.</h2>
            </div>
            <div className="benefits__grid">
              {benefits.map((b, i) => (
                <div className="benefit reveal" data-d={(i % 4) + 1} key={b.t}>
                  <div className="benefit__icon">{b.icon}</div>
                  <h3 className="benefit__t">{b.t}</h3>
                  <p className="benefit__b">{b.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="openings">
          <div className="wrap">
            <div className="openings__head">
              <div className="eyebrow reveal">/ open roles</div>
              <h2 className="openings__title reveal" data-d="1">
                Two openings, <span className="italic">both senior.</span>
              </h2>
              <p className="reveal" data-d="2" style={{ color: 'var(--mute)', maxWidth: 560, fontSize: 17, marginTop: 12 }}>
                Don&rsquo;t see your role? We keep a watch-list for designers and engineers we&rsquo;d love to
                hire when a slot opens. Send a note to{' '}
                <a href={`mailto:${careersEmail}`} style={{ color: 'var(--crimson)', fontWeight: 600 }}>{careersEmail}</a>.
              </p>
            </div>
            <div className="openings__list">
              {openings.map(o => (
                <a className="opening reveal" href={apply(o.title)} key={o.title}>
                  <div>
                    <div className="opening__name">{o.title}</div>
                    <p style={{ fontSize: 14, color: 'var(--mute)', maxWidth: 520, marginTop: 8, marginBottom: 0, lineHeight: 1.5 }}>{o.desc}</p>
                  </div>
                  <div className="opening__meta">{o.type}<br />{o.where}</div>
                  <div>
                    <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 999, background: 'var(--peach)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{o.tag}</span>
                  </div>
                  <div className="opening__arr">
                    <svg viewBox="0 0 14 14"><path d="M3 11 11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="cta section--tight">
          <div className="wrap">
            <div className="cta__panel">
              <div className="cta__bg" aria-hidden="true"><span className="cta__blob cta__blob--a" /><span className="cta__blob cta__blob--b" /></div>
              <div className="cta__inner">
                <div className="cta__copy">
                  <span className="eyebrow cta__eye reveal">/ no fit right now?</span>
                  <h2 className="cta__title display reveal" data-d="1">Keep in <span className="italic">touch.</span></h2>
                  <p className="cta__sub reveal" data-d="2">
                    Send us your portfolio and a short note about what you&rsquo;re working on. If you&rsquo;re
                    on our watch-list, we&rsquo;ll let you know when a role opens.
                  </p>
                  <div className="cta__row reveal" data-d="3">
                    <a className="btn btn--orange cta__primary" href={`mailto:${careersEmail}`}>
                      Send a note
                      <span className="btn__arrow" aria-hidden="true">
                        <svg viewBox="0 0 12 12"><path d="M3 9 9 3M9 3H4M9 3v5" stroke="#0E1530" strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
                      </span>
                    </a>
                    <a className="cta__mail mono" href={`mailto:${careersEmail}`}>{careersEmail}</a>
                  </div>
                </div>
                <div className="cta__arrow reveal" data-d="2" aria-hidden="true">
                  <svg viewBox="0 0 200 200"><path d="M30 170 L170 30 M170 30 H80 M170 30 V120" stroke="#FFD9CF" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  )
}
