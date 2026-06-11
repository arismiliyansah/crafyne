import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getCaseStudyBySlug, getCaseStudies, getSettings } from '@/lib/supabase/queries'
import Nav from '@/components/public/landing/Nav'
import Footer from '@/components/public/landing/Footer'
import RevealController from '@/components/public/landing/RevealController'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const items = await getCaseStudies(true, true)
    return items.map(cs => ({ slug: cs.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cs = await getCaseStudyBySlug(slug)
  if (!cs) return { title: 'Project' }

  const ogImage = cs.cover_image_url
    ? [{ url: cs.cover_image_url, width: 1200, height: 630, alt: cs.name }]
    : [{ url: '/og-image.png', width: 1200, height: 630, alt: cs.name }]

  return {
    title: cs.name,
    description: cs.outcome ?? cs.summary ?? '',
    alternates: { canonical: `/work/${slug}` },
    openGraph: { type: 'article', title: cs.name, description: cs.outcome ?? '', images: ogImage },
    twitter: { card: 'summary_large_image', images: ogImage.map(i => i.url) },
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [cs, all, settings] = await Promise.all([getCaseStudyBySlug(slug), getCaseStudies(true), getSettings()])
  if (!cs) notFound()

  const idx = all.findIndex(c => c.slug === slug)
  const nextCs = idx >= 0 && all.length > 1 ? all[(idx + 1) % all.length] : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: cs.name,
    description: cs.outcome ?? undefined,
    image: cs.cover_image_url ?? undefined,
    dateCreated: cs.year ? String(cs.year) : undefined,
    creator: { '@type': 'Organization', name: 'Crafyne', url: 'https://crafyne.com' },
    keywords: cs.tags?.length ? cs.tags.join(', ') : undefined,
    url: `https://crafyne.com/work/${cs.slug}`,
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://crafyne.com' },
      { '@type': 'ListItem', position: 2, name: 'Work', item: 'https://crafyne.com/work' },
      { '@type': 'ListItem', position: 3, name: cs.name, item: `https://crafyne.com/work/${cs.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Nav email={settings.agency_email ?? 'hello@crafyne.studio'} />
      <RevealController />
      <main>
        <section className="pageHero pageHero--ink">
          <div className="wrap">
            <div className="pageHero__crumb reveal">
              <Link href="/">Crafyne</Link><span>/</span><Link href="/work">Work</Link><span>/</span><span>{cs.name}</span>
            </div>
            <div className="pageHero__eyebrow reveal">/ {cs.kind ?? cs.tagline ?? 'case study'} · {cs.year}</div>
            <h1 className="pageHero__title reveal" data-d="1">{cs.name}</h1>
            {(cs.outcome || cs.summary) && (
              <p className="pageHero__sub reveal" data-d="2">{cs.summary ?? cs.outcome}</p>
            )}
          </div>
        </section>

        <div className="wrap" style={{ maxWidth: 820, paddingTop: 56, paddingBottom: 96 }}>
          {cs.cover_image_url && (
            <div className="reveal" style={{ position: 'relative', aspectRatio: '16 / 8', borderRadius: 8, overflow: 'hidden', marginBottom: 48 }}>
              <Image src={cs.cover_image_url} alt={cs.name} fill sizes="(max-width: 900px) 100vw, 820px" className="object-cover" />
            </div>
          )}

          {cs.tags?.length > 0 && (
            <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
              {cs.tags.map(tag => (<span key={tag} className="chip">{tag}</span>))}
            </div>
          )}

          <div className="prose-crafyne reveal">
            {cs.challenge && (<><h2>The Challenge</h2><p style={{ whiteSpace: 'pre-wrap' }}>{cs.challenge}</p></>)}
            {cs.solution && (<><h2>The Solution</h2><p style={{ whiteSpace: 'pre-wrap' }}>{cs.solution}</p></>)}
          </div>

          {cs.gallery_urls?.length > 0 && (
            <section style={{ marginTop: 56 }}>
              <h2 className="display" style={{ fontSize: 24, marginBottom: 20 }}>Project shots</h2>
              <div style={{ position: 'relative', aspectRatio: '16 / 10', borderRadius: 6, overflow: 'hidden', marginBottom: 14, background: 'var(--paper)' }}>
                <Image src={cs.gallery_urls[0]} alt={`${cs.name} — shot 1`} fill sizes="(max-width: 900px) 100vw, 820px" className="object-cover" />
              </div>
              {cs.gallery_urls.length > 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                  {cs.gallery_urls.slice(1).map((url, i) => (
                    <div key={i} style={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: 6, overflow: 'hidden', background: 'var(--paper)' }}>
                      <Image src={url} alt={`${cs.name} — shot ${i + 2}`} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {cs.project_url && (
            <div style={{ marginTop: 48 }}>
              <a href={cs.project_url} target="_blank" rel="noopener noreferrer" className="btn btn--ink">
                View live project
                <span className="btn__arrow" aria-hidden="true">
                  <svg viewBox="0 0 12 12"><path d="M3 9 9 3M9 3H4M9 3v5" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
                </span>
              </a>
            </div>
          )}

          {nextCs && (
            <section style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--hair)' }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>/ next project</div>
              <Link href={`/work/${nextCs.slug}`} className="caseNext">
                <span className="display" style={{ fontSize: 28 }}>{nextCs.name}</span>
                <span className="mono">Read →</span>
              </Link>
            </section>
          )}
        </div>

        <section className="cta section--tight" id="contact">
          <div className="wrap">
            <div className="cta__panel">
              <div className="cta__bg" aria-hidden="true"><span className="cta__blob cta__blob--a" /><span className="cta__blob cta__blob--b" /></div>
              <div className="cta__inner">
                <div className="cta__copy">
                  <span className="eyebrow cta__eye reveal">/ like what you see?</span>
                  <h2 className="cta__title display reveal" data-d="1">Let&rsquo;s build <span className="italic">yours.</span></h2>
                  <p className="cta__sub reveal" data-d="2">Tell us about the project. We reply within one working day.</p>
                  <div className="cta__row reveal" data-d="3">
                    <Link className="btn btn--orange" href="/#contact">
                      Start a project
                      <span className="btn__arrow" aria-hidden="true">
                        <svg viewBox="0 0 12 12"><path d="M3 9 9 3M9 3H4M9 3v5" stroke="#0E1530" strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
                      </span>
                    </Link>
                    <a className="cta__mail mono" href={`mailto:${settings.agency_email ?? 'hello@crafyne.studio'}`}>{settings.agency_email ?? 'hello@crafyne.studio'}</a>
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
