/**
 * Query untuk halaman publik.
 *
 * Semuanya memakai createStaticClient() — client Supabase tanpa cookies.
 * Ini disengaja: memanggil cookies() di dalam page akan memaksa rute jadi
 * dynamic rendering, dan `export const revalidate` di halaman jadi mubazir.
 * Tanpa cookies, halaman publik bisa di-prerender dan di-ISR seperti mestinya.
 *
 * Konsekuensinya semua query di sini berjalan sebagai role `anon`, jadi RLS
 * yang menentukan apa yang terlihat (published = true, active = true, dst).
 * Halaman admin TIDAK memakai file ini — mereka query langsung dengan
 * createClient() yang membawa sesi.
 */
import { createStaticClient } from './server'
import type { CaseStudy, Post, TeamMember, Testimonial, SiteSettings, Service, Stat, PricingTier, TechGroup, Faq } from './types'

type PostPreview = Omit<Post, 'content'>

const POST_PREVIEW_COLUMNS = 'id, slug, title, excerpt, cover_image_url, published, published_at, created_at'

export async function getSettings(): Promise<SiteSettings> {
  const supabase = createStaticClient()
  const { data } = await supabase.from('site_settings').select('key, value')
  if (!data) return {}
  return Object.fromEntries(data.map(r => [r.key, r.value ?? '']))
}

export async function getServiceCards(): Promise<Service[]> {
  const supabase = createStaticClient()
  const { data } = await supabase.from('services').select('*').eq('active', true).order('display_order', { ascending: true })
  return data ?? []
}

export async function getStats(): Promise<Stat[]> {
  const supabase = createStaticClient()
  const { data } = await supabase.from('stats').select('*').order('display_order', { ascending: true })
  return data ?? []
}

export async function getPricingTiers(): Promise<PricingTier[]> {
  const supabase = createStaticClient()
  const { data } = await supabase.from('pricing_tiers').select('*').order('display_order', { ascending: true })
  return data ?? []
}

export async function getTechGroups(): Promise<TechGroup[]> {
  const supabase = createStaticClient()
  const { data } = await supabase.from('tech_groups').select('*').order('display_order', { ascending: true })
  return data ?? []
}

export async function getFaqs(): Promise<Faq[]> {
  const supabase = createStaticClient()
  const { data } = await supabase.from('faqs').select('*').order('display_order', { ascending: true })
  return data ?? []
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from('case_studies')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true })
  return data ?? []
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from('case_studies')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()
  return data ?? null
}

export async function getPosts(limit?: number): Promise<PostPreview[]> {
  const supabase = createStaticClient()
  let query = supabase
    .from('posts')
    .select(POST_PREVIEW_COLUMNS)
    .eq('published', true)
    .order('published_at', { ascending: false })
  if (limit) query = query.limit(limit)
  const { data } = await query
  return (data ?? []) as PostPreview[]
}

export async function getPostsWithCount(limit: number): Promise<{ posts: PostPreview[]; total: number }> {
  const supabase = createStaticClient()
  const { data, count } = await supabase
    .from('posts')
    .select(POST_PREVIEW_COLUMNS, { count: 'exact' })
    .eq('published', true)
    .order('published_at', { ascending: false })
    .range(0, limit - 1)
  return {
    posts: (data ?? []) as PostPreview[],
    total: count ?? 0,
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()
  return data ?? null
}

export async function getTeam(): Promise<TeamMember[]> {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true })
  return data ?? []
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })
  return data ?? []
}
