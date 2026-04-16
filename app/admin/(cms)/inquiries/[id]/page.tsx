import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'
import { SubmitButton } from '@/components/admin/FormField'
import { updateInquiry } from '@/lib/actions/inquiries'

const STATUSES = ['new', 'reviewing', 'contacted', 'won', 'lost'] as const

const STATUS_STYLES: Record<string, string> = {
  new:       'bg-amber-50 text-amber-700',
  reviewing: 'bg-blue-50 text-blue-700',
  contacted: 'bg-purple-50 text-purple-700',
  won:       'bg-green-50 text-green-700',
  lost:      'bg-black/5 text-[#888]',
}

function ReadOnlyField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div>
      <p className="text-[10.5px] font-medium tracking-[0.1em] uppercase text-[#aaa] mb-1">{label}</p>
      <p className="text-sm text-[#333] leading-relaxed">{value}</p>
    </div>
  )
}

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: inq } = await supabase
    .from('project_inquiries')
    .select('*')
    .eq('id', id)
    .single()

  if (!inq) notFound()

  return (
    <div>
      <AdminHeader
        title={`${inq.name}${inq.company ? ` — ${inq.company}` : ''}`}
        backHref="/admin/inquiries"
      />

      <div className="p-8 max-w-3xl grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">

        {/* Left: submitted details */}
        <div className="space-y-6">
          <div className="bg-white border border-black/8 rounded-lg p-6 space-y-5">
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2.5 py-1 rounded-full capitalize font-medium ${STATUS_STYLES[inq.status] ?? 'bg-black/5 text-[#888]'}`}>
                {inq.status}
              </span>
              <span className="text-xs text-[#aaa]">
                Received {new Date(inq.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            <ReadOnlyField label="Name" value={inq.name} />
            <ReadOnlyField label="Email" value={inq.email} />
            <ReadOnlyField label="Company" value={inq.company} />

            <div className="grid grid-cols-3 gap-5">
              <ReadOnlyField label="Project type" value={inq.project_type} />
              <ReadOnlyField label="Budget" value={inq.budget_range} />
              <ReadOnlyField label="Timeline" value={inq.timeline} />
            </div>

            <div>
              <p className="text-[10.5px] font-medium tracking-[0.1em] uppercase text-[#aaa] mb-2">Message</p>
              <p className="text-sm text-[#333] leading-[1.75] whitespace-pre-wrap">{inq.message}</p>
            </div>
          </div>
        </div>

        {/* Right: admin controls */}
        <div>
          <form action={updateInquiry} className="bg-white border border-black/8 rounded-lg p-6 space-y-5 sticky top-6">
            <input type="hidden" name="id" value={inq.id} />

            <div>
              <label className="block text-[10.5px] font-medium tracking-[0.1em] uppercase text-[#aaa] mb-2">
                Status
              </label>
              <select
                name="status"
                defaultValue={inq.status}
                className="w-full px-3 py-2.5 text-sm border border-black/12 rounded-md bg-white text-[#111] focus:outline-none focus:ring-2 focus:ring-[#4D8F6A]/40 focus:border-[#4D8F6A] transition appearance-none"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10.5px] font-medium tracking-[0.1em] uppercase text-[#aaa] mb-2">
                Private notes
              </label>
              <textarea
                name="admin_notes"
                rows={6}
                defaultValue={inq.admin_notes ?? ''}
                placeholder="Internal notes visible only to admins…"
                className="w-full px-3 py-2.5 text-sm border border-black/12 rounded-md bg-white text-[#111] placeholder:text-[#ccc] focus:outline-none focus:ring-2 focus:ring-[#4D8F6A]/40 focus:border-[#4D8F6A] transition resize-y"
              />
            </div>

            <SubmitButton label="Save changes" />

            <a
              href={`mailto:${inq.email}?subject=Re: Your project inquiry`}
              className="block text-center w-full py-2.5 border border-black/12 rounded-md text-sm text-[#555] hover:text-[#111] hover:border-black/30 transition"
            >
              Reply by email →
            </a>
          </form>
        </div>

      </div>
    </div>
  )
}
