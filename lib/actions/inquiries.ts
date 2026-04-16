'use server'

import { Resend } from 'resend'
import { createStaticClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitInquiry(formData: FormData): Promise<{ error?: string }> {
  const name         = (formData.get('name') as string ?? '').trim()
  const email        = (formData.get('email') as string ?? '').trim()
  const company      = (formData.get('company') as string ?? '').trim()
  const project_type = (formData.get('project_type') as string ?? '').trim()
  const budget_range = (formData.get('budget_range') as string ?? '').trim()
  const timeline     = (formData.get('timeline') as string ?? '').trim()
  const message      = (formData.get('message') as string ?? '').trim()

  if (!name)         return { error: 'Name is required.' }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'A valid email is required.' }
  if (!project_type) return { error: 'Please select a project type.' }
  if (!message)      return { error: 'Please describe your project.' }

  const supabase = createStaticClient()
  const { error } = await supabase.from('project_inquiries').insert({
    name,
    email,
    company:      company      || null,
    project_type,
    budget_range: budget_range || null,
    timeline:     timeline     || null,
    message,
  })

  if (error) return { error: 'Something went wrong. Please try again or email us directly.' }

  // Send email notification — non-fatal if it fails
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Crafyne CMS <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL ?? 'hello@crafyne.com',
      subject: `New inquiry from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a18">
          <p style="font-size:13px;color:#888;margin-bottom:24px">New project inquiry via crafyne.com</p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;color:#888;width:120px">Name</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px">${name}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;color:#888">Email</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px"><a href="mailto:${email}" style="color:#4D8F6A">${email}</a></td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;color:#888">Company</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px">${company || '—'}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;color:#888">Type</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px">${project_type}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;color:#888">Budget</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px">${budget_range || '—'}</td></tr>
            <tr><td style="padding:8px 0;font-size:13px;color:#888">Timeline</td><td style="padding:8px 0;font-size:14px">${timeline || '—'}</td></tr>
          </table>
          <div style="background:#f7f5f0;border-radius:6px;padding:16px 20px;margin-bottom:24px">
            <p style="font-size:13px;color:#888;margin:0 0 8px">Message</p>
            <p style="font-size:14px;line-height:1.7;margin:0">${message.replace(/\n/g, '<br/>')}</p>
          </div>
          <a href="https://crafyne.com/admin/inquiries" style="display:inline-block;background:#0F0F0D;color:#F4F2EC;text-decoration:none;font-size:13px;padding:10px 20px;border-radius:20px">View in CMS →</a>
        </div>
      `,
    })
  } catch {
    // Email failure is non-fatal — inquiry is already saved to the database
  }

  return {}
}

export async function updateInquiry(formData: FormData): Promise<void> {
  const id          = formData.get('id') as string
  const status      = formData.get('status') as string
  const admin_notes = (formData.get('admin_notes') as string ?? '').trim()

  const supabase = await createClient()
  await supabase
    .from('project_inquiries')
    .update({ status, admin_notes: admin_notes || null, updated_at: new Date().toISOString() })
    .eq('id', id)

  revalidatePath('/admin/inquiries')
}
