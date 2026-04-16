import { createStaticClient } from '@/lib/supabase/server'

const BASE_URL = 'https://crafyne.com'

export async function GET() {
  const supabase = createStaticClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('slug, title, excerpt, published_at, updated_at')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(20)

  const items = (posts ?? []).map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.published_at ?? post.updated_at).toUTCString()}</pubDate>
      ${post.excerpt ? `<description><![CDATA[${post.excerpt}]]></description>` : ''}
    </item>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Crafyne Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Thoughts on software, design, and craft from the Crafyne studio.</description>
    <language>en</language>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
