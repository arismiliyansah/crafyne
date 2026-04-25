import { MetadataRoute } from 'next'
import { createStaticClient } from '@/lib/supabase/server'

const BASE_URL = 'https://crafyne.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient()

  const [{ data: posts }, { data: caseStudies }] = await Promise.all([
    supabase
      .from('posts')
      .select('slug, updated_at')
      .eq('published', true)
      .order('published_at', { ascending: false }),
    supabase
      .from('case_studies')
      .select('slug, updated_at')
      .eq('published', true),
  ])

  const blogPosts: MetadataRoute.Sitemap = (posts ?? []).map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const caseStudyPages: MetadataRoute.Sitemap = (caseStudies ?? []).map(cs => ({
    url: `${BASE_URL}/case-studies/${cs.slug}`,
    lastModified: new Date(cs.updated_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/work`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...caseStudyPages,
    ...blogPosts,
  ]
}
