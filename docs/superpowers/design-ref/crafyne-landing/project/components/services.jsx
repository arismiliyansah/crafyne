/* Services — bento grid w/ playful hovers */
function ServiceCard({ idx, title, body, bullets, tone, span, glyph }) {
  return (
    <article className={`svc svc--${tone} ${span ? "svc--" + span : ""} reveal`} data-d={idx}>
      <div className="svc__head">
        <span className="mono svc__idx">/{String(idx).padStart(2, "0")}</span>
        <span className="svc__glyph" aria-hidden="true">{glyph}</span>
      </div>
      <h3 className="svc__title display">{title}</h3>
      <p className="svc__body">{body}</p>
      <ul className="svc__list">
        {bullets.map((b, i) => (<li key={i}><span className="svc__bullet" />{b}</li>))}
      </ul>
      <a className="svc__cta" href="#contact">
        <span>See deliverables</span>
        <span className="svc__arrow" aria-hidden="true">
          <svg viewBox="0 0 14 14"><path d="M3 11 11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
        </span>
      </a>
    </article>
  );
}

function Services() {
  const services = [
    {
      title: "Web Engineering",
      body: "Marketing sites, dashboards, internal tools — built fast, typed end-to-end, and easy to hand off.",
      bullets: ["Next.js · TypeScript · tRPC", "Headless CMS integrations", "Performance budgets, real ones"],
      tone: "peach", span: "trio", glyph: "▤",
    },
    {
      title: "Mobile Apps",
      body: "Native-feel iOS and Android from one team. We sweat the small details: gestures, haptics, offline.",
      bullets: ["React Native + native modules", "App Store / Play submission", "Crashlytics, Sentry, the works"],
      tone: "navy", span: "trio", glyph: "▢",
    },
    {
      title: "AI & ML",
      body: "Pragmatic AI features that earn their keep. We pick the smallest model that solves the job and ship it.",
      bullets: ["RAG over your own data", "Evals & guardrails", "Cost-aware inference pipelines"],
      tone: "orange", span: "trio", glyph: "✺",
    },
    {
      title: "Product Design",
      body: "From the first sketch to a system that scales. Research, IA, interaction, motion — design that ships.",
      bullets: ["Discovery & UX research", "Design system + component library", "Hi-fi prototypes for testing"],
      tone: "crimson", span: "wide", glyph: "◐",
    },
    {
      title: "Enterprise Software",
      body: "We work alongside in-house teams on long horizons — modernization, internal tools, platform work.",
      bullets: ["Auth, audit, RBAC, SSO", "Legacy migrations", "Documentation engineers love"],
      tone: "cream", span: "wide", glyph: "▣",
    },
  ];
  return (
    <section className="svcs section" id="services">
      <div className="wrap">
        <div className="svcs__head">
          <span className="eyebrow reveal">/ what we do</span>
          <h2 className="svcs__title h2 display reveal" data-d="1">
            Five practices. <span className="italic">One team</span>.<br />
            Built around how good software actually gets made.
          </h2>
          <p className="svcs__sub reveal" data-d="2">
            We don&rsquo;t hand projects to juniors when you&rsquo;re not looking. Every engagement
            runs with a senior pair: someone who designs, someone who ships.
          </p>
        </div>
        <div className="svcs__grid">
          {services.map((s, i) => (<ServiceCard key={i} idx={i + 1} {...s} />))}
        </div>
      </div>
    </section>
  );
}
window.Services = Services;
