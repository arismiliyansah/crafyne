'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Supabase mengembalikan kegagalan sebagai nilai (`{ error }`), bukan exception.
 * Sebelumnya semua action di file ini membuang nilai itu lalu tetap memanggil
 * redirect(), jadi penolakan RLS atau error DB tampak persis seperti sukses:
 * admin melihat halaman daftar, padahal tidak ada yang tersimpan.
 *
 * assertOk() menghentikan alur sebelum redirect. Pesan asli dicatat ke log
 * server (di produksi Next menyembunyikan pesan error dari browser dan hanya
 * mengirim `digest` — digest itulah yang mencocokkan tampilan dengan log ini).
 */
type MutationResult = {
  error: { message: string; details?: string | null } | null
  data?: unknown[] | null
}

function assertOk(result: MutationResult, what: string): void {
  if (!result.error) return
  console.error(`[cms] gagal ${what}:`, result.error.message, result.error.details ?? '')
  throw new Error(`Gagal ${what}: ${result.error.message}`)
}

/**
 * RLS pada UPDATE dan DELETE tidak menghasilkan error — baris yang tidak boleh
 * disentuh hanya tersaring, sehingga Postgres melapor "sukses, 0 baris". Jadi
 * assertOk() saja belum cukup: penolakan izin akan lolos sebagai sukses.
 *
 * Karena itu setiap mutasi diakhiri .select('id'). Kalau tidak ada baris yang
 * kembali, tidak ada yang berubah — dan itu bukan sukses.
 */
function assertAffected(result: MutationResult, what: string): void {
  assertOk(result, what)
  if (result.data && result.data.length > 0) return
  console.error(`[cms] ${what}: 0 baris terpengaruh — RLS menolak, atau barisnya sudah tidak ada`)
  throw new Error(`Gagal ${what}: tidak ada baris yang berubah.`)
}

/**
 * Tujuan redirect setelah action berhasil.
 *
 * Timestamp-nya bukan hiasan: tanpa itu, menyimpan dua kali berturut-turut
 * menghasilkan URL identik, komponen SaveToast tidak remount, dan konfirmasi
 * kedua tidak pernah muncul.
 */
function doneUrl(path: string, kind: 'saved' | 'deleted' = 'saved'): string {
  return `${path}?${kind}=${Date.now()}`
}

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

  const table = supabase.from('case_studies')
  assertAffected(
    id ? await table.update(payload).eq('id', id).select('id')
       : await table.insert(payload).select('id'),
    'menyimpan case study')

  revalidatePath('/admin/work')
  revalidatePath('/')
  revalidatePath('/work')
  redirect(doneUrl('/admin/work'))
}

export async function deleteCaseStudy(id: string) {
  const supabase = await createClient()
  assertAffected(await supabase.from('case_studies').delete().eq('id', id).select('id'), 'menghapus case study')
  revalidatePath('/admin/work')
  revalidatePath('/')
  revalidatePath('/work')
  redirect(doneUrl('/admin/work', 'deleted'))
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

  const table = supabase.from('posts')
  assertAffected(
    id ? await table.update(payload).eq('id', id).select('id')
       : await table.insert(payload).select('id'),
    'menyimpan artikel')

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  redirect(doneUrl('/admin/blog'))
}

export async function deletePost(id: string) {
  const supabase = await createClient()
  assertAffected(await supabase.from('posts').delete().eq('id', id).select('id'), 'menghapus artikel')
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  redirect(doneUrl('/admin/blog', 'deleted'))
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

  const table = supabase.from('team_members')
  assertAffected(
    id ? await table.update(payload).eq('id', id).select('id')
       : await table.insert(payload).select('id'),
    'menyimpan anggota tim')

  revalidatePath('/admin/team')
  revalidatePath('/')
  redirect(doneUrl('/admin/team'))
}

export async function deleteTeamMember(id: string) {
  const supabase = await createClient()
  assertAffected(await supabase.from('team_members').delete().eq('id', id).select('id'), 'menghapus anggota tim')
  revalidatePath('/admin/team')
  revalidatePath('/')
  redirect(doneUrl('/admin/team', 'deleted'))
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

  const table = supabase.from('testimonials')
  assertAffected(
    id ? await table.update(payload).eq('id', id).select('id')
       : await table.insert(payload).select('id'),
    'menyimpan testimoni')

  revalidatePath('/admin/testimonials')
  revalidatePath('/')
  redirect(doneUrl('/admin/testimonials'))
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient()
  assertAffected(await supabase.from('testimonials').delete().eq('id', id).select('id'), 'menghapus testimoni')
  revalidatePath('/admin/testimonials')
  revalidatePath('/')
  redirect(doneUrl('/admin/testimonials', 'deleted'))
}

// ── Site Settings ────────────────────────────────────────────

/**
 * Key yang boleh masuk ke site_settings.
 *
 * Sebelumnya saveSettings meng-upsert SETIAP key yang ada di FormData, jadi
 * field apa pun yang diselipkan ke form akan tersimpan sebagai setting.
 * Daftar ini diambil persis dari nama field di app/admin/(cms)/settings/page.tsx —
 * kalau menambah field baru di sana, tambahkan juga namanya di sini.
 */
