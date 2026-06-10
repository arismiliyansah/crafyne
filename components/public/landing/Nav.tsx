'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

// Absolute hrefs so the nav works from any page (hash links jump to homepage sections).
const links = [
  { href: '/work', label: 'Work' },
  { href: '/#services', label: 'Services' },
  { href: '/#process', label: 'Process' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Journal' },
]

export default function Nav({ email }: { email: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock page scroll while the mobile menu is open (lock html & body — on mobile
  // the scroll container is often the html element, not body).
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    if (menuOpen) {
      html.style.overflow = 'hidden'
      body.style.overflow = 'hidden'
      html.classList.add('nav-locked')
    } else {
      html.style.overflow = ''
      body.style.overflow = ''
      html.classList.remove('nav-locked')
    }
    return () => {
      html.style.overflow = ''
      body.style.overflow = ''
      html.classList.remove('nav-locked')
    }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <nav className={'nav ' + (scrolled ? 'nav--scrolled ' : '') + (menuOpen ? 'nav--menu-open' : '')}>
      <div className="nav__inner wrap" style={{ height: '44px' }}>
        <Link href="/" className="nav__brand" onClick={() => setMenuOpen(false)}>
          <span className="nav__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M4 4h7a6 6 0 0 1 0 12H8l8 4H4z" fill="currentColor" /></svg>
          </span>
          <span data-brand-name>Crafyne</span>
          <span className="nav__brand-suffix mono">/studio</span>
        </Link>

        <div className="nav__links" style={{ fontSize: '16px', fontWeight: 700 }}>
          {links.map(l => (<Link key={l.label} href={l.href}>{l.label}</Link>))}
        </div>

        <div className="nav__cta">
          <a href={`mailto:${email}`} className="nav__login mono">{email}</a>
          <Link href="/contact" className="btn btn--ink nav__book">
            Book a call
            <span className="btn__arrow" aria-hidden="true">
              <svg viewBox="0 0 12 12"><path d="M3 9 9 3M9 3H4M9 3v5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
            </span>
          </Link>
        </div>

        <button
          className="nav__burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span className="nav__burgerBox" aria-hidden="true">
            <span className="nav__burgerLine" />
            <span className="nav__burgerLine" />
          </span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div className={'navMenu ' + (menuOpen ? 'navMenu--open' : '')} aria-hidden={!menuOpen}>
        <button className="navMenu__close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
        </button>
        <div className="navMenu__inner">
          <ul className="navMenu__list">
            {links.map((l, i) => (
              <li className="navMenu__item" key={l.label} style={{ transitionDelay: (menuOpen ? 0.12 + i * 0.05 : 0) + 's' }}>
                <Link href={l.href} onClick={() => setMenuOpen(false)}>
                  <span className="navMenu__num mono">/{String(i + 1).padStart(2, '0')}</span>
                  <span className="navMenu__label">{l.label}</span>
                  <span className="navMenu__arr" aria-hidden="true">
                    <svg viewBox="0 0 14 14"><path d="M3 11 11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="navMenu__foot" style={{ transitionDelay: (menuOpen ? 0.12 + links.length * 0.05 : 0) + 's' }}>
            <Link href="/contact" className="btn btn--orange navMenu__cta" onClick={() => setMenuOpen(false)}>
              Book a call
              <span className="btn__arrow" aria-hidden="true">
                <svg viewBox="0 0 12 12"><path d="M3 9 9 3M9 3H4M9 3v5" stroke="#0E1530" strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
              </span>
            </Link>
            <a className="navMenu__mail mono" href={`mailto:${email}`}>{email}</a>
          </div>
        </div>
      </div>
    </nav>
  )
}
