'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Post } from '@/lib/supabase/types'

const PAGE_SIZE = 6
type PostPreview = Omit<Post, 'content'>
const TONES = ['crimson', 'peach', 'navy', 'orange', 'navy-2'] as const

export default function BlogList({ initialPosts, initialTotal }: {
  initialPosts: PostPreview[]
  initialTotal: number
}) {
  const [posts, setPosts] = useState<PostPreview[]>(initialPosts)
  const [total, setTotal] = useState(initialTotal)
  const [isPending, startTransition] = useTransition()
  const hasMore = posts.length < total

  function loadMore() {
    startTransition(async () => {
      const supabase = createClient()
      const { data, count } = await supabase
        .from('posts')
        .select('id, slug, title, excerpt, cover_image_url, published, published_at, created_at', { count: 'exact' })
        .eq('published', true)
        .order('published_at', { ascending: false })
        .range(posts.length, posts.length + PAGE_SIZE - 1)
      if (data) {
        setPosts(prev => [...prev, ...data as PostPreview[]])
        if (count !== null) setTotal(count)
      }
    })
  }

  return (
    <>
      <div className="jrnList__grid">
        {posts.map((post, i) => (
          <Link className="article reveal" data-d={(i % 3) + 1} key={post.id} href={`/blog/${post.slug}`}>
            <div className={`article__visual article__visual--${TONES[i % TONES.length]}`}>
              {post.cover_image_url
                ? <Image src={post.cover_image_url} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                : <span className="article__visualBig">{post.title[0]}</span>}
            </div>
            <div className="article__body">
              <span className="article__tag">
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'Draft'}
              </span>
              <h3 className="article__title">{post.title}</h3>
              {post.excerpt && <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--ink-soft)', margin: 0 }}>{post.excerpt}</p>}
              <div className="article__meta"><span>Read</span><span>→</span></div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center' }}>
          <button onClick={loadMore} disabled={isPending} className="btn btn--ghost" style={{ opacity: isPending ? 0.5 : 1 }}>
            {isPending ? 'Loading…' : `Load more (${total - posts.length} remaining)`}
          </button>
        </div>
      )}
    </>
  )
}
