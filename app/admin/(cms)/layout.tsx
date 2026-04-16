import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/lib/actions/auth'

const navItems = [
  { href: '/admin',              label: 'Dashboard',    icon: '▦' },
  { href: '/admin/case-studies', label: 'Case Studies', icon: '◫' },
  { href: '/admin/blog',         label: 'Blog',         icon: '≡' },
  { href: '/admin/team',         label: 'Team',         icon: '○' },
  { href: '/admin/testimonials', label: 'Testimonial',  icon: '❝' },
  { href: '/admin/inquiries',    label: 'Inquiries',    icon: '✉' },
  { href: '/admin/settings',     label: 'Settings',     icon: '⚙' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-[#F9F9F7] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-black/8 flex flex-col fixed inset-y-0 left-0 z-10">
        <div className="px-5 py-6 border-b border-black/8">
          <Link href="/" target="_blank"
            className="font-serif text-xl text-[#111] tracking-[-0.01em] hover:opacity-70 transition">
            crafyne
          </Link>
          <span className="block text-[10px] text-[#aaa] mt-0.5 uppercase tracking-widest">CMS</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-[#555] hover:text-[#111] hover:bg-black/[0.04] transition group"
            >
              <span className="text-base w-4 text-center opacity-50 group-hover:opacity-100 transition">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-black/8">
          <p className="text-[11px] text-[#aaa] mb-2 truncate">{user.email}</p>
          <form action={logout}>
            <button
              type="submit"
              className="text-xs text-[#888] hover:text-[#111] transition"
            >
              Sign out →
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-56 flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}
