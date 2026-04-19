import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getPostBySlug, getPosts } from '@/lib/supabase/queries'
import Nav from '@/components/public/Nav'
import BackToTop from '@/components/public/BackToTop'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const posts = await getPosts(true, true)
    return posts.map(p => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Blog' }

  const ogImage = post.cover_image_url
    ? [{ url: post.cover_image_url, width: 1200, height: 630, alt: post.title }]
    : [{ url: '/og-image.png', width: 1200, height: 630, alt: post.title }]

  return {
    title: post.title,
    description: post.excerpt ?? '',
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt ?? '',
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      images: ogImage,
    },
    twitter: {
      card: 'summary_large_image',
      images: ogImage.map(i => i.url),
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_image_url ?? undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: { '@type': 'Organization', name: 'Crafyne', url: 'https://crafyne.com' },
    publisher: { '@type': 'Organization', name: 'Crafyne', url: 'https://crafyne.com' },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://crafyne.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://crafyne.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://crafyne.com/blog/${post.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Nav />
      <BackToTop />
      <main className="pt-28 pb-32">
        <div className="max-w-[720px] mx-auto px-8">

          <Link href="/blog" className="text-[13px] text-ink-3 hover:text-ink transition mb-12 inline-flex items-center gap-1.5">
            ← Writing
          </Link>

          <div className="mt-6 mb-14">
            <p className="text-[12px] font-medium tracking-[0.11em] uppercase text-ink-3 mb-5">
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                : ''}
            </p>
            <h1 className="font-serif text-[clamp(30px,4.5vw,52px)] leading-[1.1] tracking-[-0.025em]">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 text-[17px] text-ink-2 font-light leading-[1.65]">{post.excerpt}</p>
            )}
          </div>

          {post.cover_image_url && (
            <div className="relative mb-12 rounded-[4px] overflow-hidden aspect-[16/7]">
              <Image src={post.cover_image_url} alt={post.title} fill sizes="(max-width: 768px) 100vw, 720px" className="object-cover" />
            </div>
          )}

          {post.content && (
            <div
              className="prose-crafyne text-[15.5px] text-ink-2 leading-[1.82] font-light"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

        </div>
      </main>
    </>
  )
}
