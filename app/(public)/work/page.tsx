import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCaseStudies } from '@/lib/supabase/queries'
import Nav from '@/components/public/Nav'
import ScrollReveal from '@/components/public/ScrollReveal'
import BackToTop from '@/components/public/BackToTop'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Selected case studies from Crafyne — software products built for teams that care about craft.',
  alternates: { canonical: '/work' },
  openGraph: {
    type: 'website',
    title: 'Work — Crafyne',
    description:
      'Selected case studies from Crafyne — software products built for teams that care about craft.',
    url: '/work',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Selected work — Crafyne' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.png'] },
}

const GRADIENTS = [
  'from-[#c4d0c4] via-[#e0ddd5] to-[#d0cbbe]',
  'from-[#bfc6d0] via-[#d9dde5] to-[#c8ccd5]',
  'from-[#d0c0bc] via-[#e5dad7] to-[#cec0bb]',
  'from-[#151810] via-[#2b3521] to-[#1a2018]',
]

export default async function WorkPage() {
  const all = await getCaseStudies()
  const items = [...all].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || a.display_order - b.display_order,
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Selected Work',
    description: 'Software products Crafyne has shipped for teams that care about craft.',
    url: 'https://crafyne.com/work',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((cs, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://crafyne.com/work/${cs.slug}`,
        name: cs.name,
      })),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <BackToTop />
      <main className="pt-28 md:pt-36 pb-20 md:pb-32">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 lg:px-12">

          <ScrollReveal>
            <span className="block text-[11px] font-medium tracking-[0.13em] uppercase text-ink-3 mb-6">
              Selected Work
            </span>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <h1 className="font-serif text-[clamp(32px,5vw,56px)] leading-[1.08] tracking-[-0.025em] mb-6 max-w-[720px]">
              Software we&apos;ve shipped,<br /><em>with the teams who shipped it.</em>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <p className="text-[15px] md:text-[16px] text-ink-2 font-light leading-[1.7] max-w-[520px] mb-16 md:mb-24">
              A small selection of recent projects — each represents a real partnership with a team that cared about getting the details right.
            </p>
          </ScrollReveal>

          {items.length === 0 ? (
            <p className="text-[15px] text-ink-3 font-light">No case studies yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {items.map((cs, i) => {
                const gradient = GRADIENTS[i % GRADIENTS.length]
                return (
                  <ScrollReveal key={cs.id} delay={Math.min(i, 3) as 0 | 1 | 2 | 3}>
                    <Link href={`/work/${cs.slug}`} className="group block">
                      <div className="relative overflow-hidden rounded-[3px] aspect-[4/3]">
                        {cs.cover_image_url ? (
                          <Image
                            src={cs.cover_image_url}
                            alt={cs.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${gradient} transition-transform duration-700 group-hover:scale-[1.04]`} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {cs.featured && (
                          <span className="absolute top-3 left-3 text-[10px] bg-white/90 text-ink px-2 py-0.5 rounded-full uppercase tracking-wide font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-start pt-4">
                        <div>
                          <p className="font-serif text-[16px] text-ink mb-0.5">{cs.name}</p>
                          <p className="text-[13px] text-ink-3 font-light">{cs.outcome ?? cs.tagline}</p>
                        </div>
                        <span className="text-[12.5px] text-ink-3 font-light pt-0.5">{cs.year}</span>
                      </div>
                    </Link>
                  </ScrollReveal>
                )
              })}
            </div>
          )}

        </div>
      </main>
    </>
  )
}
