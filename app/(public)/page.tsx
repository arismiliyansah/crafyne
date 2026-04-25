import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getSettings, getServices, getCaseStudies, getTeam, getTestimonials } from '@/lib/supabase/queries'
import Nav from '@/components/public/Nav'
import HeroGlow from '@/components/public/HeroGlow'
import ScrollReveal from '@/components/public/ScrollReveal'
import InquiryForm from '@/components/public/InquiryForm'
import TestimonialCarousel from '@/components/public/TestimonialCarousel'

export const revalidate = 60
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const GRADIENT_MAPS = ['img-a', 'img-b', 'img-c', 'img-d']
const AVATAR_COLORS = ['#8BA899', '#9A8BA3', '#A8998B', '#8B9EA8']

export default async function HomePage() {
  const [settings, services, caseStudies, team, testimonials] = await Promise.all([
    getSettings(),
    getServices(),
    getCaseStudies(),
    getTeam(),
    getTestimonials(),
  ])

  const proofClients = (settings.proof_clients ?? '').split(',').map(s => s.trim()).filter(Boolean)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Crafyne',
    url: 'https://crafyne.com',
    logo: 'https://crafyne.com/og-image.png',
    description: settings.agency_tagline ?? 'A small, senior team of engineers and designers building software for people who care how it feels.',
    email: settings.agency_email ?? undefined,
    contactPoint: settings.agency_email ? {
      '@type': 'ContactPoint',
      email: settings.agency_email,
      contactType: 'customer support',
      availableLanguage: ['English'],
    } : undefined,
    sameAs: [
      settings.footer_instagram_url,
      settings.footer_facebook_url,
      settings.footer_threads_url,
      settings.footer_github_url,
    ].filter((url): url is string => Boolean(url) && url !== '#'),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />

      {/* ── HERO ─────────────────────────────────── */}
      <HeroGlow>
        <ScrollReveal>
          <p className="text-[12px] font-medium tracking-[0.11em] uppercase text-accent mb-9">
            {settings.hero_eyebrow}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={1}>
          <h1 className="font-serif text-[clamp(36px,7.2vw,90px)] font-normal leading-[1.06] tracking-[-0.025em] max-w-[860px] text-ink mb-7">
            {settings.hero_headline?.split('how it feels.').map((part, i) =>
              i === 0
                ? <span key={i}>{part}<em>how it feels.</em></span>
                : <span key={i}>{part}</span>
            ) ?? settings.hero_headline}
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={2}>
          <p className="text-[16px] md:text-[17.5px] text-ink-2 max-w-[400px] leading-[1.68] mb-12 font-light">
            {settings.hero_subheadline}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={3}>
          <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
            <Link href="#contact"
              className="bg-ink text-bg px-7 py-3.5 rounded-full text-[14px] font-medium tracking-[0.01em] hover:opacity-75 transition">
              {settings.hero_cta_primary}
            </Link>
            <Link href="#work"
              className="text-ink-2 text-[14px] hover:text-ink transition group flex items-center gap-1.5">
              {settings.hero_cta_secondary}
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </ScrollReveal>
      </HeroGlow>

      {/* ── PROOF STRIP ──────────────────────────── */}
      {proofClients.length > 0 && (
        <div className="border-t border-b border-black/8 py-6 md:py-7">
          <div className="flex items-center justify-center flex-wrap gap-y-2">
            {proofClients.map((name, i) => (
              <span key={name} className="relative font-serif text-[13.5px] md:text-[15.5px] text-ink-3 px-5 md:px-8 tracking-[0.02em]">
                {i > 0 && <span className="absolute left-0 -translate-x-1/2 text-black/15">·</span>}
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── SERVICES ─────────────────────────────── */}
      {services.length > 0 && (
        <section className="py-16 md:py-24 lg:py-32 bg-bg-dark" id="services">
          <div className="max-w-[1160px] mx-auto px-5 sm:px-8 lg:px-12">
            <ScrollReveal>
              <span className="block text-[11px] font-medium tracking-[0.13em] uppercase text-ink-3 mb-10 md:mb-14">
                What we do
              </span>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
              {services.sort((a, b) => a.order - b.order).map((svc, i) => (
                <ScrollReveal key={svc.name} delay={i + 1 as 1 | 2 | 3}>
                  <p className="text-[12px] text-ink-3 mb-4 tracking-[0.04em]">
                    {String(svc.order).padStart(2, '0')}
                  </p>
                  <div className="w-7 h-px bg-accent mb-5" />
                  <h3 className="font-serif text-[22px] tracking-[-0.01em] mb-3">{svc.name}</h3>
                  <p className="text-[14.5px] text-ink-2 leading-[1.75] font-light">{svc.description}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WORK ─────────────────────────────────── */}
      {caseStudies.length > 0 && (
        <section className="pb-16 md:pb-24 lg:pb-32" id="work">
          <div className="max-w-[1160px] mx-auto px-5 sm:px-8 lg:px-12">
            <ScrollReveal>
              <span className="block text-[11px] font-medium tracking-[0.13em] uppercase text-ink-3 mb-10 md:mb-14">
                Selected work
              </span>
            </ScrollReveal>

            {/* Mobile: single column stack */}
            <div className="grid grid-cols-1 gap-5 md:hidden">
              {caseStudies.slice(0, 4).map((cs, i) => {
                const gradients: Record<string, string> = {
                  'img-a': 'from-[#c4d0c4] via-[#e0ddd5] to-[#d0cbbe]',
                  'img-b': 'from-[#bfc6d0] via-[#d9dde5] to-[#c8ccd5]',
                  'img-c': 'from-[#d0c0bc] via-[#e5dad7] to-[#cec0bb]',
                  'img-d': 'from-[#151810] via-[#2b3521] to-[#1a2018]',
                }
                const gradient = gradients[GRADIENT_MAPS[i % 4]]
                return (
                  <ScrollReveal key={cs.id} delay={i <= 2 ? i as 0 | 1 | 2 : 2}>
                    <Link href={`/case-studies/${cs.slug}`} className="group block">
                      <div className="relative overflow-hidden rounded-[3px] aspect-[3/2]">
                        {cs.cover_image_url ? (
                          <Image
                            src={cs.cover_image_url}
                            alt={cs.name}
                            fill
                            sizes="100vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${gradient} transition-transform duration-700 group-hover:scale-[1.04]`} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-5 left-5 right-5 text-white opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <p className="font-serif text-[19px] tracking-[-0.01em]">{cs.name}</p>
                          <p className="text-[12px] opacity-70 mt-0.5 font-light">{cs.tagline}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-start pt-4">
                        <div>
                          <p className="font-serif text-[16px] text-ink mb-0.5">{cs.name}</p>
                          <p className="text-[13px] text-ink-3 font-light">{cs.outcome}</p>
                        </div>
                        <span className="text-[12.5px] text-ink-3 font-light pt-0.5">{cs.year}</span>
                      </div>
                    </Link>
                  </ScrollReveal>
                )
              })}
            </div>

            {/* Desktop: 3-column asymmetric grid */}
            <div className="hidden md:grid grid-cols-3 gap-5">
              {caseStudies.slice(0, 4).map((cs, i) => {
                const isFirst  = i === 0
                const isFourth = i === 3
                const gradients: Record<string, string> = {
                  'img-a': 'from-[#c4d0c4] via-[#e0ddd5] to-[#d0cbbe]',
                  'img-b': 'from-[#bfc6d0] via-[#d9dde5] to-[#c8ccd5]',
                  'img-c': 'from-[#d0c0bc] via-[#e5dad7] to-[#cec0bb]',
                  'img-d': 'from-[#151810] via-[#2b3521] to-[#1a2018]',
                }
                const gradient = gradients[GRADIENT_MAPS[i % 4]]

                return (
                  <ScrollReveal
                    key={cs.id}
                    delay={i === 0 ? 0 : i <= 2 ? 1 : 2}
                    className={`${isFirst ? 'col-span-2' : ''} ${isFourth ? 'col-span-2 col-start-2' : ''}`}
                  >
                    <Link href={`/case-studies/${cs.slug}`} className="group block">
                      <div className={`relative overflow-hidden rounded-[3px] ${
                        isFirst || isFourth ? 'aspect-[3/2]' : 'aspect-[4/3]'
                      }`}>
                        {cs.cover_image_url ? (
                          <Image
                            src={cs.cover_image_url}
                            alt={cs.name}
                            fill
                            sizes={isFirst || isFourth ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${gradient} transition-transform duration-700 group-hover:scale-[1.04]`} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <p className="font-serif text-[21px] tracking-[-0.01em]">{cs.name}</p>
                          <p className="text-[12.5px] opacity-70 mt-0.5 font-light">{cs.tagline}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-start pt-4">
                        <div>
                          <p className="font-serif text-[16px] text-ink mb-0.5">{cs.name}</p>
                          <p className="text-[13px] text-ink-3 font-light">{cs.outcome}</p>
                        </div>
                        <span className="text-[12.5px] text-ink-3 font-light pt-0.5">{cs.year}</span>
                      </div>
                    </Link>
                  </ScrollReveal>
                )
              })}
            </div>

            {caseStudies.length > 4 && (
              <ScrollReveal>
                <div className="mt-12 md:mt-16 flex justify-center md:justify-start">
                  <Link href="/work"
                    className="text-[13.5px] font-medium text-ink border-b border-ink/25 pb-px hover:border-ink/60 transition group inline-flex items-center gap-1.5">
                    View all work
                    <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      {/* ── PROCESS ──────────────────────────────── */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-bg-warm to-[rgba(77,143,106,0.07)]" id="process">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-end mb-16 md:mb-24">
            <div>
              <ScrollReveal>
                <span className="block text-[11px] font-medium tracking-[0.13em] uppercase text-ink-3 mb-7">
                  How we work
                </span>
              </ScrollReveal>
              <ScrollReveal delay={1}>
                <h2 className="font-serif text-[clamp(28px,3.6vw,48px)] leading-[1.14] tracking-[-0.02em]">
                  Process is just discipline<br /><em>made repeatable.</em>
                </h2>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={2}>
              <p className="text-[14.5px] md:text-[15px] text-ink-2 leading-[1.75] font-light max-w-[440px]">
                We don't have a framework to sell you. We have a set of habits that we've found produce good work — refined across five years of shipping products for teams that care about craft.
              </p>
            </ScrollReveal>
          </div>

          {[
            { n: '01', title: 'Understand', body: 'We begin by listening more than talking. What does success look like? Who are we building for? What are the actual constraints? The first week is the most important week of any project.' },
            { n: '02', title: 'Design', body: 'We prototype fast and with low fidelity. The goal isn\'t a beautiful deck — it\'s an honest answer to whether this will work. We\'d rather find the hard problem in Figma than in production.' },
            { n: '03', title: 'Build', body: 'Careful, test-driven development. We move deliberately and document as we go. We prefer simple solutions that age well over clever ones that don\'t.' },
            { n: '04', title: 'Ship', body: 'We don\'t hand over a zip file and disappear. Launch is the beginning of the learning cycle. We stay close for the first month and make sure what we built does what we said it would.' },
          ].map(step => (
            <ScrollReveal key={step.n}>
              <div className="grid grid-cols-[48px_1fr] gap-5 md:grid-cols-[72px_1fr] md:gap-10 py-8 md:py-12 border-t border-black/8 last:border-b last:border-black/8">
                <span className="font-serif text-[34px] md:text-[44px] text-ink-3 leading-none tracking-[-0.03em] pt-1">{step.n}</span>
                <div>
                  <h3 className="font-serif text-[20px] md:text-[22px] tracking-[-0.01em] mb-3">{step.title}</h3>
                  <p className="text-[14px] md:text-[14.5px] text-ink-2 leading-[1.78] max-w-[580px] font-light">{step.body}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────── */}
      {team.length > 0 && (
        <section className="py-16 md:py-24 lg:py-32" id="team">
          <div className="max-w-[1160px] mx-auto px-5 sm:px-8 lg:px-12">
            <ScrollReveal>
              <span className="block text-[11px] font-medium tracking-[0.13em] uppercase text-ink-3 mb-12 md:mb-16">
                The team
              </span>
            </ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 md:gap-7">
              {team.map((member, i) => (
                <ScrollReveal key={member.id} delay={Math.min(i, 3) as 0 | 1 | 2 | 3}>
                  <div>
                    <div
                      className="w-full aspect-[3/4] rounded-[3px] flex items-center justify-center font-serif italic text-[28px] md:text-[36px] text-white/85 mb-4 md:mb-5 overflow-hidden"
                      style={{ background: member.photo_url ? undefined : AVATAR_COLORS[i % 4] }}
                    >
                      {member.photo_url
                        ? <Image src={member.photo_url} alt={member.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
                        : member.name[0]
                      }
                    </div>
                    <p className="font-serif text-[15px] md:text-[17px] text-ink mb-0.5">{member.name}</p>
                    <p className="text-[12.5px] md:text-[13px] text-ink-3 font-light">{member.role}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIAL ──────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-20 md:py-32 lg:py-40 px-5 sm:px-8 lg:px-12 text-center bg-bg-dark">
          <TestimonialCarousel testimonials={testimonials} />
        </section>
      )}

      {/* ── CONTACT CTA ──────────────────────────── */}
      <section className="bg-[#0F0F0D] text-bg py-20 md:py-28 px-5 sm:px-8 lg:px-12 text-center" id="contact">
        <div className="max-w-[1160px] mx-auto">
          <ScrollReveal>
            <span className="block text-[11px] font-medium tracking-[0.13em] uppercase text-bg/35 mb-5">
              Let's work together
            </span>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <h2 className="font-serif text-[clamp(28px,5.6vw,64px)] leading-[1.08] tracking-[-0.026em] max-w-[640px] mx-auto mt-4 mb-4">
              {settings.contact_invite?.includes('worth making')
                ? <>{settings.contact_invite.split('worth making.')[0]}<em>worth making.</em></>
                : settings.contact_invite
              }
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <p className="text-[15px] text-white/40 font-light mb-12">
              Tell us about your project — we'll get back to you within 2 business days.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={3}>
            <InquiryForm />
          </ScrollReveal>
          <ScrollReveal delay={3}>
            <p className="mt-10 text-[12.5px] text-white/25">
              Prefer email?{' '}
              <a href={`mailto:${settings.agency_email}`} className="text-white/40 hover:text-white/60 transition underline underline-offset-2">
                {settings.agency_email}
              </a>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer className="bg-[#0A0A09] py-12 md:py-16 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[1160px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-12 mb-12 md:mb-16">
            <div className="col-span-2 sm:col-span-1">
              <p className="font-serif text-[20px] text-bg/88 mb-3">crafyne</p>
              <p className="text-[13px] text-bg/38 font-light leading-[1.65] max-w-[230px]">
                {settings.agency_tagline}
              </p>
            </div>
            {[
              {
                heading: 'Work',
                links: [
                  { label: 'All work', href: '/work' },
                  ...caseStudies.slice(0, 4).map(cs => ({ label: cs.name, href: `/case-studies/${cs.slug}` })),
                ],
              },
              {
                heading: 'Studio',
                links: [
                  { label: 'Process', href: '/#process' },
                  { label: 'Team',    href: '/#team' },
                  { label: 'Blog',    href: '/blog' },
                ],
              },
              {
                heading: 'Connect',
                links: [
                  ...(settings.footer_instagram_url && settings.footer_instagram_url !== '#' ? [{ label: 'Instagram', href: settings.footer_instagram_url }] : []),
                  ...(settings.footer_facebook_url  && settings.footer_facebook_url  !== '#' ? [{ label: 'Facebook',  href: settings.footer_facebook_url }]  : []),
                  ...(settings.footer_threads_url   && settings.footer_threads_url   !== '#' ? [{ label: 'Threads',   href: settings.footer_threads_url }]   : []),
                  ...(settings.footer_github_url    && settings.footer_github_url    !== '#' ? [{ label: 'GitHub',    href: settings.footer_github_url }]    : []),
                  { label: settings.agency_email ?? 'hello@crafyne.co', href: `mailto:${settings.agency_email}` },
                ],
              },
            ].map(col => (
              <div key={col.heading}>
                <h4 className="text-[10.5px] font-medium tracking-[0.11em] uppercase text-bg/30 mb-4 md:mb-5">{col.heading}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link.label}>
                      <a href={link.href} className="text-[13px] text-bg/50 font-light hover:text-bg/88 transition">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-bg/7 flex flex-col sm:flex-row gap-2 sm:justify-between items-start sm:items-center text-[12px] text-bg/28 font-light">
            <span>&copy; {new Date().getFullYear()} {settings.footer_copyright ?? 'Crafyne Studio. All rights reserved.'}</span>
            <div className="flex items-center gap-5">
              <Link href="/privacy" className="hover:text-bg/50 transition">Privacy</Link>
              <span>{settings.agency_location}</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
