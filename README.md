# crafyne.com

Website studio Crafyne beserta CMS-nya. Satu aplikasi Next.js: situs publik di
`app/(public)`, CMS admin di `app/admin`, keduanya membaca Postgres yang sama
lewat Supabase.

## Menjalankan

```bash
npm install
cp .env.local.example .env.local   # lalu isi credentials-nya
npm run dev                        # http://localhost:3000
```

Perintah lain:

| Perintah            | Kegunaan                                      |
| ------------------- | --------------------------------------------- |
| `npm run build`     | Build produksi                                 |
| `npm start`         | Jalankan hasil build secara lokal              |
| `npm run preview`   | Jalankan di runtime `workerd` asli Cloudflare  |
| `npm run deploy`    | Build + deploy ke Cloudflare Workers           |
| `npm run lint`      | ESLint                                         |

## Susunan

```
app/(public)/     Halaman publik — statis + ISR 60 detik
app/admin/        CMS, dijaga getUser() di layout (cms)
lib/supabase/     Client, tipe Database, query publik
lib/actions/      Server action (mutasi CMS, submit inquiry)
components/       landing/ = seksi publik, admin/ = form CMS
supabase/         Migrasi SQL, dijalankan manual lewat SQL Editor
```

## Dua client Supabase — jangan tertukar

| Fungsi                | Cookie | Untuk                                     |
| --------------------- | ------ | ----------------------------------------- |
| `createStaticClient()`| tidak  | Semua halaman publik, sitemap, feed        |
| `createClient()`      | ya     | Halaman admin dan server action            |

Ini bukan sekadar gaya. `createClient()` memanggil `cookies()`, dan memanggil
`cookies()` di dalam sebuah page **memaksa rute itu jadi dynamic rendering** —
`export const revalidate` di halaman tersebut jadi tidak berpengaruh sama
sekali. Halaman publik wajib memakai `createStaticClient()`.

Setelah `npm run build`, cek tabel rutenya: halaman publik harus bertanda `○`
atau `●`, bukan `ƒ`.

## Izin

Otorisasi ditegakkan oleh RLS di Postgres, bukan oleh kode aplikasi. Yang boleh
menulis adalah user yang terdaftar di tabel `admin_users` — lihat
`supabase/migrations/016_admin_allowlist.sql`.

Dua hal yang mudah menjebak:

- Supabase melaporkan penolakan sebagai **nilai**, bukan exception. Server
  action di `lib/actions/` memakai `assertOk`/`assertAffected` supaya kegagalan
  tidak lolos sebagai sukses.
- RLS pada UPDATE/DELETE **tidak** menghasilkan error — baris yang tidak boleh
  disentuh hanya tersaring dan Postgres melapor "sukses, 0 baris". Karena itu
  setiap mutasi diakhiri `.select('id')` dan jumlah barisnya diperiksa.

## Deploy

Situs berjalan di **Cloudflare Workers** lewat `@opennextjs/cloudflare`, dengan
domain `crafyne.com` terpasang sebagai custom domain.

```bash
npm run deploy
```

Perintah itu menjalankan **build lalu deploy**. Jangan panggil
`opennextjs-cloudflare deploy` sendirian — ia hanya mengunggah `.open-next`
yang sudah ada, sehingga kamu bisa men-deploy bundel basi tanpa sadar.

Beberapa hal yang mudah menjebak:

- **`proxy.ts` tidak boleh ada.** Adapter Cloudflare belum mendukung middleware
  runtime Node, dan di Next 16 proxy selalu berjalan di runtime itu tanpa opsi
  untuk mengubahnya. Penjagaan `/admin` ditangani layout `(cms)` dan RLS.
- **`NEXT_PUBLIC_*` ditanam saat build**, bukan dibaca saat runtime. Build wajib
  bisa membacanya, kalau tidak halaman statis akan ter-generate kosong.
- **Rahasia dibaca saat runtime** dan harus dipasang sebagai secret Worker:
  `wrangler secret put RESEND_API_KEY --name crafyne-com`. Menaruhnya di
  `.env.local` saja tidak akan sampai ke produksi.
- Cache ISR tersimpan di bucket R2 `crafyne-com-isr-cache`.

Nama Worker-nya `crafyne-com` — **bukan** `crafyne`, yang sudah dipakai proyek
lain di akun yang sama.

## Email

Notifikasi inquiry dikirim lewat Resend dari domain terverifikasi
`crafyne.com`. Pengirimnya bisa diubah lewat `RESEND_FROM`; penerimanya diatur
dari **/admin/settings → Notification email**, bukan dari kode.

## Migrasi database

File di `supabase/migrations/` dijalankan manual, berurutan, lewat
Supabase Dashboard → SQL Editor. Tidak ada runner otomatis.

## Proteksi bot

Form inquiry dilindungi Cloudflare Turnstile. Selama `TURNSTILE_SECRET_KEY`
kosong, verifikasi dilewati dan form tetap berfungsi; begitu diisi, verifikasi
jadi wajib — pastikan `NEXT_PUBLIC_TURNSTILE_SITE_KEY` ikut diisi.

## Catatan Next.js

Versi Next di proyek ini punya breaking change dibanding yang mungkin kamu
hafal. Baca `node_modules/next/dist/docs/` sebelum menulis kode — lihat juga
`AGENTS.md`.
