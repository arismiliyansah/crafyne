import type { Metadata } from 'next'
import { getPostsWithCount } from '@/lib/supabase/queries'
import Nav from '@/components/public/Nav'
import BlogList from '@/components/public/BlogList'

export const revalidate = 60
export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on software, design, and craft from the Crafyne team.',
  alternates: {
    canonical: '/blog',
    types: { 'application/rss+xml': '/feed.xml' },
  },
  openGraph: {
    type: 'website',
    title: 'Blog — Crafyne',
    description: 'Thoughts on software, design, and craft from the Crafyne team.',
    url: '/blog',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Crafyne Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
}

const PAGE_SIZE = 5

export default async function BlogPage() {
  const { posts, total } = await getPostsWithCount(PAGE_SIZE)

  return (
    <>
      <Nav />
      <main className="pt-36 pb-32">
        <div className="max-w-[760px] mx-auto px-5 sm:px-8">
          <span className="block text-[11px] font-medium tracking-[0.13em] uppercase text-ink-3 mb-10">Blog</span>
          <h1 className="font-serif text-[clamp(32px,4.5vw,56px)] leading-[1.08] tracking-[-0.025em] mb-16">
            Thoughts on software,<br /><em>design, and craft.</em>
          </h1>

          {total === 0 ? (
            <p className="text-[15px] text-ink-3 font-light">No posts yet.</p>
          ) : (
            <BlogList initialPosts={posts} initialTotal={total} />
          )}
        </div>
      </main>
    </>
  )
}
