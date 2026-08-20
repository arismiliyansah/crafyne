-- ============================================================
-- Crafyne — Allowlist admin untuk RLS
-- Jalankan di: Supabase Dashboard → SQL Editor
-- ============================================================
--
-- MASALAH
-- Semua policy tulis di 001 dan 009 memakai `auth.role() = 'authenticated'`.
-- Artinya SIAPA PUN yang punya akun Supabase di project ini — bukan cuma
-- admin — bisa menulis ke seluruh tabel CMS. Kalau signup publik pernah
-- aktif, itu jalur eskalasi langsung dari "punya akun" ke "bisa mengubah
-- seluruh isi website".
--
-- SOLUSI
-- Tabel allowlist eksplisit + fungsi is_admin(). Punya akun tidak lagi sama
-- dengan punya izin tulis.
--
-- CATATAN AMAN
-- Migrasi ini menyalin SEMUA user yang sudah ada sekarang ke allowlist,
-- jadi menjalankannya tidak akan mengunci kamu dari CMS. Setelah jalan,
-- periksa isi admin_users dan hapus yang tidak seharusnya ada.
-- ============================================================

-- ── Allowlist ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admin_users (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT,
  note       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed dari user yang sudah ada supaya CMS tidak terkunci saat migrasi jalan.
INSERT INTO admin_users (user_id, email, note)
SELECT id, email, 'diseed otomatis oleh migrasi 016'
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- ── Fungsi pemeriksa ─────────────────────────────────────────
-- SECURITY DEFINER supaya policy di tabel lain bisa memanggilnya tanpa
-- terjerat RLS milik admin_users sendiri (yang akan jadi rekursif).
-- search_path dikunci: wajib untuk fungsi SECURITY DEFINER.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid());
$$;

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Hanya admin yang boleh melihat daftar admin. Tidak ada policy tulis:
-- menambah/menghapus admin dilakukan lewat SQL Editor atau service role,
-- bukan dari aplikasi.
DROP POLICY IF EXISTS "admin_read_admin_users" ON admin_users;
CREATE POLICY "admin_read_admin_users"
  ON admin_users FOR SELECT
  USING (public.is_admin());

-- ── Ganti semua policy tulis: authenticated → is_admin() ─────
-- Policy baca publik (published = true, active = true, dst) TIDAK diubah.

DROP POLICY IF EXISTS "admin_all_case_studies" ON case_studies;
CREATE POLICY "admin_all_case_studies" ON case_studies FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_all_posts" ON posts;
CREATE POLICY "admin_all_posts" ON posts FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_all_team" ON team_members;
CREATE POLICY "admin_all_team" ON team_members FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_all_testimonials" ON testimonials;
CREATE POLICY "admin_all_testimonials" ON testimonials FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_all_settings" ON site_settings;
CREATE POLICY "admin_all_settings" ON site_settings FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_all_services" ON services;
CREATE POLICY "admin_all_services" ON services FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_all_stats" ON stats;
CREATE POLICY "admin_all_stats" ON stats FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_all_pricing" ON pricing_tiers;
CREATE POLICY "admin_all_pricing" ON pricing_tiers FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_all_tech" ON tech_groups;
CREATE POLICY "admin_all_tech" ON tech_groups FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_all_faqs" ON faqs;
CREATE POLICY "admin_all_faqs" ON faqs FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Inquiry: publik tetap boleh mengirim (policy "public can submit inquiries"
-- di 005 tidak diubah), tapi hanya admin yang boleh membaca dan mengubah.
DROP POLICY IF EXISTS "admin full access to inquiries" ON project_inquiries;
CREATE POLICY "admin full access to inquiries" ON project_inquiries FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── Storage bucket "media" ───────────────────────────────────

DROP POLICY IF EXISTS "media_auth_insert" ON storage.objects;
CREATE POLICY "media_auth_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

DROP POLICY IF EXISTS "media_auth_update" ON storage.objects;
CREATE POLICY "media_auth_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'media' AND public.is_admin());

DROP POLICY IF EXISTS "media_auth_delete" ON storage.objects;
CREATE POLICY "media_auth_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND public.is_admin());

-- ── Verifikasi ───────────────────────────────────────────────
-- Jalankan setelah migrasi dan pastikan barismu ada di sini:
--   SELECT user_id, email FROM admin_users;
--
-- Menambah admin baru (user harus sudah pernah dibuat di Auth):
--   INSERT INTO admin_users (user_id, email, note)
--   SELECT id, email, 'nama orangnya' FROM auth.users WHERE email = 'orang@crafyne.com';
--
-- Mencabut akses tanpa menghapus akunnya:
--   DELETE FROM admin_users WHERE email = 'orang@crafyne.com';
