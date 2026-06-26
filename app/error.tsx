'use client'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '80px 20px', background: 'var(--cream)', color: 'var(--ink)' }}>
      <div style={{ textAlign: 'center', maxWidth: 520 }}>
        <div className="eyebrow" style={{ color: 'var(--crimson)', marginBottom: 16 }}>/ something broke</div>
        <h1 className="display" style={{ fontSize: 'clamp(32px, 6vw, 56px)', lineHeight: 1.05, margin: 0 }}>
          Something went wrong.
        </h1>
        <p style={{ color: 'var(--mute)', fontSize: 16, lineHeight: 1.6, margin: '16px 0 28px' }}>
          An unexpected error occurred on our side. Try again, or head back home.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={reset} className="btn btn--ink">Try again</button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="btn btn--ghost">Go home</a>
        </div>
      </div>
    </main>
  )
}
