'use client'

/**
 * Error boundary khusus CMS.
 *
 * Server action di lib/actions/ sengaja melempar error saat Supabase menolak,
 * supaya kegagalan tidak lagi terlihat seperti sukses. Halaman inilah yang
 * muncul. Di produksi Next menyembunyikan pesan error asli dan hanya mengirim
 * `digest` — kode itu dicetak di sini supaya bisa dicocokkan dengan baris
 * `[cms] gagal ...` di log server.
 */
export default function AdminError({
  error, reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen grid place-items-center bg-[#F9F9F7] p-6">
      <div className="max-w-md w-full bg-white border border-black/8 rounded-lg p-8 text-center">
        <p className="text-xs uppercase tracking-widest text-red-600 mb-3">Gagal disimpan</p>
        <h1 className="text-xl font-medium text-[#111] mb-2">Perubahan kamu tidak tersimpan.</h1>
        <p className="text-sm text-[#666] leading-relaxed mb-5">
          Operasi ke database ditolak, jadi tidak ada yang berubah. Coba lagi — kalau
          terus gagal, cek log server untuk detailnya.
        </p>
        {error.digest && (
          <p className="text-xs font-mono text-[#999] mb-5 break-all">digest: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="px-4 py-2 rounded-md bg-[#111] text-white text-sm">
            Coba lagi
          </button>
          <a href="/admin" className="px-4 py-2 rounded-md border border-black/10 text-sm text-[#333]">
            Kembali ke dashboard
          </a>
        </div>
      </div>
    </main>
  )
}
