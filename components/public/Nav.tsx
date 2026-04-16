'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const links = [
  { href: '/#work',    label: 'Work' },
  { href: '/#process', label: 'Process' },
  { href: '/blog',     label: 'Blog' },
  { href: '/#team',    label: 'Team' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between
        px-5 md:px-10 py-4 md:py-5
        bg-[rgba(245,244,240,0.88)] backdrop-blur-[14px] transition-all duration-300
        ${scrolled ? 'border-b border-black/8' : 'border-b border-transparent'}`}>

        <Link href="/"
          onClick={() => setOpen(false)}
          className="font-serif text-xl text-ink tracking-[-0.01em] hover:opacity-70 transition">
          crafyne
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className="text-[13.5px] text-ink-2 hover:text-ink transition">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/#contact"
              className="text-[13px] font-medium text-ink border border-black/20 px-5 py-2 rounded-full hover:bg-ink hover:text-bg hover:border-ink transition">
              Start a project
            </Link>
          </li>
        </ul>

        {/* Mobile: hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] z-[60]"
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
        >
          <span className={`block w-5 h-px bg-ink transition-all duration-300 origin-center
            ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
          <span className={`block w-5 h-px bg-ink transition-all duration-300
            ${open ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-5 h-px bg-ink transition-all duration-300 origin-center
            ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 z-40 md:hidden flex flex-col
        bg-[#F5F4F0] transition-all duration-500
        ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>

        <div className="flex flex-col justify-center items-center flex-1 gap-8 pb-20">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-serif text-[clamp(32px,8vw,48px)] text-ink tracking-[-0.02em] hover:text-ink-2 transition"
              style={{ transitionDelay: open ? `${i * 60}ms` : '0ms',
                       opacity: open ? 1 : 0,
                       transform: open ? 'none' : 'translateY(12px)',
                       transition: `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms, color 0.2s` }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="mt-4 bg-ink text-bg px-8 py-3.5 rounded-full text-[15px] font-medium hover:opacity-80 transition"
            style={{ transitionDelay: open ? `${links.length * 60}ms` : '0ms',
                     opacity: open ? 1 : 0,
                     transform: open ? 'none' : 'translateY(12px)',
                     transition: `opacity 0.4s ease ${links.length * 60}ms, transform 0.4s ease ${links.length * 60}ms` }}
          >
            Start a project
          </Link>
        </div>

        <div className="pb-10 text-center">
          <p className="text-[12px] text-ink-3 font-light tracking-wider">crafyne studio</p>
        </div>
      </div>
    </>
  )
}