const ALLOWED_SETTING_KEYS = new Set([
  'notification_email',
  'agency_email',
  'agency_location',
  'agency_tagline',
  'contact_availability_label',
  'contact_availability_text',
  'contact_invite',
  'footer_copyright',
  'footer_facebook_url',
  'footer_github_url',
  'footer_instagram_url',
  'footer_threads_url',
  'hero_cta_primary',
  'hero_cta_secondary',
  'hero_eyebrow',
  'hero_headline',
  'hero_subheadline',
  'pricing_care_blurb',
  'pricing_care_features',
  'pricing_care_price',
  'pricing_care_title',
  'pricing_care_unit',
  'proof_clients',
  'services',
  'team_eyebrow',
  'team_sub',
  'team_title',
])

export async function saveSettings(formData: FormData) {
  const supabase = await createClient()

  // Next menyisipkan field internalnya sendiri ($ACTION_ID_…, $ACTION_REF_…)
  // ke FormData setiap server action. Itu bukan setting, dan menolaknya membuat
  // seluruh halaman Settings gagal disimpan — jadi disaring lebih dulu.
  const submitted = Array.from(formData.keys()).filter(k => !k.startsWith('$ACTION'))
  const unknown = submitted.filter(k => !ALLOWED_SETTING_KEYS.has(k))
  if (unknown.length > 0) {
    console.error('[cms] key setting tak dikenal ditolak:', unknown.join(', '))
    throw new Error(`Key setting tak dikenal: ${unknown.join(', ')}. Tambahkan ke ALLOWED_SETTING_KEYS kalau memang field baru.`)
  }

  const rows = submitted.map(key => ({ key, value: formData.get(key) as string }))

  // Satu upsert batch, bukan N request paralel: lebih cepat dan errornya
  // ketahuan sebagai satu hasil, bukan tercecer di Promise.all.
  assertAffected(await supabase.from('site_settings').upsert(rows, { onConflict: 'key' }).select('key'),
    'menyimpan pengaturan')

  revalidatePath('/')
  revalidatePath('/admin/settings')
  // Sebelumnya berhenti di sini: tanpa redirect, menekan "Save All Settings"
  // benar-benar tidak mengubah apa pun di layar.
  redirect(doneUrl('/admin/settings'))
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
  const table = supabase.from('services')
  assertAffected(
    id ? await table.update(payload).eq('id', id).select('id')
       : await table.insert(payload).select('id'),
    'menyimpan service')
  revalidatePath('/admin/services'); revalidatePath('/'); redirect(doneUrl('/admin/services'))
}

export async function deleteService(id: string) {
  const supabase = await createClient()
  assertAffected(await supabase.from('services').delete().eq('id', id).select('id'), 'menghapus service')
  revalidatePath('/admin/services'); revalidatePath('/'); redirect(doneUrl('/admin/services', 'deleted'))
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
  const table = supabase.from('stats')
  assertAffected(
    id ? await table.update(payload).eq('id', id).select('id')
       : await table.insert(payload).select('id'),
    'menyimpan stat')
  revalidatePath('/admin/stats'); revalidatePath('/'); redirect(doneUrl('/admin/stats'))
}

export async function deleteStat(id: string) {
  const supabase = await createClient()
  assertAffected(await supabase.from('stats').delete().eq('id', id).select('id'), 'menghapus stat')
  revalidatePath('/admin/stats'); revalidatePath('/'); redirect(doneUrl('/admin/stats', 'deleted'))
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
  const table = supabase.from('pricing_tiers')
  assertAffected(
    id ? await table.update(payload).eq('id', id).select('id')
       : await table.insert(payload).select('id'),
    'menyimpan paket harga')
  revalidatePath('/admin/pricing'); revalidatePath('/'); redirect(doneUrl('/admin/pricing'))
}

export async function deletePricingTier(id: string) {
  const supabase = await createClient()
  assertAffected(await supabase.from('pricing_tiers').delete().eq('id', id).select('id'), 'menghapus paket harga')
  revalidatePath('/admin/pricing'); revalidatePath('/'); redirect(doneUrl('/admin/pricing', 'deleted'))
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
  const table = supabase.from('tech_groups')
  assertAffected(
    id ? await table.update(payload).eq('id', id).select('id')
       : await table.insert(payload).select('id'),
    'menyimpan tech group')
  revalidatePath('/admin/tech-stack'); revalidatePath('/'); redirect(doneUrl('/admin/tech-stack'))
}

export async function deleteTechGroup(id: string) {
  const supabase = await createClient()
  assertAffected(await supabase.from('tech_groups').delete().eq('id', id).select('id'), 'menghapus tech group')
  revalidatePath('/admin/tech-stack'); revalidatePath('/'); redirect(doneUrl('/admin/tech-stack', 'deleted'))
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
  const table = supabase.from('faqs')
  assertAffected(
    id ? await table.update(payload).eq('id', id).select('id')
       : await table.insert(payload).select('id'),
    'menyimpan FAQ')
  revalidatePath('/admin/faq'); revalidatePath('/'); redirect(doneUrl('/admin/faq'))
}

export async function deleteFaq(id: string) {
  const supabase = await createClient()
  assertAffected(await supabase.from('faqs').delete().eq('id', id).select('id'), 'menghapus FAQ')
  revalidatePath('/admin/faq'); revalidatePath('/'); redirect(doneUrl('/admin/faq', 'deleted'))
}
