'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Post } from '@/lib/supabase/types'

const PAGE_SIZE = 5

type PostPreview = Omit<Post, 'content'>

export default function BlogList({ initialPosts, initialTotal }: {
  initialPosts: PostPreview[]
  initialTotal: number
}) {
  const [posts, setPosts]         = useState<PostPreview[]>(initialPosts)
  const [total, setTotal]         = useState(initialTotal)
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
    <div>
      <div className="space-y-0 divide-y divide-black/8">
        {posts.map(post => (
          <Link key={post.id} href={`/blog/${post.slug}`}
            className="group flex flex-col py-8 hover:opacity-80 transition">
            <p className="text-[12px] text-ink-3 mb-3 font-light">
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                : ''}
            </p>
            <h2 className="font-serif text-[22px] tracking-[-0.01em] mb-3 group-hover:text-ink-2 transition">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-[14.5px] text-ink-2 leading-[1.7] font-light max-w-[560px]">{post.excerpt}</p>
            )}
            <span className="mt-4 text-[13px] text-accent inline-flex items-center gap-1.5">
              Read <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="text-[13.5px] font-medium text-ink border border-black/20 px-8 py-3 rounded-full
              hover:bg-ink hover:text-bg hover:border-ink transition disabled:opacity-40 disabled:cursor-not-allowed">
            {isPending ? 'Loading…' : `Load more (${total - posts.length} remaining)`}
          </button>
        </div>
      )}
    </div>
  )
}
