-- ============================================================
-- Crafyne — Larang upload SVG ke bucket "media"
-- Jalankan di: Supabase Dashboard → SQL Editor
-- ============================================================
--
-- MASALAH
-- Bucket "media" bersifat publik dan Supabase menyajikan file dengan
-- content-type aslinya. Sebuah .svg yang diupload lewat CMS bisa berisi
-- <script>, dan membuka URL publiknya akan mengeksekusi script itu di
-- origin yang sama dengan situs — stored XSS.
--
-- Daftar ACCEPT di komponen upload sudah diperketat, tapi itu hanya di
-- browser dan bisa dilewati. Batas sebenarnya ada di sini.
--
-- SVG milik brand tetap aman karena disajikan dari public/brand/ lewat repo,
-- bukan dari bucket ini.
-- ============================================================

UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
WHERE id = 'media';

-- Verifikasi:
--   SELECT id, public, file_size_limit, allowed_mime_types
--   FROM storage.buckets WHERE id = 'media';
--
-- Catatan: SVG yang sudah terlanjur diupload TIDAK ikut terhapus. Cek dulu:
--   SELECT name FROM storage.objects
--   WHERE bucket_id = 'media' AND name ILIKE '%.svg';
