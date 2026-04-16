-- ============================================================
-- Crafyne — Blog Seed Data
-- Jalankan di: Supabase Dashboard → SQL Editor
-- ============================================================

DELETE FROM posts WHERE slug IN (
  'why-most-design-systems-fail',
  'shipping-over-perfection',
  'the-quiet-work-of-good-api-design',
  'what-three-years-of-remote-taught-us'
);

INSERT INTO posts (slug, title, excerpt, content, cover_image_url, published, published_at) VALUES

-- ── 1 ──────────────────────────────────────────────────────
(
  'why-most-design-systems-fail',
  'Why Most Design Systems Fail (And How to Build One That Doesn''t)',
  'A design system isn''t a component library. It''s a shared language — and most teams skip the hardest part of building it.',
  'Every agency pitch deck has the same slide: "We build design systems." And yet most of the design systems we''ve inherited from previous agencies are, frankly, a mess.

Not because the people who built them were bad at their jobs. Because they solved the wrong problem.

A component library is not a design system.

When most teams say "design system," they mean: a Figma file with buttons, a Storybook with some React components, and a README that no one reads. That''s a component library. Useful — but not what makes a team move fast over time.

A design system is a shared language. It''s the agreement between design and engineering about what things mean, how they change, and who owns what. Without that agreement, you end up with 14 slightly-different shades of gray and a pile of tokens that nobody uses consistently.

The part everyone skips.

The most valuable work in a design system isn''t building the components. It''s the taxonomy. What do you call the thing? Where does it live? What decisions does it encode, and which does it leave open?

We once spent an entire week — before writing a single line of code — on a single question: is a "card" a layout primitive or a content pattern? It sounds trivial. It isn''t. The answer determines how your spacing system works, whether cards can nest, and whether a developer can predict what a card will look like without checking Figma.

When you skip this work, you end up refactoring everything six months later.

How to build one that actually lasts.

Start with constraints, not components. What are the ten decisions you make most often? Spacing increments. Type scales. Border radii. Color meanings. Document those first — they''re the 20% that affects 80% of what you build.

Build with your team, not for them. A system that engineers don''t understand is a system they''ll route around. Write it in the same language they already use. If they''re on Tailwind, write your system in Tailwind. If they''re on CSS Modules, write it there.

Version it seriously. Nothing kills adoption faster than a breaking change with no migration path. Treat your design system like a public API. Make breaking changes deliberate and rare.

Accept that it will be wrong.

The best design systems we''ve seen all have one thing in common: they were thrown out at least once. Not because the team failed, but because they learned something. The system you build at the start of a project is always wrong for the team you become six months later.

That''s fine. The goal isn''t to build a perfect system. It''s to build a system that''s easy to change.',
  'https://images.unsplash.com/photo-1545670723-196ed0954986?w=1400&q=80',
  true,
  '2025-11-14T08:00:00Z'
),

-- ── 2 ──────────────────────────────────────────────────────
(
  'shipping-over-perfection',
  'In Defense of Shipping Something Imperfect',
  'The best version of your product is the one your users can actually use. The second-best version is every version that never shipped.',
  'There''s a version of this post that''s been sitting in my drafts for six months. It had better structure. More examples. A cleaner argument. I deleted it and wrote this one instead.

That felt appropriate.

We work with a lot of founders who are building their first serious product. And the pattern I see most often — the thing that kills more projects than bad code ever could — is the fear of releasing something that isn''t finished.

Here''s the thing: it''s never finished.

Software is not a physical product. You don''t manufacture it once, ship it, and move on. You ship a version, observe how people use it, and use that information to build the next version. The feedback loop is the product.

When you delay shipping to make something more perfect, you''re not improving the product — you''re deferring the feedback that would actually tell you what to improve.

What "done enough to ship" actually means.

It doesn''t mean buggy. It doesn''t mean embarrassing. It means: the core use case works, it works reliably, and it''s not lying to the user about what it is.

The best framing I''ve heard is: would you be comfortable if a journalist wrote about this version? Not comfortable in the sense of "it''s flawless" — comfortable in the sense of "this does what we say it does."

If the answer is yes, you''re probably overthinking it.

The thing nobody tells you about perfection.

Perfect is a moving target. The version you''re agonising over right now — the one that isn''t quite ready — will look rough six months from now regardless. Not because you''ll regret shipping it, but because you''ll learn so much from shipping it that the current version will seem naive.

Every hour spent polishing before launch is an hour you''re not spending learning from real users. And real users always know things your team doesn''t.

A practical rule we use.

When a project is running long because we keep finding things to improve, we use a simple test: is this a "must-fix before launch" or a "can fix in the next iteration" issue? If it doesn''t break the core promise of the product, it''s the second one.

We keep a list. We call it the "Week 2 list." Almost everything ends up there. Almost nothing on it turns out to matter as much as we thought before we shipped.',
  'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1400&q=80',
  true,
  '2025-12-02T08:00:00Z'
),

