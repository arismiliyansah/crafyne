'use client'

import { useFormStatus } from 'react-dom'

/**
 * Tombol submit dengan status pending.
 *
 * Sebelumnya ini tombol biasa tanpa state apa pun: diklik, lalu tidak ada
 * apa-apa di layar sampai server selesai. Pada koneksi lambat itu terbaca
 * seperti tombol rusak, dan orang mengkliknya berkali-kali.
 *
 * useFormStatus() membaca status <form> terdekat, jadi tombol ini harus tetap
 * berada DI DALAM form yang bersangkutan — bukan di komponen yang memanggil
 * action-nya.
 */
export function SubmitButton({ label = 'Save' }: { label?: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="bg-[#111] text-[#F5F4F0] px-6 py-2.5 rounded-md text-sm font-medium hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
    >
      {pending && (
        <span
          aria-hidden="true"
          className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"
        />
      )}
      {pending ? 'Saving…' : label}
    </button>
  )
}
