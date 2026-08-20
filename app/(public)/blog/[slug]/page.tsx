import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getPostBySlug, getPosts, getSettings } from '@/lib/supabase/queries'
import Nav from '@/components/public/landing/Nav'
import Footer from '@/components/public/landing/Footer'
import RevealController from '@/components/public/landing/RevealController'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const posts = await getPosts()
    return posts.map(p => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Journal' }

  const ogImage = post.cover_image_url
    ? [{ url: post.cover_image_url, width: 1200, height: 630, alt: post.title }]
    : [{ url: '/og-image.png?v=2', width: 1200, height: 630, alt: post.title }]

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
    twitter: { card: 'summary_large_image', images: ogImage.map(i => i.url) },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSettings()])
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
      { '@type': 'ListItem', position: 2, name: 'Journal', item: 'https://crafyne.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://crafyne.com/blog/${post.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Nav email={settings.agency_email ?? 'contact@crafyne.com'} />
      <RevealController />
      <main>
        <section className="pageHero pageHero--ink">
          <div className="wrap">
            <div className="pageHero__crumb reveal">
              <Link href="/">Crafyne</Link><span>/</span><Link href="/blog">Journal</Link><span>/</span><span>{post.title}</span>
            </div>
            <div className="pageHero__eyebrow reveal">
              / {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'draft'}
            </div>
            <h1 className="pageHero__title reveal" data-d="1">{post.title}</h1>
            {post.excerpt && <p className="pageHero__sub reveal" data-d="2">{post.excerpt}</p>}
          </div>
        </section>

        <div className="wrap" style={{ maxWidth: 760, paddingTop: 56, paddingBottom: 96 }}>
          {post.cover_image_url && (
            <div className="reveal" style={{ position: 'relative', aspectRatio: '16 / 7', borderRadius: 8, overflow: 'hidden', marginBottom: 48 }}>
              <Image src={post.cover_image_url} alt={post.title} fill sizes="(max-width: 800px) 100vw, 760px" className="object-cover" />
            </div>
          )}
          {post.content && (
            <div className="prose-crafyne reveal" dangerouslySetInnerHTML={{ __html: post.content }} />
          )}
        </div>
      </main>
      <Footer settings={settings} />
    </>
  )
}
