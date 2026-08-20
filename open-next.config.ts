import { defineCloudflareConfig } from '@opennextjs/cloudflare'

/**
 * Konfigurasi adapter Cloudflare.
 *
 * Cache untuk ISR belum dipasang di sini. Halaman publik memakai
 * `revalidate = 60`, dan tanpa incremental cache setiap Worker akan
 * me-regenerate sendiri-sendiri alih-alih berbagi hasil. Itu tetap berfungsi,
 * hanya kurang efisien — binding R2/KV ditambahkan setelah resource-nya dibuat
 * di akun Cloudflare, supaya langkah ini tidak bergantung pada akun.
 */
export default defineCloudflareConfig()
