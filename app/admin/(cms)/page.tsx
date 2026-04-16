import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: csCount },
    { count: postCount },
    { count: teamCount },
    { count: testimonialCount },
    { count: newInquiryCount },
  ] = await Promise.all([
    supabase.from('case_studies').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('team_members').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
    supabase.from('project_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  ])

  const stats = [
    { label: 'Case Studies', value: csCount ?? 0, href: '/admin/case-studies', highlight: false },
    { label: 'Blog Posts',   value: postCount ?? 0, href: '/admin/blog', highlight: false },
    { label: 'Team',         value: teamCount ?? 0, href: '/admin/team', highlight: false },
    { label: 'Testimonials', value: testimonialCount ?? 0, href: '/admin/testimonials', highlight: false },
    { label: 'New Inquiries', value: newInquiryCount ?? 0, href: '/admin/inquiries', highlight: (newInquiryCount ?? 0) > 0 },
  ]

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-serif text-2xl text-[#111] mb-1 tracking-[-0.01em]">Dashboard</h1>
      <p className="text-sm text-[#888] mb-10 font-light">Welcome to Crafyne CMS.</p>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {stats.map(s => (
          <a key={s.label} href={s.href}
            className={`border rounded-lg p-5 hover:border-black/20 transition group ${
              s.highlight
                ? 'bg-amber-50 border-amber-200 hover:border-amber-300'
                : 'bg-white border-black/8'
            }`}>
            <p className={`text-3xl font-serif mb-1 ${s.highlight ? 'text-amber-700' : 'text-[#111]'}`}>
              {s.value}
            </p>
            <p className={`text-xs transition ${s.highlight ? 'text-amber-600' : 'text-[#888] group-hover:text-[#555]'}`}>
              {s.label}
            </p>
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { href: '/admin/case-studies/new', label: '+ New case study' },
          { href: '/admin/blog/new',         label: '+ New blog post' },
          { href: '/admin/settings',         label: '⚙ Edit hero & settings' },
          { href: '/',                       label: '↗ View website', target: '_blank' },
        ].map(a => (
          <a key={a.href} href={a.href} target={a.target}
            className="flex items-center justify-between px-5 py-3.5 bg-white border border-black/8 rounded-lg text-sm text-[#555] hover:text-[#111] hover:border-black/20 transition">
            {a.label}
            <span className="text-[#ccc]">→</span>
          </a>
        ))}
      </div>
    </div>
  )
}
