import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'
import { withRegionalCache } from '@opennextjs/cloudflare/overrides/incremental-cache/regional-cache'

/**
 * Konfigurasi adapter Cloudflare.
 *
 * Halaman publik memakai `revalidate = 60`. Tanpa incremental cache bersama,
 * setiap isolate Worker akan me-regenerate halaman sendiri-sendiri — tetap
 * benar, tapi boros dan membuat Supabase ditembak jauh lebih sering dari perlu.
 *
 * R2 dipilih sebagai penyimpan hasil regenerasi. withRegionalCache
 * membungkusnya dengan cache regional supaya permintaan berulang di wilayah
 * yang sama tidak selalu menembus R2.
 */
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    mode: 'long-lived',
  }),
})
