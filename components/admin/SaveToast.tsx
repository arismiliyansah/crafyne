'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

/**
 * Konfirmasi "tersimpan" untuk seluruh CMS.
 *
 * Server action di lib/actions/ me-redirect ke halaman yang sama setelah
 * berhasil, jadi dari sisi user tidak ada yang berubah di layar — tidak ada
 * cara membedakan "tersimpan" dari "tombolnya tidak jalan". Sekarang action
 * menambahkan ?saved=<timestamp> dan komponen ini menampilkannya.
 *
 * Timestamp-nya penting, bukan sekadar ?saved=1: menyimpan dua kali berturut
 * -turut akan menghasilkan URL yang sama, komponen tidak remount, dan toast
 * kedua tidak pernah muncul.
 *
 * Tidak ada state lokal — URL-nya sendiri yang jadi state. Setelah beberapa
 * detik parameternya dihapus, dan toast ikut hilang dengan sendirinya.
 */
const MESSAGES: Record<string, string> = {
  saved:   'Changes saved',
  deleted: 'Deleted',
}

export default function SaveToast() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const kind = Object.keys(MESSAGES).find(k => params.get(k)) ?? null
  const stamp = kind ? params.get(kind) : null

  useEffect(() => {
    if (!stamp) return
    const t = setTimeout(() => router.replace(pathname, { scroll: false }), 3200)
    return () => clearTimeout(t)
  }, [stamp, pathname, router])

  if (!kind) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-lg bg-[#111] px-4 py-3 text-sm text-[#F5F4F0] shadow-lg"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M20 6 9 17l-5-5"
          fill="none"
          stroke="#7BD88F"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {MESSAGES[kind]}
    </div>
  )
}
