'use server'

import { Resend } from 'resend'
import { headers } from 'next/headers'
import { createStaticClient, createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { verifyTurnstile } from '@/lib/turnstile'
import type { ProjectInquiry } from '@/lib/supabase/types'

/**
 * Escape untuk template email di bawah.
 *
 * Isi inquiry datang dari form publik dan diinterpolasi mentah ke HTML.
 * Tanpa escape, siapa pun bisa menyuntikkan markup — link palsu, gambar
 * pelacak, atau tag yang merusak layout — ke inbox admin.
 */
function esc(v: string): string {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Escape + ubah newline jadi <br/>, untuk blok teks bebas. */
function escLines(v: string): string {
  return esc(v).replace(/\n/g, '<br/>')
}

export async function submitInquiry(formData: FormData): Promise<{ error?: string }> {
  const name         = (formData.get('name') as string ?? '').trim()
  const email        = (formData.get('email') as string ?? '').trim()
  const company      = (formData.get('company') as string ?? '').trim()
  const project_type = (formData.get('project_type') as string ?? '').trim()
  const timeline     = (formData.get('timeline') as string ?? '').trim()
  const message      = (formData.get('message') as string ?? '').trim()
  const pkg               = (formData.get('package') as string ?? '').trim()
  const wants_care        = (formData.get('wants_care') as string ?? '') === 'true'
  const design_references = (formData.get('design_references') as string ?? '').trim()

  if (!name)         return { error: 'Name is required.' }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'A valid email is required.' }
  if (!project_type) return { error: 'Please select a project type.' }
  if (!message)      return { error: 'Please describe your project.' }

  // Proteksi bot. Tidak aktif sampai TURNSTILE_SECRET_KEY diisi.
  const h = await headers()
  // cf-connecting-ip kalau di belakang Cloudflare, x-forwarded-for untuk proxy lain.
  const ip = h.get('cf-connecting-ip') ?? h.get('x-forwarded-for')?.split(',')[0].trim() ?? undefined
  const captcha = await verifyTurnstile((formData.get('turnstile_token') as string ?? '').trim(), ip)
  if (!captcha.ok) {
    console.warn('[inquiry] Turnstile menolak submission:', captcha.reason)
    return { error: 'Could not verify you are human. Please refresh the page and try again.' }
  }

  const supabase = createStaticClient()
  const { error } = await supabase.from('project_inquiries').insert({
    name,
    email,
    company:      company      || null,
    project_type,
    timeline:     timeline     || null,
    message,
    package:           pkg               || null,
    wants_care,
    design_references: design_references || null,
  })

  if (error) {
    console.error('[inquiry] gagal menyimpan:', error.message)
    return { error: 'Something went wrong. Please try again or email us directly.' }
  }

  // Penerima notifikasi diambil dari CMS supaya bisa diganti sendiri lewat
  // /admin/settings tanpa deploy ulang. Kalau kosong, jatuh ke ADMIN_EMAIL
  // (variabel Worker) — jadi menambahkan setting ini tidak mengubah apa pun
  // sampai kamu benar-benar mengisinya.
  const { data: notifySetting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'notification_email')
    .maybeSingle()

  const notifyTo = notifySetting?.value?.trim() || process.env.ADMIN_EMAIL || 'contact@crafyne.com'

  // Send email notification — non-fatal if it fails
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Crafyne CMS <onboarding@resend.dev>',
      to: notifyTo,
      subject: `New inquiry from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a18">
          <p style="font-size:13px;color:#888;margin-bottom:24px">New project inquiry via crafyne.com</p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;color:#888;width:120px">Name</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px">${esc(name)}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;color:#888">Email</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px"><a href="mailto:${esc(email)}" style="color:#4D8F6A">${esc(email)}</a></td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;color:#888">Company</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px">${company ? esc(company) : '—'}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;color:#888">Type</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px">${esc(project_type)}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;color:#888">Timeline</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px">${timeline ? esc(timeline) : '—'}</td></tr>
            <tr><td style="padding:8px 0;font-size:13px;color:#888">Package</td><td style="padding:8px 0;font-size:14px">${pkg ? esc(pkg) : '—'}${wants_care ? ' + Care &amp; hosting' : ''}</td></tr>
          </table>
          <div style="background:#f7f5f0;border-radius:6px;padding:16px 20px;margin-bottom:24px">
            <p style="font-size:13px;color:#888;margin:0 0 8px">Message</p>
            <p style="font-size:14px;line-height:1.7;margin:0">${escLines(message)}</p>
          </div>
          ${design_references ? `<div style="background:#f7f5f0;border-radius:6px;padding:16px 20px;margin-bottom:24px"><p style="font-size:13px;color:#888;margin:0 0 8px">Design references</p><p style="font-size:14px;line-height:1.7;margin:0">${escLines(design_references)}</p></div>` : ''}
          <a href="https://crafyne.com/admin/inquiries" style="display:inline-block;background:#0F0F0D;color:#F4F2EC;text-decoration:none;font-size:13px;padding:10px 20px;border-radius:20px">View in CMS →</a>
        </div>
      `,
    })
  } catch (e) {
    // Sengaja tidak fatal: inquiry-nya sudah tersimpan, dan menolak lead asli
    // gara-gara email gagal jauh lebih mahal daripada notifikasi yang telat.
    //
    // Tapi HARUS tercatat. Sebelumnya blok ini kosong, jadi RESEND_API_KEY yang
    // dicabut membuat setiap notifikasi hilang tanpa satu baris pun di log —
    // inquiry tetap masuk database, tapi tidak ada yang tahu harus membukanya.
    console.error('[inquiry] notifikasi email GAGAL dikirim:', e instanceof Error ? e.message : e)
  }

  return {}
}

const INQUIRY_STATUSES = ['new', 'reviewing', 'contacted', 'won', 'lost'] as const

export async function updateInquiry(formData: FormData): Promise<void> {
  const id          = formData.get('id') as string
  const rawStatus   = (formData.get('status') as string ?? '').trim()
  const admin_notes = (formData.get('admin_notes') as string ?? '').trim()

  // status masuk sebagai string bebas dari FormData. Tanpa cek ini, nilai apa
  // pun bisa tersimpan dan membuat filter/label di halaman inquiry tak konsisten.
  if (!(INQUIRY_STATUSES as readonly string[]).includes(rawStatus)) {
    throw new Error(`Status inquiry tidak dikenal: "${rawStatus}"`)
  }
  const status = rawStatus as ProjectInquiry['status']

  const supabase = await createClient()
  const { error } = await supabase
    .from('project_inquiries')
    .update({ status, admin_notes: admin_notes || null, updated_at: new Date().toISOString() })
    .eq('id', id)

  // Jangan diam-diam sukses: kalau RLS/DB menolak, admin harus tahu.
  if (error) {
    console.error('[cms] gagal memperbarui inquiry:', error.message, error.details ?? '')
    throw new Error(`Gagal memperbarui inquiry: ${error.message}`)
  }

  revalidatePath('/admin/inquiries')
  revalidatePath(`/admin/inquiries/${id}`)
  // Tetap di halaman detail seperti sebelumnya, hanya ditambah penanda supaya
  // SaveToast bisa memastikan ke user bahwa perubahannya benar-benar masuk.
  redirect(`/admin/inquiries/${id}?saved=${Date.now()}`)
}
