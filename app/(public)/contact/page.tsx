import type { Metadata } from 'next'
import Link from 'next/link'
import { getSettings } from '@/lib/supabase/queries'
import Nav from '@/components/public/landing/Nav'
import Footer from '@/components/public/landing/Footer'
import RevealController from '@/components/public/landing/RevealController'
import ContactForm from '@/components/public/landing/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a project with Crafyne. Tell us what you’re building — a real human replies within one working day.',
  alternates: { canonical: '/contact' },
  openGraph: {
    type: 'website',
    title: 'Contact — Crafyne',
    description: 'Start a project with Crafyne. A real human replies within one working day.',
    url: '/contact',
    images: [{ url: '/og-image.png?v=2', width: 1200, height: 630, alt: 'Contact Crafyne' }],
  },
}

export default async function ContactPage() {
  const settings = await getSettings()
  const email = settings.agency_email ?? 'contact@crafyne.com'

  return (
    <>
      <Nav email={email} />
      <RevealController />
      <main className="contactPage">
        <section className="pageHero pageHero--crimson">
          <div className="wrap">
            <div className="pageHero__crumb reveal">
              <Link href="/">Crafyne</Link><span>/</span><span>Contact</span>
            </div>
            <div className="pageHero__eyebrow reveal">/ start a project</div>
            <h1 className="pageHero__title reveal" data-d="1">
              Tell us what <span className="italic">you&rsquo;re building.</span>
            </h1>
            <p className="pageHero__sub reveal" data-d="2">
              A real human replies within one working day with honest first impressions. If we&rsquo;re not
              the right team, we&rsquo;ll tell you who is.
            </p>
          </div>
        </section>

        <section>
          <div className="wrap contactGrid">
            <aside className="contactInfo">
              <div className="contactInfo__avail reveal">
                <div className="contactInfo__availLabel"><span className="contactInfo__dot" /> Booking now</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600 }}>Next slot opens Aug 4, 2026</div>
                <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>We respond to all inquiries within one working day, Asia/Jakarta hours.</div>
              </div>
              <div className="contactInfo__group reveal" data-d="1">
                <span className="contactInfo__label">Email</span>
                <span className="contactInfo__val"><a href={`mailto:${email}`}>{email}</a></span>
              </div>
              <div className="contactInfo__group reveal" data-d="2">
                <span className="contactInfo__label">Studio</span>
                <span className="contactInfo__val" style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.5 }}>
                  {settings.agency_address ?? 'Setiabudi One, 14th floor'}<br />
                  {settings.agency_location ?? 'Jakarta, Indonesia'}
                </span>
              </div>
              <div className="contactInfo__group reveal" data-d="3">
                <span className="contactInfo__label">Hours</span>
                <span className="contactInfo__val" style={{ fontSize: 16 }}>Mon–Fri · 09:00–18:00 WIB</span>
              </div>
            </aside>

            <ContactForm />
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  )
}
