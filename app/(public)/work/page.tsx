import type { Metadata } from 'next'
import Link from 'next/link'
import { getCaseStudies, getSettings } from '@/lib/supabase/queries'
import Nav from '@/components/public/landing/Nav'
import Footer from '@/components/public/landing/Footer'
import RevealController from '@/components/public/landing/RevealController'
import WorkIndexGrid from '@/components/public/landing/WorkIndexGrid'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected case studies from Crafyne — software products built for teams that care about craft.',
  alternates: { canonical: '/work' },
  openGraph: {
    type: 'website',
    title: 'Work — Crafyne',
    description: 'Selected case studies from Crafyne — software products built for teams that care about craft.',
    url: '/work',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Selected work — Crafyne' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.png'] },
}

export default async function WorkPage() {
  const [all, settings] = await Promise.all([getCaseStudies(), getSettings()])
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
      <Nav email={settings.agency_email ?? 'contact@crafyne.com'} />
      <RevealController />
      <main>
        <section className="pageHero pageHero--crimson">
          <div className="wrap">
            <div className="pageHero__crumb reveal">
              <Link href="/">Crafyne</Link><span>/</span><span>Work</span>
            </div>
            <div className="pageHero__eyebrow reveal">/ selected work</div>
            <h1 className="pageHero__title reveal" data-d="1">
              Things we <span className="italic">shipped</span> and<br />still feel good about.
            </h1>
            <p className="pageHero__sub reveal" data-d="2">
              A selection of recent partnerships — each a real collaboration with a team that cared about getting the details right.
            </p>
          </div>
        </section>

        {items.length === 0 ? (
          <div className="wrap" style={{ padding: '90px 0' }}>
            <p className="mono" style={{ color: 'var(--mute)' }}>No case studies yet.</p>
          </div>
        ) : (
          <WorkIndexGrid cases={items} />
        )}
      </main>
      <Footer settings={settings} />
    </>
  )
}
