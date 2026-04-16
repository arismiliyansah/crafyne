import type { Metadata } from 'next'
import { Instrument_Serif, Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const serif = Instrument_Serif({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const sans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://crafyne.com'),
  title: {
    default: 'Crafyne — Software Studio',
    template: '%s — Crafyne',
  },
  description:
    'A small, senior team of engineers and designers building software for people who care how it feels.',
  openGraph: {
    type: 'website',
    siteName: 'Crafyne',
    locale: 'en_US',
    url: 'https://crafyne.com',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Crafyne — Software Studio' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  alternates: {
    types: {
      'application/rss+xml': 'https://crafyne.com/feed.xml',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} data-scroll-behavior="smooth">
      <body>
        {children}
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
