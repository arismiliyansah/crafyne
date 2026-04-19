import type { Metadata } from 'next'
import Nav from '@/components/public/Nav'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Crafyne collects, stores, and protects your personal data.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="max-w-[720px] mx-auto px-5 sm:px-8 py-24 md:py-32">
        <p className="text-[11px] font-medium tracking-[0.13em] uppercase text-ink-3 mb-6">
          Legal
        </p>
        <h1 className="font-serif text-[clamp(32px,5vw,56px)] leading-[1.1] tracking-[-0.025em] mb-4">
          Privacy Policy
        </h1>
        <p className="text-[13px] text-ink-3 font-light mb-16">
          Last updated: April 14, 2026
        </p>

        <div className="prose-crafyne space-y-10">

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
            <p>
              When you submit a project inquiry through our contact form, we collect the following information
              you provide voluntarily:
            </p>
            <ul>
              <li>Your name</li>
              <li>Your email address</li>
              <li>Company name (optional)</li>
              <li>Project type, budget range, and timeline (optional)</li>
              <li>A description of your project</li>
            </ul>
            <p>
              We do not collect any information automatically beyond what your browser sends as part of a
              normal HTTP request (IP address, browser type). We do not use tracking pixels, fingerprinting,
              or third-party analytics on this site.
            </p>
          </section>

          <section>
            <h2>How We Use Your Information</h2>
            <p>
              The information you submit through the inquiry form is used solely to:
            </p>
            <ul>
              <li>Review and respond to your project inquiry</li>
              <li>Communicate with you about potential work together</li>
            </ul>
            <p>
              We will never sell, rent, or share your personal information with third parties for marketing
              purposes.
            </p>
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
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Request a copy of the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for us to contact you at any time</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:hello@crafyne.com">hello@crafyne.com</a>. We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at{' '}
              <a href="mailto:hello@crafyne.com">hello@crafyne.com</a>.
            </p>
          </section>

        </div>
      </main>
    </>
  )
}
