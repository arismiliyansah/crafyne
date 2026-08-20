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
| `npm start`         | Jalankan hasil build                           |
| `npm run start:prod`| Jalankan lewat `server.js` (custom HTTP server)|
| `npm run lint`      | ESLint                                         |

## Susunan

```
app/(public)/     Halaman publik — statis + ISR 60 detik
app/admin/        CMS, dilindungi proxy.ts + cek sesi di layout
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

## Migrasi

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
