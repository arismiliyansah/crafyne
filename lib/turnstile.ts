/**
 * Verifikasi Cloudflare Turnstile di sisi server.
 *
 * Pengganti honeypot yang dicopot di commit 399107a. Honeypot itu memberi
 * false positive (password manager mengisi field tersembunyi) sehingga
 * inquiry asli dibuang diam-diam. Turnstile tidak punya masalah itu.
 *
 * Aktif/tidaknya ditentukan oleh TURNSTILE_SECRET_KEY, bukan oleh site key
 * yang publik. Kalau penentunya site key, penyerang tinggal tidak mengirim
 * token untuk melewati pemeriksaan.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export type TurnstileResult = { ok: true } | { ok: false; reason: string }

export async function verifyTurnstile(token: string, remoteIp?: string): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY

  // Belum dikonfigurasi — lewati, supaya form tetap bisa dipakai sebelum
  // key-nya dipasang. Begitu secret ada, verifikasi jadi wajib.
  if (!secret) return { ok: true }

  if (!token) return { ok: false, reason: 'token-kosong' }

  const body = new URLSearchParams({ secret, response: token })
  if (remoteIp) body.set('remoteip', remoteIp)

  let data: { success?: boolean; 'error-codes'?: string[] }
  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    data = await res.json()
  } catch (e) {
    // Cloudflare tidak terjangkau. Sengaja fail-open: menolak lead asli
    // karena masalah jaringan kita sendiri lebih mahal daripada meloloskan
    // segelintir spam. Verdict "token tidak valid" di bawah tetap fail-closed.
    console.error('[turnstile] verifikasi tidak bisa dijangkau, dilewati:', e instanceof Error ? e.message : e)
    return { ok: true }
  }

  if (data.success) return { ok: true }
  return { ok: false, reason: (data['error-codes'] ?? []).join(', ') || 'ditolak' }
}
