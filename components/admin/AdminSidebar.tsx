'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { logout } from '@/lib/actions/auth'

const navItems = [
  { href: '/admin',              label: 'Dashboard',    icon: '▦' },
  { href: '/admin/work',         label: 'Work',         icon: '◫' },
  { href: '/admin/blog',         label: 'Blog',         icon: '≡' },
  { href: '/admin/team',         label: 'Team',         icon: '○' },
  { href: '/admin/testimonials', label: 'Testimonial',  icon: '❝' },
  { href: '/admin/inquiries',    label: 'Inquiries',    icon: '✉' },
  { href: '/admin/settings',     label: 'Settings',     icon: '⚙' },
]

export default function AdminSidebar({ email }: { email: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(min-width: 768px)').matches) return
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="md:hidden fixed top-3 left-3 z-50 w-10 h-10 rounded-md bg-white border border-black/8 shadow-sm flex flex-col items-center justify-center gap-[5px]"
      >
        <span className={`block w-4 h-px bg-[#111] transition-all duration-200 origin-center ${open ? 'rotate-45 translate-y-[3px]' : ''}`} />
        <span className={`block w-4 h-px bg-[#111] transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
        <span className={`block w-4 h-px bg-[#111] transition-all duration-200 origin-center ${open ? '-rotate-45 -translate-y-[3px]' : ''}`} />
      </button>

      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`md:hidden fixed inset-0 z-30 bg-black/40 transition-opacity duration-200 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside className={`fixed inset-y-0 left-0 z-40 w-56 bg-white border-r border-black/8 flex flex-col transition-transform duration-200 md:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="px-5 py-6 border-b border-black/8">
          <Link href="/" target="_blank"
            className="font-serif text-xl text-[#111] tracking-[-0.01em] hover:opacity-70 transition">
            crafyne
          </Link>
          <span className="block text-[10px] text-[#aaa] mt-0.5 uppercase tracking-widest">CMS</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
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
          <p className="text-[11px] text-[#aaa] mb-2 truncate">{email}</p>
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
    </>
  )
}
