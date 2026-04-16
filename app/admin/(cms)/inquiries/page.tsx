import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'

const STATUS_STYLES: Record<string, string> = {
  new:       'bg-amber-50 text-amber-700',
  reviewing: 'bg-blue-50 text-blue-700',
  contacted: 'bg-purple-50 text-purple-700',
  won:       'bg-green-50 text-green-700',
  lost:      'bg-black/5 text-[#888]',
}

export default async function InquiriesPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('project_inquiries')
    .select('id, name, email, company, project_type, budget_range, status, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <AdminHeader title="Inquiries" />

      <div className="p-8">
        {!items?.length ? (
          <p className="text-sm text-[#aaa]">No inquiries yet.</p>
        ) : (
          <div className="bg-white border border-black/8 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/8 text-xs text-[#888] uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Company</th>
                  <th className="text-left px-5 py-3 font-medium">Type</th>
                  <th className="text-left px-5 py-3 font-medium">Budget</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {items.map(item => (
                  <tr
                    key={item.id}
                    className={`hover:bg-black/[0.02] transition ${item.status === 'new' ? 'bg-amber-50/40' : ''}`}
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-[#111]">{item.name}</p>
                      <p className="text-xs text-[#aaa] mt-0.5">{item.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-[#888]">{item.company || '—'}</td>
                    <td className="px-5 py-3.5 text-[#888]">{item.project_type}</td>
                    <td className="px-5 py-3.5 text-[#888] text-xs">{item.budget_range || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[item.status] ?? 'bg-black/5 text-[#888]'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#888] text-xs">
                      {new Date(item.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/inquiries/${item.id}`}
                        className="text-xs text-[#555] hover:text-[#111] transition">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
