'use client'

import { useEffect, useRef } from 'react'

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  remove: (widgetId: string) => void
  reset: (widgetId?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
    onloadTurnstileCallback?: () => void
  }
}

const SCRIPT_ID = 'cf-turnstile'
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback'

/**
 * Widget Turnstile dengan explicit render.
 *
 * Explicit, bukan implicit (class .cf-turnstile), karena implicit rendering
 * memindai DOM sekali saat script dimuat — widget yang baru muncul setelah
 * navigasi client-side tidak akan pernah dirender.
 */
export default function Turnstile({ siteKey, onToken }: { siteKey: string; onToken: (token: string) => void }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)

  // Callback disimpan di ref supaya effect render widget tidak perlu men-depend
  // padanya — kalau ikut jadi dependency, tiap render induk akan membuat ulang
  // widget. Ref-nya di-update di dalam effect, bukan saat render: widget baru
  // memanggil callback setelah user berinteraksi, jauh sesudah mount.
  const onTokenRef = useRef(onToken)
  useEffect(() => { onTokenRef.current = onToken }, [onToken])

  useEffect(() => {
    let cancelled = false

    const render = () => {
      if (cancelled || widgetId.current || !boxRef.current || !window.turnstile) return
      widgetId.current = window.turnstile.render(boxRef.current, {
        sitekey: siteKey,
        callback: (token: string) => onTokenRef.current(token),
        'expired-callback': () => onTokenRef.current(''),
        'error-callback': () => onTokenRef.current(''),
        theme: 'light',
      })
    }

    if (window.turnstile) {
      render()
    } else {
      window.onloadTurnstileCallback = render
      if (!document.getElementById(SCRIPT_ID)) {
        const s = document.createElement('script')
        s.id = SCRIPT_ID
        s.src = SCRIPT_SRC
        s.async = true
        s.defer = true
        document.head.appendChild(s)
      }
    }

    return () => {
      cancelled = true
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current)
        widgetId.current = null
      }
    }
  }, [siteKey])

  return <div ref={boxRef} className="pf__turnstile" />
}
