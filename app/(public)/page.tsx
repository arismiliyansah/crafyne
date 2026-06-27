import type { Metadata } from 'next'
import {
  getSettings, getServiceCards, getCaseStudies, getTeam, getTestimonials,
  getStats, getPricingTiers, getTechGroups, getFaqs,
} from '@/lib/supabase/queries'
import Nav from '@/components/public/landing/Nav'
import RevealController from '@/components/public/landing/RevealController'
import Hero from '@/components/public/landing/Hero'
import Stats from '@/components/public/landing/Stats'
import LogoStrip from '@/components/public/landing/LogoStrip'
import Services from '@/components/public/landing/Services'
import Process from '@/components/public/landing/Process'
import CaseStudies from '@/components/public/landing/CaseStudies'
import Team from '@/components/public/landing/Team'
import Testimonials from '@/components/public/landing/Testimonials'
import Pricing from '@/components/public/landing/Pricing'
import TechStack from '@/components/public/landing/TechStack'
import CTA from '@/components/public/landing/CTA'
import FAQ from '@/components/public/landing/FAQ'
import Footer from '@/components/public/landing/Footer'

export const revalidate = 60
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default async function HomePage() {
  const [settings, services, cases, team, testimonials, stats, tiers, groups, faqs] = await Promise.all([
    getSettings(),
    getServiceCards(),
    getCaseStudies(),
    getTeam(),
    getTestimonials(),
    getStats(),
    getPricingTiers(),
    getTechGroups(),
    getFaqs(),
  ])

  const clients = (settings.proof_clients ?? '').split(',').map(s => s.trim()).filter(Boolean)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Crafyne',
    url: 'https://crafyne.com',
    logo: 'https://crafyne.com/og-image.png?v=2',
    description: settings.agency_tagline ?? 'A small, senior team of engineers and designers building software for people who care how it feels.',
    email: settings.agency_email ?? undefined,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav email={settings.agency_email ?? 'contact@crafyne.com'} />
      <RevealController />
      <Hero settings={settings} />
      <Stats stats={stats} eyebrow={settings.stats_eyebrow ?? 'by the numbers'} title={settings.stats_title ?? 'Eight years of shipped products, measured in trust not tickets.'} />
      <LogoStrip clients={clients} />
      <Services services={services} />
      <Process />
      <CaseStudies cases={cases} />
      <Team team={team} settings={settings} />
      <Testimonials testimonials={testimonials} />
      <Pricing tiers={tiers} settings={settings} />
      <TechStack groups={groups} />
      <CTA settings={settings} />
      <FAQ faqs={faqs} />
      <Footer settings={settings} />
    </>
  )
}
