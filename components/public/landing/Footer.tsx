import Link from 'next/link'
import type { SiteSettings } from '@/lib/supabase/types'

export default function Footer({ settings }: { settings: SiteSettings }) {
  const email = settings.agency_email ?? 'contact@crafyne.com'
  const socials = [
    { label: 'LinkedIn', short: 'Li', url: settings.footer_linkedin_url },
    { label: 'X', short: 'X', url: settings.footer_x_url },
    { label: 'GitHub', short: 'Gh', url: settings.footer_github_url },
    { label: 'Dribbble', short: 'Dr', url: settings.footer_dribbble_url },
    { label: 'Instagram', short: 'Ig', url: settings.footer_instagram_url },
  ].filter((s): s is { label: string; short: string; url: string } => !!s.url && s.url !== '#')
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__top">
          <div className="foot__brand">
            <div className="foot__brandLine">
              {/* white artwork for the dark footer */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/crafyne-nav-dark.svg?v=2" alt="Crafyne" className="foot__logo" />
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
              <Link href="/about">About</Link>
              <Link href="/blog">Journal</Link>
              <Link href="/careers">Careers</Link>
              <Link href="/#faq">FAQ</Link>
            </div>
            <div className="foot__col">
              <div className="foot__h mono">Get in touch</div>
              <a className="mono" href={`mailto:${email}`}>{email}</a>
              <Link className="mono" href="/contact">Start a project</Link>
              {socials.length > 0 && (
                <div className="foot__social">
                  {socials.map(s => (
                    <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}>{s.short}</a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/crafyne-lockup-horizontal-dark.svg" alt="Crafyne" className="foot__lockup" />
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
