import Link from 'next/link'
import type { SiteSettings } from '@/lib/supabase/types'

export default function Footer({ settings }: { settings: SiteSettings }) {
  const email = settings.agency_email ?? 'hello@crafyne.studio'
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__top">
          <div className="foot__brand">
            <div className="foot__brandLine">
              <span className="foot__mark" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M4 4h7a6 6 0 0 1 0 12H8l8 4H4z" fill="currentColor" /></svg>
              </span>
              <span className="foot__brandName display" data-brand-name>Crafyne</span>
            </div>
            <p className="foot__line">
              {settings.agency_tagline ?? 'An independent software studio. We build software for people who care how it feels.'}
            </p>
            <div className="foot__addr mono">
              {settings.agency_address ?? 'Setiabudi One, 14th floor'}<br />
              {settings.agency_location ?? 'Jakarta · Indonesia'}
            </div>
          </div>
          <div className="foot__cols">
            <div className="foot__col">
              <div className="foot__h mono">Studio</div>
              <Link href="/work">Work</Link>
              <Link href="/#services">Services</Link>
              <Link href="/#process">Process</Link>
              <Link href="/#pricing">Pricing</Link>
              <Link href="/#team">Team</Link>
            </div>
            <div className="foot__col">
              <div className="foot__h mono">Company</div>
              <Link href="/#team">About</Link>
              <Link href="/blog">Journal</Link>
              <Link href="/#contact">Contact</Link>
              <Link href="/#faq">FAQ</Link>
            </div>
            <div className="foot__col">
              <div className="foot__h mono">Get in touch</div>
              <a className="mono" href={`mailto:${email}`}>{email}</a>
              <Link className="mono" href="/#contact">Start a project</Link>
              <div className="foot__social">
                <a href="#" aria-label="LinkedIn">Li</a>
                <a href="#" aria-label="X">X</a>
                <a href="#" aria-label="Github">Gh</a>
                <a href="#" aria-label="Dribbble">Dr</a>
              </div>
            </div>
          </div>
        </div>
        <div className="foot__wordmark display" aria-hidden="true">CRAFYNE</div>
        <div className="foot__bot">
          <div className="mono">© {new Date().getFullYear()} {settings.footer_copyright ?? 'Crafyne Studio · Booking Q3 slots'}</div>
          <div className="foot__legal mono">
            <Link href="/privacy">Privacy</Link>
            <span>·</span>
            <a href="#">Terms</a>
            <span>·</span>
            <a href="#">Colophon</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
