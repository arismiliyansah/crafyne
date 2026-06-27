-- ============================================================
-- 014 — Pricing card copy refined for a developer agency
-- Run in: Supabase Dashboard → SQL Editor (after 013)
-- IMPORTANT: prices and units are intentionally NOT touched here —
-- your /admin/pricing numbers are preserved. This only refines the
-- tag, blurb, features, and CTA wording on each tier.
-- ============================================================

-- Sprint — the smallest, one-off engagement.
update pricing_tiers
set tag = '1–2 weeks · fixed scope',
    blurb = 'One clear problem, shipped. Perfect for a prototype, a single feature, or unblocking a stalled build.',
    cta_label = 'Book a sprint',
    features = array[
      '1 senior engineer + 1 designer',
      'Fixed scope, fixed price',
      'Production-ready, fully-typed code',
      'Deployed to staging or your infra',
      'Source code + handover notes'
    ]
where name = 'Sprint';

-- Build — the core, full-product engagement (featured).
update pricing_tiers
set tag = '6–14 weeks · full team',
    blurb = 'Our core engagement. A senior pair takes your product from blank repo to a launched, maintainable codebase.',
    cta_label = 'Start a project',
    features = array[
      'Senior engineer pair + part-time PM',
      'Discovery, architecture & UX',
      'Automated tests + CI/CD pipeline',
      'Live staging from week one',
      'Weekly demos — you own every commit',
      '30-day post-launch support'
    ]
where name = 'Build';

-- Tend — the largest / most ambitious engagement (priciest tier).
update pricing_tiers
set tag = 'Large · multi-phase',
    blurb = 'For ambitious, multi-phase products. A dedicated senior team, scoped phase by phase, taking you from architecture to scale.',
    cta_label = 'Talk it through',
    features = array[
      'Dedicated senior team',
      'Multi-phase roadmap, fixed price per phase',
      'Architecture built for scale',
      'Automated tests + CI/CD',
      'Design system + production code',
      'Post-launch stabilization + handover'
    ]
where name = 'Tend';
