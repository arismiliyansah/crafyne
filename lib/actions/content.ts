'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// ── Work / Case Studies ──────────────────────────────────────

export async function upsertCaseStudy(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null

  const payload = {
    slug:            (formData.get('slug') as string).trim(),
    name:            (formData.get('name') as string).trim(),
    year:            parseInt(formData.get('year') as string) || null,
    tagline:         (formData.get('tagline') as string) || null,
    outcome:         (formData.get('outcome') as string) || null,
    challenge:       (formData.get('challenge') as string) || null,
    solution:        (formData.get('solution') as string) || null,
    cover_image_url: (formData.get('cover_image_url') as string) || null,
    gallery_urls:    formData.getAll('gallery_urls').filter(v => typeof v === 'string' && v.length > 0) as string[],
    project_url:     (formData.get('project_url') as string) || null,
    featured:        formData.get('featured') === 'on',
    published:       formData.get('published') === 'on',
    display_order:   parseInt(formData.get('display_order') as string) || 0,
    tags:            (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
  }

  if (id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('case_studies') as any).update(payload).eq('id', id)
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('case_studies') as any).insert(payload)
  }

  revalidatePath('/admin/work')
  revalidatePath('/')
  revalidatePath('/work')
  redirect('/admin/work')
}

export async function deleteCaseStudy(id: string) {
  const supabase = await createClient()
  await supabase.from('case_studies').delete().eq('id', id)
  revalidatePath('/admin/work')
  revalidatePath('/')
  revalidatePath('/work')
  redirect('/admin/work')
}

// ── Blog Posts ───────────────────────────────────────────────

export async function upsertPost(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null
  const published = formData.get('published') === 'on'

  const payload = {
    slug:            (formData.get('slug') as string).trim(),
    title:           (formData.get('title') as string).trim(),
    excerpt:         (formData.get('excerpt') as string) || null,
    content:         (formData.get('content') as string) || null,
    cover_image_url: (formData.get('cover_image_url') as string) || null,
    published,
    published_at:    published ? new Date().toISOString() : null,
  }

  if (id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('posts') as any).update(payload).eq('id', id)
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('posts') as any).insert(payload)
  }

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  redirect('/admin/blog')
}

export async function deletePost(id: string) {
  const supabase = await createClient()
  await supabase.from('posts').delete().eq('id', id)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  redirect('/admin/blog')
}

// ── Team Members ─────────────────────────────────────────────

export async function upsertTeamMember(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null

  const payload = {
    name:          (formData.get('name') as string).trim(),
    role:          (formData.get('role') as string).trim(),
    bio:           (formData.get('bio') as string) || null,
    photo_url:     (formData.get('photo_url') as string) || null,
    linkedin_url:  (formData.get('linkedin_url') as string) || null,
    github_url:    (formData.get('github_url') as string) || null,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    active:        formData.get('active') === 'on',
  }

  if (id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('team_members') as any).update(payload).eq('id', id)
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('team_members') as any).insert(payload)
  }

  revalidatePath('/admin/team')
  revalidatePath('/')
  redirect('/admin/team')
}

export async function deleteTeamMember(id: string) {
  const supabase = await createClient()
  await supabase.from('team_members').delete().eq('id', id)
  revalidatePath('/admin/team')
  revalidatePath('/')
  redirect('/admin/team')
}

// ── Testimonials ─────────────────────────────────────────────

export async function upsertTestimonial(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null

  const payload = {
    quote:          (formData.get('quote') as string).trim(),
    author_name:    (formData.get('author_name') as string).trim(),
    author_role:    (formData.get('author_role') as string) || null,
    author_company: (formData.get('author_company') as string) || null,
    featured:       formData.get('featured') === 'on',
    display_order:  parseInt(formData.get('display_order') as string) || 0,
  }

  if (id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('testimonials') as any).update(payload).eq('id', id)
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('testimonials') as any).insert(payload)
  }

  revalidatePath('/admin/testimonials')
  revalidatePath('/')
  redirect('/admin/testimonials')
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient()
  await supabase.from('testimonials').delete().eq('id', id)
  revalidatePath('/admin/testimonials')
  revalidatePath('/')
  redirect('/admin/testimonials')
}

// ── Site Settings ────────────────────────────────────────────

export async function saveSettings(formData: FormData) {
  const supabase = await createClient()
  const keys = Array.from(formData.keys())

  await Promise.all(
    keys.map(key =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase.from('site_settings') as any)
        .upsert({ key, value: formData.get(key) as string }, { onConflict: 'key' })
    )
  )

  revalidatePath('/')
  revalidatePath('/admin/settings')
}
