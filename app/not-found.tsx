import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center text-center px-5">
      <p className="text-[11px] font-medium tracking-[0.13em] uppercase text-ink-3 mb-6">
        404
      </p>
      <h1 className="font-serif text-[clamp(32px,6vw,64px)] font-normal leading-[1.1] tracking-[-0.025em] text-ink mb-4">
        Page not found.
      </h1>
      <p className="text-[15px] text-ink-2 font-light leading-[1.7] max-w-[380px] mb-10">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="text-[14px] text-ink border-b border-ink/25 pb-px hover:border-ink/60 transition"
      >
        ← Back to home
      </Link>
    </main>
  )
}
