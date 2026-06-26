import Link from 'next/link'
import type { SiteSettings } from '@/lib/supabase/types'

export default function Footer({ settings }: { settings: SiteSettings }) {
  const email = settings.agency_email ?? 'contact@crafyne.com'
  const SOCIALS = [
    {
      key: 'footer_instagram_url', label: 'Instagram',
      icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5.5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" /></svg>),
    },
    {
      key: 'footer_facebook_url', label: 'Facebook',
      icon: (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" /></svg>),
    },
    {
      key: 'footer_threads_url', label: 'Threads',
      icon: (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.631 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z" /></svg>),
    },
    {
      key: 'footer_github_url', label: 'GitHub',
      icon: (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.2 11.19.6.11.82-.25.82-.56v-2.16c-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.34-1.73-1.34-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.79 2.81 1.27 3.5.97.11-.76.42-1.27.76-1.56-2.67-.3-5.47-1.31-5.47-5.81 0-1.28.47-2.33 1.24-3.15-.12-.3-.54-1.51.12-3.15 0 0 1.01-.32 3.3 1.2.96-.26 1.98-.39 3-.4 1.02.01 2.04.14 3 .4 2.28-1.52 3.29-1.2 3.29-1.2.66 1.64.24 2.85.12 3.15.77.82 1.24 1.87 1.24 3.15 0 4.51-2.81 5.5-5.49 5.79.43.36.81 1.09.81 2.19v3.25c0 .31.21.68.82.56C20.57 21.91 24 17.49 24 12.29 24 5.78 18.63.5 12 .5z" /></svg>),
    },
  ]
  const socials = SOCIALS.flatMap(s => {
    const url = settings[s.key]
    return url && url !== '#' ? [{ ...s, url }] : []
  })
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
                    <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}>{s.icon}</a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* transparent lockup (no background card) — blends into the footer */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/crafyne-lockup-horizontal.svg" alt="Crafyne" className="foot__lockup" />
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
