import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getCaseStudyBySlug, getCaseStudies } from '@/lib/supabase/queries'
import Nav from '@/components/public/Nav'
import BackToTop from '@/components/public/BackToTop'

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
  if (!cs) return { title: 'Case Study' }

  const ogImage = cs.cover_image_url
    ? [{ url: cs.cover_image_url, width: 1200, height: 630, alt: cs.name }]
    : [{ url: '/og-image.png', width: 1200, height: 630, alt: cs.name }]

  return {
    title: cs.name,
    description: cs.outcome ?? '',
    alternates: { canonical: `/case-studies/${slug}` },
    openGraph: {
      type: 'article',
      title: cs.name,
      description: cs.outcome ?? '',
      images: ogImage,
    },
    twitter: {
      card: 'summary_large_image',
      images: ogImage.map(i => i.url),
    },
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [cs, all] = await Promise.all([getCaseStudyBySlug(slug), getCaseStudies(true)])
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
    url: `https://crafyne.com/case-studies/${cs.slug}`,
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://crafyne.com' },
      { '@type': 'ListItem', position: 2, name: 'Work', item: 'https://crafyne.com/work' },
      { '@type': 'ListItem', position: 3, name: cs.name, item: `https://crafyne.com/case-studies/${cs.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Nav />
      <BackToTop />
      <main className="pt-24 md:pt-28 pb-20 md:pb-32">
        <div className="max-w-[860px] mx-auto px-5 sm:px-8">

          {/* Back */}
          <Link href="/work" className="text-[13px] text-ink-3 hover:text-ink transition mb-10 md:mb-12 inline-flex items-center gap-1.5">
            ← Work
          </Link>

          {/* Header */}
          <div className="mt-6 mb-12 md:mb-16">
            <p className="text-[12px] font-medium tracking-[0.11em] uppercase text-accent mb-4">{cs.year}</p>
            <h1 className="font-serif text-[clamp(36px,5vw,64px)] leading-[1.08] tracking-[-0.025em] mb-3">{cs.name}</h1>
            {cs.tagline && (
              <p className="text-[15px] md:text-[16px] text-ink-3 font-light mb-4">{cs.tagline}</p>
            )}
            {cs.outcome && (
              <p className="text-[18px] text-ink-2 font-light leading-[1.6]">{cs.outcome}</p>
            )}
          </div>

          {/* Cover */}
          {cs.cover_image_url && (
            <div className="relative mb-12 md:mb-16 rounded-[4px] overflow-hidden aspect-[16/9] md:aspect-[16/8]">
              <Image src={cs.cover_image_url} alt={cs.name} fill sizes="(max-width: 768px) 100vw, 860px" className="object-cover" />
            </div>
          )}

          {/* Tags */}
          {cs.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10 md:mb-14">
              {cs.tags.map(tag => (
                <span key={tag} className="text-[12px] text-ink-3 bg-black/5 px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="space-y-10 md:space-y-14">
            {cs.challenge && (
              <section>
                <h2 className="font-serif text-[20px] md:text-[22px] tracking-[-0.01em] mb-4 md:mb-5">The Challenge</h2>
                <p className="text-[15px] md:text-[15.5px] text-ink-2 leading-[1.75] md:leading-[1.78] font-light whitespace-pre-wrap">{cs.challenge}</p>
              </section>
            )}
            {cs.solution && (
              <section>
                <h2 className="font-serif text-[20px] md:text-[22px] tracking-[-0.01em] mb-4 md:mb-5">The Solution</h2>
                <p className="text-[15px] md:text-[15.5px] text-ink-2 leading-[1.75] md:leading-[1.78] font-light whitespace-pre-wrap">{cs.solution}</p>
              </section>
            )}
          </div>

          {/* Gallery */}
          {cs.gallery_urls?.length > 0 && (
            <section className="mt-14 md:mt-20">
              <h2 className="font-serif text-[20px] md:text-[22px] tracking-[-0.01em] mb-6 md:mb-8">Project shots</h2>

              {/* Hero shot — first image */}
              <div className="relative mb-3 sm:mb-4 rounded-[4px] overflow-hidden aspect-[16/10] bg-black/[0.04]">
                <Image
                  src={cs.gallery_urls[0]}
                  alt={`${cs.name} — project shot 1`}
                  fill
                  sizes="(max-width: 768px) 100vw, 860px"
                  className="object-cover"
                />
              </div>

              {/* Remaining shots — 2-col grid */}
              {cs.gallery_urls.length > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {cs.gallery_urls.slice(1).map((url, i) => (
                    <div key={i} className="relative aspect-[4/3] rounded-[3px] overflow-hidden bg-black/[0.04]">
                      <Image
                        src={url}
                        alt={`${cs.name} — project shot ${i + 2}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Live project link */}
          {cs.project_url && (
            <div className="mt-12 md:mt-14 pt-8 md:pt-10 border-t border-black/8">
              <a
                href={cs.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[14px] font-medium text-ink border-b border-ink/25 pb-px hover:border-ink/60 transition group"
              >
                View live project
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          )}

          {/* Next case study */}
          {nextCs && (
            <section className="mt-14 md:mt-20 pt-8 md:pt-10 border-t border-black/8">
              <p className="text-[11px] font-medium tracking-[0.13em] uppercase text-ink-3 mb-5">Next project</p>
              <Link href={`/case-studies/${nextCs.slug}`} className="group flex items-center justify-between gap-6">
                <div className="min-w-0">
                  <p className="font-serif text-[22px] md:text-[28px] tracking-[-0.01em] mb-1 group-hover:text-ink-2 transition truncate">
                    {nextCs.name}
                  </p>
                  {nextCs.tagline && (
                    <p className="text-[13px] md:text-[14px] text-ink-3 font-light truncate">{nextCs.tagline}</p>
                  )}
                </div>
                <span className="flex-shrink-0 text-[13px] md:text-[14px] text-ink-3 group-hover:text-ink transition flex items-center gap-1.5">
                  Read
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </section>
          )}

          {/* Contact CTA */}
          <section className="mt-16 md:mt-24 pt-10 md:pt-14 border-t border-black/8 text-center">
            <h2 className="font-serif text-[clamp(24px,3.6vw,38px)] leading-[1.15] tracking-[-0.02em] mb-6 max-w-[480px] mx-auto">
              Like what you see?<br /><em>Let&apos;s build yours.</em>
            </h2>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 bg-ink text-bg px-7 py-3.5 rounded-full text-[14px] font-medium hover:opacity-80 transition group"
            >
              Start a project
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </section>

        </div>
      </main>
    </>
  )
}
