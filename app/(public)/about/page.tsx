import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getTeam, getSettings } from '@/lib/supabase/queries'
import Nav from '@/components/public/landing/Nav'
import Footer from '@/components/public/landing/Footer'
import RevealController from '@/components/public/landing/RevealController'
import { toneByIndex } from '@/components/public/landing/tones'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'About',
  description: 'Crafyne is an independent software studio in Jakarta — six senior people building software for teams that care how it feels.',
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'website',
    title: 'About — Crafyne',
    description: 'An independent software studio in Jakarta, kept small on purpose since 2018.',
    url: '/about',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'About Crafyne' }],
  },
}

const principles = [
  { n: '01', t: 'Senior, or not at all', b: "Every project is anchored by people with 8+ years in the chair. We don't have a bench of juniors learning on your account." },
  { n: '02', t: 'Write more than we talk', b: "Briefs, decisions, RFCs, weekly memos. If it isn't in writing, it didn't happen. You get a paper trail you can audit." },
  { n: '03', t: 'Ship on Thursdays', b: 'Every week. Demoable, deployable, opinionated. The shape of the work is real software, not slides or status reports.' },
  { n: '04', t: 'Small tools, big decisions', b: 'We pick the smallest stack that survives the project. Boring tech, sharp choices, and a written rationale for both.' },
  { n: '05', t: 'Leave it better', b: 'Documentation engineers actually read. Code your team wants to inherit. Designs you can extend. Handoff is part of the deliverable.' },
  { n: '06', t: 'Honest, fast', b: "If the project is the wrong shape, we'll say so in the first call. If we're not the right team, we'll send you to who is." },
]

