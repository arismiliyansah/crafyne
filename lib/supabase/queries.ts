import { createClient, createStaticClient } from './server'
import type { CaseStudy, Post, TeamMember, Testimonial, SiteSettings, Service, Stat, PricingTier, TechGroup, Faq } from './types'

export async function getSettings(): Promise<SiteSettings> {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('key, value')
  if (!data) return {}
  return Object.fromEntries((data as { key: string; value: string | null }[]).map(r => [r.key, r.value ?? '']))
}

export async function getServiceCards(): Promise<Service[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('services').select('*').eq('active', true).order('display_order', { ascending: true })
  return (data ?? []) as Service[]
}

export async function getStats(): Promise<Stat[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('stats').select('*').order('display_order', { ascending: true })
  return (data ?? []) as Stat[]
}

export async function getPricingTiers(): Promise<PricingTier[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('pricing_tiers').select('*').order('display_order', { ascending: true })
  return (data ?? []) as PricingTier[]
}

export async function getTechGroups(): Promise<TechGroup[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('tech_groups').select('*').order('display_order', { ascending: true })
  return (data ?? []) as TechGroup[]
}

export async function getFaqs(): Promise<Faq[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('faqs').select('*').order('display_order', { ascending: true })
  return (data ?? []) as Faq[]
}

export async function getCaseStudies(publishedOnly = true, isStatic = false): Promise<CaseStudy[]> {
  const supabase = isStatic ? createStaticClient() : await createClient()
  let query = supabase.from('case_studies').select('*').order('display_order', { ascending: true })
  if (publishedOnly) query = query.eq('published', true)
  const { data } = await query
  return (data ?? []) as CaseStudy[]
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('case_studies')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  return (data ?? null) as CaseStudy | null
}

export async function getPosts(publishedOnly = true, isStatic = false, limit?: number): Promise<Omit<Post, 'content'>[]> {
  const supabase = isStatic ? createStaticClient() : await createClient()
  let query = supabase
    .from('posts')
    .select('id, slug, title, excerpt, cover_image_url, published, published_at, created_at')
    .order('published_at', { ascending: false })
  if (publishedOnly) query = query.eq('published', true)
  if (limit) query = query.limit(limit)
  const { data } = await query
  return (data ?? []) as Omit<Post, 'content'>[]
}

export async function getPostsWithCount(limit: number, publishedOnly = true): Promise<{ posts: Omit<Post, 'content'>[]; total: number }> {
  const supabase = await createClient()
  let query = supabase
    .from('posts')
    .select('id, slug, title, excerpt, cover_image_url, published, published_at, created_at', { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(0, limit - 1)
  if (publishedOnly) query = query.eq('published', true)
  const { data, count } = await query
  return {
    posts: (data ?? []) as Omit<Post, 'content'>[],
    total: count ?? 0,
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  return (data ?? null) as Post | null
}

export async function getTeam(): Promise<TeamMember[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true })
  return (data ?? []) as TeamMember[]
}

export async function getFeaturedTestimonial(): Promise<Testimonial | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('featured', true)
    .order('display_order', { ascending: true })
    .limit(1)
    .single()
  return (data ?? null) as Testimonial | null
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })
  return (data ?? []) as Testimonial[]
}
