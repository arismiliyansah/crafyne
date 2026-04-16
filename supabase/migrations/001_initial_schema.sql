-- ============================================================
-- Crafyne CMS — Initial Schema
-- Jalankan di: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Enable extensions ───────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Case Studies ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS case_studies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  client          TEXT NOT NULL,
  year            INTEGER,
  tagline         TEXT,                    -- "Platform rebuild, 2024"
  outcome         TEXT,                    -- "Load times down 80%"
  challenge       TEXT,                    -- Long-form markdown
  solution        TEXT,                    -- Long-form markdown
  cover_image_url TEXT,
  gallery_urls    TEXT[]  DEFAULT '{}',
  tags            TEXT[]  DEFAULT '{}',
  featured        BOOLEAN DEFAULT false,
  published       BOOLEAN DEFAULT false,
  display_order   INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ── Blog Posts ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  excerpt         TEXT,
  content         TEXT,                    -- Markdown
  cover_image_url TEXT,
  published       BOOLEAN DEFAULT false,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ── Team Members ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  role          TEXT NOT NULL,
  bio           TEXT,
  photo_url     TEXT,
  linkedin_url  TEXT,
  github_url    TEXT,
  display_order INTEGER DEFAULT 0,
  active        BOOLEAN DEFAULT true
);

-- ── Testimonials ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote          TEXT NOT NULL,
  author_name    TEXT NOT NULL,
  author_role    TEXT,
  author_company TEXT,
  featured       BOOLEAN DEFAULT false,
  display_order  INTEGER DEFAULT 0
);

-- ── Site Settings (key-value) ────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Default Settings ──────────────────────────────────────────
INSERT INTO site_settings (key, value) VALUES
  ('hero_eyebrow',       'Software Studio — Est. 2020'),
  ('hero_headline',      'We build software for people who care how it feels.'),
  ('hero_subheadline',   'A small, senior team of engineers and designers. We take on three projects a year.'),
  ('hero_cta_primary',   'Start a project'),
  ('hero_cta_secondary', 'See our work'),
  ('proof_clients',      'Meridian,Holm Systems,Verdant,Croft,Stratum,Oriel'),
  ('agency_email',       'hello@crafyne.co'),
  ('agency_location',    'Amsterdam, The Netherlands'),
  ('agency_tagline',     'A software studio for people who care how it feels. Based in Amsterdam, working globally.'),
  ('agency_founded',     '2020'),
  ('contact_invite',     'Let''s make something worth making.')
ON CONFLICT (key) DO NOTHING;

-- ── Seed: Services (via site_settings) ───────────────────────
-- Services disimpan sebagai JSON di site_settings untuk kemudahan edit
INSERT INTO site_settings (key, value) VALUES
  ('services', '[
    {"order":1,"name":"Product Engineering","description":"Full-stack web and mobile applications, built to last. We obsess over performance, reliability, and the small details that make software feel effortless."},
    {"order":2,"name":"Design Systems","description":"The invisible scaffolding that lets your product scale without losing its soul. Tokens, components, documentation, and the processes that keep consistency effortless."},
    {"order":3,"name":"AI Integration","description":"Thoughtful AI features that genuinely change what your product can do — not AI for its own sake. We identify where intelligence creates real leverage, and build it carefully."}
  ]')
ON CONFLICT (key) DO NOTHING;

-- ── Seed: Sample Team Members ────────────────────────────────
INSERT INTO team_members (name, role, bio, display_order) VALUES
  ('James Rowe',    'Founder, Engineering', 'Full-stack engineer with 12 years of experience building products for startups and scale-ups.', 1),
  ('Mara Tanaka',   'Design Lead',          'Product designer focused on systems thinking and interaction design.', 2),
  ('Leon Kuipers',  'Full-Stack Engineer',   'Specialises in performance-critical web applications and API design.', 3),
  ('Suki Watanabe', 'AI & Infrastructure',   'ML engineer and DevOps specialist. Makes complex systems simple to operate.', 4)
ON CONFLICT DO NOTHING;

-- ── Seed: Sample Testimonial ─────────────────────────────────
INSERT INTO testimonials (quote, author_name, author_role, author_company, featured, display_order) VALUES
  ('Working with Crafyne felt like finally having engineers who understood that the product is more than just features. They built something we''re genuinely proud of.',
   'Elina Vosch', 'CEO', 'Meridian', true, 1)
ON CONFLICT DO NOTHING;

-- ── Seed: Sample Case Studies ────────────────────────────────
INSERT INTO case_studies (slug, client, year, tagline, outcome, challenge, solution, featured, published, display_order) VALUES
  ('meridian',     'Meridian',     2024, 'Platform rebuild',   'Load times down 80%',        'Legacy monolith slowing down a growing product team.', 'Full platform rebuild with modern stack, incremental migration.', true, true, 1),
  ('holm-systems', 'Holm Systems', 2024, 'Design system',      'Serving 40+ product teams',  'Inconsistent UI across 40+ product teams.', 'Token-based design system with Storybook documentation.', false, true, 2),
  ('verdant',      'Verdant',      2023, 'AI integration',     'Engagement up 3×',           'Needed to add AI features without disrupting existing UX.', 'Embedded AI recommendations as a progressive layer.', false, true, 3),
  ('croft',        'Croft',        2023, 'Consumer launch',    'Zero to 100k users in 10 weeks', 'Launch a consumer product under tight deadline.', 'Lean MVP with aggressive performance budgets from day one.', false, true, 4)
ON CONFLICT DO NOTHING;

-- ── updated_at triggers ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER case_studies_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ───────────────────────────────────────
-- Public: bisa baca data yang published
-- Admin: full access (via service role key di server actions)

ALTER TABLE case_studies  ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members   ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials   ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings  ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "public_read_case_studies"
  ON case_studies FOR SELECT USING (published = true);

CREATE POLICY "public_read_posts"
  ON posts FOR SELECT USING (published = true);

CREATE POLICY "public_read_team"
  ON team_members FOR SELECT USING (active = true);

CREATE POLICY "public_read_testimonials"
  ON testimonials FOR SELECT USING (true);

CREATE POLICY "public_read_settings"
  ON site_settings FOR SELECT USING (true);

-- Admin full access via authenticated role (Supabase Auth)
CREATE POLICY "admin_all_case_studies"
  ON case_studies FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_posts"
  ON posts FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_team"
  ON team_members FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_testimonials"
  ON testimonials FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_settings"
  ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- ── Storage bucket untuk media ───────────────────────────────
-- Jalankan ini setelah schema di atas:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