export default async function AboutPage() {
  const [team, settings] = await Promise.all([getTeam(), getSettings()])
  const email = settings.agency_email ?? 'contact@crafyne.com'
  const location = settings.agency_location ?? 'Jakarta, Indonesia'

  return (
    <>
      <Nav email={email} />
      <RevealController />
      <main>
        <section className="pageHero pageHero--ink">
          <div className="wrap">
            <div className="pageHero__crumb reveal">
              <Link href="/">Crafyne</Link><span>/</span><span>About</span>
            </div>
            <div className="pageHero__eyebrow reveal">/ about the studio</div>
            <h1 className="pageHero__title reveal" data-d="1">
              We&rsquo;re a small team.<br />
              <span className="italic">Working on grown-up software.</span>
            </h1>
            <p className="pageHero__sub reveal" data-d="2">
              Crafyne is an independent software studio based in Jakarta. We&rsquo;ve been running since 2018,
              kept small on purpose, and we build software for teams that care how it feels.
            </p>
            <div className="pageHero__meta reveal" data-d="3">
              <div className="pageHero__metaItem"><span className="pageHero__metaLabel">Founded</span><span className="pageHero__metaVal">May 2018</span></div>
              <div className="pageHero__metaItem"><span className="pageHero__metaLabel">Headcount</span><span className="pageHero__metaVal">{team.length || 6} full-time</span></div>
              <div className="pageHero__metaItem"><span className="pageHero__metaLabel">Headquartered</span><span className="pageHero__metaVal">{location}</span></div>
              <div className="pageHero__metaItem"><span className="pageHero__metaLabel">Time zone</span><span className="pageHero__metaVal">UTC+7 · 4h GMT overlap</span></div>
            </div>
          </div>
        </section>

        <section className="aboutStory">
          <div className="wrap aboutStory__grid">
            <div className="reveal">
              <div className="aboutStory__label">/ how we got here</div>
              <h2 className="aboutStory__title">Started in a kitchen. Stayed small on purpose.</h2>
            </div>
            <div className="aboutStory__body reveal" data-d="1">
              <p>
                Crafyne began in 2018 when our founder quit a director role at a payments company and started taking
                consulting projects from a kitchen table. Within a year there were three people. Within two,
                there was a clear thesis: stay senior, stay small, refuse the pull to scale.
              </p>
              <p>
                Years in, we&rsquo;re still a tight team. We could be twenty. We&rsquo;ve said no to scaling more than once
                because every time we picked up a junior or a project manager or a sales role, the work got
                quieter. Not worse, exactly — less ours.
              </p>
              <p>
                We&rsquo;re selective about who we work with because the alternative is being unselective, and
                we&rsquo;ve seen what that looks like. Most agencies are built to grow. We&rsquo;re built to last.
              </p>
            </div>
          </div>
        </section>

        <section className="aboutPrinciples">
          <div className="wrap">
            <div className="aboutPrinciples__head">
              <div className="eyebrow reveal">/ how we work</div>
              <h2 className="aboutPrinciples__title reveal" data-d="1">
                Six principles. <span className="italic">Repeated</span> until they&rsquo;re habits.
              </h2>
            </div>
            <div className="aboutPrinciples__grid">
              {principles.map((p, i) => (
                <div className="principle reveal" data-d={(i % 3) + 1} key={p.n}>
                  <div className="principle__n">/{p.n}</div>
                  <h3 className="principle__t">{p.t}</h3>
                  <p className="principle__b">{p.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="aboutStudio">
          <div className="wrap">
            <div className="aboutStudio__head">
              <div>
                <div className="eyebrow reveal">/ where we work</div>
                <h2 className="aboutStudio__title reveal" data-d="1">A studio, not an office.</h2>
              </div>
              <p className="reveal" data-d="2" style={{ color: 'var(--mute)', maxWidth: 380, fontSize: 15 }}>
                14th floor, Setiabudi. Three meeting rooms, one library, a too-good coffee machine.
                Open to visit when you&rsquo;re in {location.split(',')[0]}.
              </p>
            </div>
            <div className="aboutStudio__grid">
              <div className="aboutStudio__shot placeholder reveal" data-d="1"><span className="placeholder__label">studio · main room</span></div>
              <div className="aboutStudio__shot placeholder reveal" data-d="2" style={{ background: 'linear-gradient(135deg, var(--peach), var(--orange))' }}><span className="placeholder__label">team · lunch</span></div>
              <div className="aboutStudio__shot placeholder reveal" data-d="3"><span className="placeholder__label">desk detail</span></div>
              <div className="aboutStudio__shot placeholder reveal" data-d="3" style={{ background: 'linear-gradient(135deg, var(--navy-2), var(--navy))', color: 'var(--peach)' }}><span className="placeholder__label">library</span></div>
            </div>
          </div>
        </section>

        {team.length > 0 && (
          <section className="team section">
            <div className="wrap">
              <div className="team__head">
                <span className="eyebrow reveal">/ the studio</span>
                <h2 className="team__title h2 display reveal" data-d="1">
                  The people who&rsquo;ll <span className="italic">actually</span> be on your project.
                </h2>
              </div>
              <div className="team__grid">
                {team.map((p, i) => {
                  const initials = p.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                  return (
                    <figure className={`tm tm--${toneByIndex(i)} reveal`} data-d={(i % 3) + 1} key={p.id}>
                      <div className="tm__avatar">
                        {p.photo_url
                          ? <Image src={p.photo_url} alt={p.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
                          : (<><span className="tm__initials display">{initials}</span><span className="tm__tag mono">portrait</span></>)}
                      </div>
                      <figcaption className="tm__cap">
                        <div className="tm__name display">{p.name}</div>
                        <div className="tm__role">{p.role}</div>
                      </figcaption>
                    </figure>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        <section className="cta section--tight">
          <div className="wrap">
            <div className="cta__panel">
              <div className="cta__bg" aria-hidden="true"><span className="cta__blob cta__blob--a" /><span className="cta__blob cta__blob--b" /></div>
              <div className="cta__inner">
                <div className="cta__copy">
                  <span className="eyebrow cta__eye reveal">/ work with us</span>
                  <h2 className="cta__title display reveal" data-d="1">Tell us what <span className="italic">you&rsquo;re building.</span></h2>
                  <p className="cta__sub reveal" data-d="2">
                    One call, no slides. We&rsquo;ll tell you quickly whether we&rsquo;re a fit — and who to call if we&rsquo;re not.
                  </p>
                  <div className="cta__row reveal" data-d="3">
                    <Link className="btn btn--orange cta__primary" href="/contact">
                      Start the conversation
                      <span className="btn__arrow" aria-hidden="true">
                        <svg viewBox="0 0 12 12"><path d="M3 9 9 3M9 3H4M9 3v5" stroke="#0E1530" strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
                      </span>
                    </Link>
                    <a className="cta__mail mono" href={`mailto:${email}`}>{email}</a>
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
