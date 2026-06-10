import type { Metadata } from 'next'
import Link from 'next/link'
import { getPostsWithCount, getSettings } from '@/lib/supabase/queries'
import Nav from '@/components/public/landing/Nav'
import Footer from '@/components/public/landing/Footer'
import RevealController from '@/components/public/landing/RevealController'
import BlogList from '@/components/public/BlogList'

export const revalidate = 60
export const metadata: Metadata = {
  title: 'Journal',
  description: 'Notes on software, design, and craft from the Crafyne team.',
  alternates: {
    canonical: '/blog',
    types: { 'application/rss+xml': '/feed.xml' },
  },
  openGraph: {
    type: 'website',
    title: 'Journal — Crafyne',
    description: 'Notes on software, design, and craft from the Crafyne team.',
    url: '/blog',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Crafyne Journal' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.png'] },
}

const PAGE_SIZE = 6

export default async function BlogPage() {
  const [{ posts, total }, settings] = await Promise.all([getPostsWithCount(PAGE_SIZE), getSettings()])

  return (
    <>
      <Nav email={settings.agency_email ?? 'hello@crafyne.studio'} />
      <RevealController />
      <main>
        <section className="pageHero pageHero--ink">
          <div className="wrap">
            <div className="pageHero__crumb reveal">
              <Link href="/">Crafyne</Link><span>/</span><span>Journal</span>
            </div>
            <div className="pageHero__eyebrow reveal">/ writing from the studio</div>
            <h1 className="pageHero__title reveal" data-d="1">
              What we&rsquo;re <span className="italic">thinking about.</span>
            </h1>
            <p className="pageHero__sub reveal" data-d="2">
              Notes on engineering, design, and how to run a studio that ships — written by the team, posted when ready.
            </p>
          </div>
        </section>

        <section className="jrnList">
          <div className="wrap">
            {total === 0
              ? <p className="mono" style={{ color: 'var(--mute)' }}>No posts yet.</p>
              : <BlogList initialPosts={posts} initialTotal={total} />}
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  )
}
