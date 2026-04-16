-- ============================================================
-- Crafyne — Proper Case Study Data + Images
-- Jalankan di: Supabase Dashboard → SQL Editor
-- ============================================================

-- Hapus data sample lama
DELETE FROM case_studies;

-- Insert data proper
INSERT INTO case_studies (slug, client, year, tagline, outcome, challenge, solution, cover_image_url, gallery_urls, tags, featured, published, display_order) VALUES

-- ── 1. Meridian ─────────────────────────────────────────────
(
  'meridian',
  'Meridian',
  2024,
  'Platform rebuild',
  'Load times down 80%. Engineering velocity up 3×.',
  'Meridian had built their core analytics platform on a five-year-old Rails monolith. As the product grew to serve 12,000 daily active users, the architecture started showing its age — deployments took 40 minutes, pages loaded in 8–12 seconds, and adding new features required touching code nobody fully understood anymore.

The engineering team was spending more time managing technical debt than shipping value. They needed a path forward that wouldn''t require shutting down a live product.',
  'We started with a six-week discovery phase embedded inside Meridian''s engineering team — reading code, sitting in sprint planning, and talking to the developers who lived with the pain daily. The goal was to understand the system before proposing anything.

Our recommendation was an incremental strangler fig migration: build a new Next.js frontend that progressively replaced pages of the old Rails app, while extracting backend logic into focused services over time. No big-bang rewrite. No flag day.

We delivered the new architecture in three phases over eight months. By the end, page load times had dropped from an average of 9.4 seconds to under 1.2 seconds. Deployment time went from 40 minutes to 4. The engineering team, now working in a codebase they understood, shipped features in days rather than weeks.',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80'
  ],
  ARRAY['Next.js', 'Rails', 'PostgreSQL', 'Platform Migration', 'Performance'],
  true,
  true,
  1
),

-- ── 2. Holm Systems ──────────────────────────────────────────
(
  'holm-systems',
  'Holm Systems',
  2024,
  'Design system at scale',
  'Adopted by 40+ teams. Component library with 180+ components.',
  'Holm Systems is an enterprise software company with 600 engineers across 40 product teams. Each team had built their own UI components independently — the result was a product that looked different depending on which part you were using, and a company spending thousands of engineering hours rebuilding the same buttons, forms, and modals over and over.

They had tried twice before to build a design system. Both times it had stalled and been abandoned within six months.',
  'The previous attempts had failed for a predictable reason: they were built by a central team in isolation and then handed over to product teams who hadn''t been involved. Adoption was treated as a rollout problem rather than a design problem.

We approached this differently. We started by running two weeks of interviews with engineers and designers across eight product teams — understanding what they actually needed, what had frustrated them about the previous attempts, and what would make them trust and use a shared system.

The design system we built was token-based, with a clear separation between primitive components and pattern-level compositions. We wrote documentation that treated engineers as the primary audience. We ran office hours every week for the first six months. We tracked adoption not as a vanity metric but as a signal of whether we were building the right thing.

Eighteen months later, the system has 180+ components, 40 teams using it in production, and a dedicated internal team maintaining it. The estimated time saved across the company is 14,000 engineering hours per year.',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1200&q=80',
    'https://images.unsplash.com/photo-1618788372246-79faff0c3742?w=1200&q=80',
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80'
  ],
  ARRAY['Design System', 'React', 'Storybook', 'Figma', 'TypeScript'],
  false,
  true,
  2
),

-- ── 3. Verdant ───────────────────────────────────────────────
(
  'verdant',
  'Verdant',
  2023,
  'AI-powered recommendations',
  'Engagement up 3×. Time-on-platform up 2.4×. Churn down 18%.',
  'Verdant is a B2C platform for independent creators. They had 180,000 monthly active users and strong initial retention — but engagement dropped sharply after the first two weeks. Users would sign up, explore the platform for a while, and then stop coming back.

The hypothesis was that users weren''t finding content relevant to them quickly enough. The platform had a lot of good content, but discovery was driven by simple chronological feeds and manual category browsing. Verdant needed a way to surface the right content to the right person at the right time.',
  'We scoped the problem carefully before writing any code. AI recommendations are easy to build poorly — systems that optimise for clicks rather than satisfaction, or that create filter bubbles that make the platform feel smaller over time.

We started by defining what "good" looked like: not just engagement metrics, but diversity of content consumed, creator discovery (finding new creators, not just favorites), and explicit user satisfaction signals. Then we designed a recommendation model that balanced these objectives rather than optimising for a single number.

The system we built ran on the existing infrastructure with minimal added cost. It used a lightweight collaborative filtering model for content recommendations, combined with a re-ranking layer that injected diversity and creator discovery signals. We A/B tested it against the control for six weeks before a full rollout.

The results were better than the original hypothesis: engagement up 3×, time on platform up 2.4×, and churn in the 30-day window down 18%. Crucially, creator discovery was up significantly — a sign the system was growing the platform rather than just deepening existing usage.',
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1600&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
    'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=1200&q=80',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80'
  ],
  ARRAY['Machine Learning', 'Python', 'React', 'Recommendation Engine', 'A/B Testing'],
  false,
  true,
  3
),

-- ── 4. Croft ────────────────────────────────────────────────
(
  'croft',
  'Croft',
  2023,
  'Zero to launch in 10 weeks',
  '100k users in 10 weeks. App Store rating 4.8. Series A closed 6 weeks post-launch.',
  'Croft came to us with a validated concept, a small founding team, and a very specific goal: launch a consumer iOS and Android app in 10 weeks to hit a funding milestone. The window was non-negotiable — their seed funding was running out and they needed traction to close a Series A.

The risk was real. Consumer apps are hard. Timelines this tight usually produce something too rough to gain traction. We had to build fast without building badly.',
  'The first conversation was about scope. Ten weeks is enough time to build something great if you''re building the right thing — and not enough time to recover from building the wrong thing. We spent the first week only on scope: ruthlessly cutting everything that wasn''t essential to the core user value, and then cutting more.

We built with React Native so we could share logic across iOS and Android without sacrificing native feel. We made aggressive performance budgets non-negotiable from day one — if a screen took more than 300ms to become interactive, we didn''t ship it. We ran usability testing with real users every Friday, even when it hurt to hear the feedback.

The app launched on week 10 with a core feature set that was small but polished. No beta, no soft launch — full public release on both stores simultaneously.

The first week brought 12,000 downloads. By week 10, Croft had 100,000 users. The App Store rating held at 4.8. Six weeks after launch, the founding team closed their Series A.',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1600&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80',
    'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=1200&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80'
  ],
  ARRAY['React Native', 'iOS', 'Android', 'Node.js', 'Consumer App'],
  false,
  true,
  4
);