-- ── 3 ──────────────────────────────────────────────────────
(
  'the-quiet-work-of-good-api-design',
  'The Quiet Work of Good API Design',
  'A well-designed API disappears. You stop thinking about the interface and start thinking about what you''re building. That''s hard to achieve and easy to take for granted.',
  'Nobody writes blog posts about APIs that work well.

The Stripe API, the Vercel API, the GitHub API — you use them, they do what you expect, and you move on. The design recedes. That''s the goal.

But when an API is poorly designed, you feel it constantly. You open the docs every time you make a call because you can never remember the parameter order. You write wrappers around wrappers because the response shape doesn''t match the shape of your domain. You dread the integration because you know it will be a day of archaeology.

This is the quiet work of API design: making something that developers stop thinking about.

The principle that matters most.

Consistency. Not cleverness, not minimalism, not expressiveness — consistency.

If you paginate one endpoint with page and per_page, every endpoint should use page and per_page. If your timestamps are ISO 8601 in one resource, they''re ISO 8601 everywhere. If errors return { error: { message: "..." } }, that''s what they always return.

Consistency lets developers build a mental model. Once they understand one part of your API, they can predict the rest. That''s worth more than any amount of elegant design.

Resource shapes are contracts.

This is the one we see violated most often, especially in fast-moving startups. The shape of your API response isn''t just a technical detail — it''s a contract with every developer who integrates with you.

Breaking changes should be rare, versioned, and announced far in advance. "We added a field" is fine. "We renamed a field" is a breaking change. "We changed the type of a field" is a breaking change. Treat them accordingly.

We''ve seen companies lose enterprise customers not because their product was bad, but because a surprise API change broke an integration on a Friday afternoon. Trust is hard to rebuild.

The documentation is part of the design.

An API without documentation is like a product without a UI. The interface exists, but no one can use it effectively.

Good documentation isn''t just reference material. It''s onboarding. It''s the "hello world" that works first try. It''s the explanation of why, not just what. It''s the error message that tells you what you did wrong and how to fix it.

If you can''t document a decision clearly, the decision might be wrong.

What we try to do.

When we design APIs at Crafyne, we start by writing the documentation before we write the code. Describing the interface forces you to confront the awkward decisions before they''re hardened into endpoints. It''s slower in the short run. It''s much faster overall.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&q=80',
  true,
  '2026-01-09T08:00:00Z'
),

-- ── 4 ──────────────────────────────────────────────────────
(
  'what-three-years-of-remote-taught-us',
  'What Three Years of Fully Remote Taught Us About Collaboration',
  'Remote work doesn''t ruin collaboration. Asynchronous-first communication, done badly, does. Here''s what we learned.',
  'When we went fully remote three years ago, we thought the hardest part would be coordination: keeping everyone aligned, running standups across time zones, finding overlap for the meetings that actually needed to happen in real time.

We were wrong. The hardest part was writing.

Remote work is writing.

Everything that used to happen in a hallway conversation now happens in writing. The quick question, the context-setting before a meeting, the decision that got made in someone''s head but needs to exist somewhere that isn''t someone''s head — all of it becomes text.

If you can''t write clearly, you can''t work effectively in a remote team. Not because remote is harder, but because it reveals weaknesses in communication that in-office work papers over with proximity and real-time clarification.

The first six months were humbling. We discovered that our team was great at talking through problems and mediocre at writing them down. We had to get better at writing. We did.

The async/sync balance.

The biggest mistake remote teams make is trying to replicate the in-office experience online. Daily video standups. Constant Slack availability. Meetings for things that should be documents.

Async-first isn''t about avoiding communication — it''s about choosing the right tool for what you''re communicating. A decision that''s already been made doesn''t need a meeting. It needs a well-written document that answers the three questions everyone will have: what changed, why, and what do I do differently now.

Meetings are for things that genuinely require real-time thinking: working through an ambiguous problem, building trust with a new client, making a decision that needs collective judgment.

We use video calls for those things and almost nothing else. Our meetings got shorter and more useful.

What we still miss.

I''d be dishonest if I said remote is purely upside. There are things that happen in physical proximity that don''t fully translate — the energy of a working session in the same room, the social glue that comes from lunch together, the serendipitous conversation that turns into an idea.

We try to compensate with in-person time twice a year. It''s not the same as being in an office, but it''s enough to maintain the relationships that make the rest of the year work.

The thing we got wrong at the start.

We treated documentation as overhead. Something you do after the work, to record what happened. We now treat it as the work itself.

When you write down why a decision was made, you''re doing the clearest version of the thinking. You''re forced to be explicit about assumptions, tradeoffs, and context. Future you — and future teammates — will be grateful.

"If it''s not written down, it didn''t happen" sounds harsh. But for a distributed team, it''s basically true.',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
  true,
  '2026-02-18T08:00:00Z'
);
