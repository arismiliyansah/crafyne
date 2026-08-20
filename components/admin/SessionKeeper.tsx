'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/**
 * Menjaga sesi admin tetap segar tanpa middleware.
 *
 * Dulu proxy.ts memanggil getUser() pada setiap permintaan, dan di situlah
 * @supabase/ssr memperbarui token yang hampir kedaluwarsa lalu menulis ulang
 * cookie-nya. Proxy sudah dihapus (adapter Cloudflare tidak mendukung
 * middleware runtime Node), jadi mekanisme itu perlu pengganti.
 *
 * Server Component tidak bisa menulis cookie — createClient() di server.ts
 * bahkan sengaja menelan errornya. Jadi penyegaran harus datang dari browser:
 * createBrowserClient menyimpan sesi di cookie dan otomatis memperbarui token
 * selama halaman terbuka, sehingga server ikut membaca cookie yang sudah baru.
 *
 * Komponen ini tidak merender apa pun. Ia hanya perlu ada supaya client-nya
 * hidup selama admin membuka CMS.
 */
export default function SessionKeeper() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      // Sesi habis atau dicabut dari perangkat lain — jangan biarkan admin
      // mengetik satu halaman penuh lalu kehilangan semuanya saat menyimpan.
      if (event === 'SIGNED_OUT') router.replace('/admin/login')
      // Token baru sudah ditulis ke cookie; segarkan Server Component agar
      // ikut memakai sesi yang diperbarui.
      if (event === 'TOKEN_REFRESHED') router.refresh()
    })

    return () => subscription.unsubscribe()
  }, [router])

  return null
}
