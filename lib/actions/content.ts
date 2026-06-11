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
    kind:            (formData.get('kind') as string) || null,
    summary:         (formData.get('summary') as string) || null,
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
    rating:         parseInt(formData.get('rating') as string) || 5,
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

// ── Services ─────────────────────────────────────────────────

export async function upsertService(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null
  const payload = {
    title:         (formData.get('title') as string).trim(),
    body:          (formData.get('body') as string).trim(),
    bullets:       (formData.get('bullets') as string).split('\n').map(s => s.trim()).filter(Boolean),
    tone:          (formData.get('tone') as string) || 'cream',
    glyph:         (formData.get('glyph') as string) || null,
    span:          (formData.get('span') as string) || 'trio',
    display_order: parseInt(formData.get('display_order') as string) || 0,
    active:        formData.get('active') === 'on',
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (id) await (supabase.from('services') as any).update(payload).eq('id', id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else await (supabase.from('services') as any).insert(payload)
  revalidatePath('/admin/services'); revalidatePath('/'); redirect('/admin/services')
}

export async function deleteService(id: string) {
  const supabase = await createClient()
  await supabase.from('services').delete().eq('id', id)
  revalidatePath('/admin/services'); revalidatePath('/'); redirect('/admin/services')
}

// ── Stats ────────────────────────────────────────────────────

export async function upsertStat(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null
  const payload = {
    value:         parseFloat(formData.get('value') as string) || 0,
    suffix:        (formData.get('suffix') as string) || '',
    decimals:      parseInt(formData.get('decimals') as string) || 0,
    label:         (formData.get('label') as string).trim(),
    display_order: parseInt(formData.get('display_order') as string) || 0,
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (id) await (supabase.from('stats') as any).update(payload).eq('id', id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else await (supabase.from('stats') as any).insert(payload)
  revalidatePath('/admin/stats'); revalidatePath('/'); redirect('/admin/stats')
}

export async function deleteStat(id: string) {
  const supabase = await createClient()
  await supabase.from('stats').delete().eq('id', id)
  revalidatePath('/admin/stats'); revalidatePath('/'); redirect('/admin/stats')
}

// ── Pricing ──────────────────────────────────────────────────

export async function upsertPricingTier(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null
  const payload = {
    name:          (formData.get('name') as string).trim(),
    tag:           (formData.get('tag') as string) || null,
    price:         (formData.get('price') as string).trim(),
    unit:          (formData.get('unit') as string) || null,
    blurb:         (formData.get('blurb') as string) || null,
    features:      (formData.get('features') as string).split('\n').map(s => s.trim()).filter(Boolean),
    tone:          (formData.get('tone') as string) || 'cream',
    cta_label:     (formData.get('cta_label') as string) || 'Get started',
    featured:      formData.get('featured') === 'on',
    display_order: parseInt(formData.get('display_order') as string) || 0,
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (id) await (supabase.from('pricing_tiers') as any).update(payload).eq('id', id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else await (supabase.from('pricing_tiers') as any).insert(payload)
  revalidatePath('/admin/pricing'); revalidatePath('/'); redirect('/admin/pricing')
}

export async function deletePricingTier(id: string) {
  const supabase = await createClient()
  await supabase.from('pricing_tiers').delete().eq('id', id)
  revalidatePath('/admin/pricing'); revalidatePath('/'); redirect('/admin/pricing')
}

// ── Tech groups ──────────────────────────────────────────────

export async function upsertTechGroup(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null
  const payload = {
    label:         (formData.get('label') as string).trim(),
    items:         (formData.get('items') as string).split(',').map(s => s.trim()).filter(Boolean),
    display_order: parseInt(formData.get('display_order') as string) || 0,
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (id) await (supabase.from('tech_groups') as any).update(payload).eq('id', id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else await (supabase.from('tech_groups') as any).insert(payload)
  revalidatePath('/admin/tech-stack'); revalidatePath('/'); redirect('/admin/tech-stack')
}

export async function deleteTechGroup(id: string) {
  const supabase = await createClient()
  await supabase.from('tech_groups').delete().eq('id', id)
  revalidatePath('/admin/tech-stack'); revalidatePath('/'); redirect('/admin/tech-stack')
}

// ── FAQs ─────────────────────────────────────────────────────

export async function upsertFaq(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null
  const payload = {
    question:      (formData.get('question') as string).trim(),
    answer:        (formData.get('answer') as string).trim(),
    display_order: parseInt(formData.get('display_order') as string) || 0,
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (id) await (supabase.from('faqs') as any).update(payload).eq('id', id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else await (supabase.from('faqs') as any).insert(payload)
  revalidatePath('/admin/faq'); revalidatePath('/'); redirect('/admin/faq')
}

export async function deleteFaq(id: string) {
  const supabase = await createClient()
  await supabase.from('faqs').delete().eq('id', id)
  revalidatePath('/admin/faq'); revalidatePath('/'); redirect('/admin/faq')
}
