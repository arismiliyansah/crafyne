import type { Metadata } from 'next'
import Link from 'next/link'
import { getSettings } from '@/lib/supabase/queries'
import Nav from '@/components/public/landing/Nav'
import Footer from '@/components/public/landing/Footer'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Crafyne collects, stores, and protects your personal data.',
  alternates: { canonical: '/privacy' },
}

export default async function PrivacyPage() {
  const settings = await getSettings()
  const email = settings.agency_email ?? 'contact@crafyne.com'

  return (
    <>
      <Nav email={email} />
      <main>
        <section className="pageHero pageHero--ink">
          <div className="wrap">
            <div className="pageHero__crumb reveal">
              <Link href="/">Crafyne</Link><span>/</span><span>Privacy</span>
            </div>
            <div className="pageHero__eyebrow reveal">/ legal · last updated April 14, 2026</div>
            <h1 className="pageHero__title reveal" data-d="1">Privacy Policy</h1>
          </div>
        </section>

        <div className="wrap" style={{ maxWidth: 760, paddingTop: 56, paddingBottom: 96 }}>
          <div className="prose-crafyne">
            <section>
              <h2>Overview</h2>
              <p>
                Crafyne (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the website crafyne.com. This page
                explains what information we collect when you use this site, how we use it, and your rights regarding
                your data. We keep things simple — we collect only what we need.
              </p>
            </section>

            <section>
              <h2>Information We Collect</h2>
              <p>When you submit a project inquiry through our contact form, we collect the following information you provide voluntarily:</p>
              <ul>
                <li>Your name</li>
                <li>Your email address</li>
                <li>Company name and your role (optional)</li>
                <li>Project type, timeline, and the package you picked (optional)</li>
                <li>A description of your project, and any design references you share</li>
                <li>How you heard about us (optional)</li>
              </ul>
              <p>
                We do not use tracking pixels or fingerprinting, and we never sell or share your data
                with advertisers. Two third-party services do run on this site:
              </p>
              <ul>
                <li>
                  <strong>Umami</strong> — privacy-focused, cookieless analytics. It records page views
                  and referrers in aggregate, and does not build a profile of you.
                </li>
                <li>
                  <strong>Cloudflare Turnstile</strong> — a bot check on the project form. It sees your
                  IP address to tell humans from automated submissions.
                </li>
              </ul>
            </section>

            <section>
              <h2>How We Use Your Information</h2>
              <p>The information you submit through the inquiry form is used solely to:</p>
              <ul>
                <li>Review and respond to your project inquiry</li>
                <li>Communicate with you about potential work together</li>
              </ul>
              <p>We will never sell, rent, or share your personal information with third parties for marketing purposes.</p>
            </section>

            <section>
              <h2>Data Storage</h2>
              <p>
                Inquiry data is stored in a Supabase PostgreSQL database hosted on AWS infrastructure. Supabase
                maintains SOC 2 Type II compliance. Data is encrypted at rest and in transit.
              </p>
              <p>
                We retain inquiry data for up to 2 years, after which it is permanently deleted unless an
                active client relationship requires longer retention.
              </p>
            </section>

            <section>
              <h2>Cookies</h2>
              <p>
                This site does not use cookies for tracking or advertising. A session cookie is set only if you
                access the administrative area of this site (staff only), and is strictly necessary for
                authentication. No cookies are set for visitors to the public site.
              </p>
            </section>

            <section>
              <h2>Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Request a copy of the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent for us to contact you at any time</li>
              </ul>
              <p>
                To exercise any of these rights, contact us at{' '}
                <a href={`mailto:${email}`}>{email}</a>. We will respond within 30 days.
              </p>
            </section>

            <section>
              <h2>Contact</h2>
              <p>If you have any questions about this privacy policy, please contact us at <a href={`mailto:${email}`}>{email}</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  )
}
