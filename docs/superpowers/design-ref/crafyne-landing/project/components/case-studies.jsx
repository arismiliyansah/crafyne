/* Case Studies — filterable tabs + grid */
function CaseStudies() {
  const projects = [
    {
      name: "Halcyon",
      kind: "Mobile app",
      year: "2026",
      tags: ["mobile", "design"],
      teaser: "A calming sleep companion that doubled trial-to-paid conversions in six weeks.",
      metric: "+118% paid conversion",
      tone: "navy",
      shape: "phone",
    },
    {
      name: "Moray Bank Console",
      kind: "Enterprise",
      year: "2025",
      tags: ["enterprise", "web"],
      teaser: "We rebuilt the ops console used by 4,200 bankers — and cut average task time in half.",
      metric: "−54% time-on-task",
      tone: "cream",
      shape: "dashboard",
    },
    {
      name: "Lumenpath",
      kind: "AI / RAG",
      year: "2025",
      tags: ["ai", "web"],
      teaser: "Internal knowledge search for a 2,000-person engineering org. Answers cited, not hallucinated.",
      metric: "0.8s median answer",
      tone: "orange",
      shape: "blocks",
    },
    {
      name: "Porter & Rye",
      kind: "Web · D2C",
      year: "2024",
      tags: ["web", "design"],
      teaser: "A whiskey label's quiet, beautiful storefront — engineered to feel like a printed catalog.",
      metric: "+38% AOV",
      tone: "peach",
      shape: "card",
    },
    {
      name: "Fieldwise",
      kind: "Mobile · field ops",
      year: "2024",
      tags: ["mobile", "enterprise"],
      teaser: "Offline-first inspections for utility crews — survives rain, gloves, and bad signal.",
      metric: "12k inspections / wk",
      tone: "crimson",
      shape: "phone",
    },
    {
      name: "Tessera",
      kind: "AI · creative tool",
      year: "2023",
      tags: ["ai", "design"],
      teaser: "A visual layout tool with AI suggestions you can actually trust — and dismiss without friction.",
      metric: "94% NPS @ launch",
      tone: "navy-2",
      shape: "grid",
    },
  ];
  const filters = [
    { id: "all", label: "All work" },
    { id: "web", label: "Web" },
    { id: "mobile", label: "Mobile" },
    { id: "ai", label: "AI" },
    { id: "design", label: "Design" },
    { id: "enterprise", label: "Enterprise" },
  ];
  const [filter, setFilter] = React.useState("all");
  const visible = filter === "all" ? projects : projects.filter(p => p.tags.includes(filter));
  return (
    <section className="cases section" id="work">
      <div className="wrap">
        <div className="cases__head">
          <div>
            <span className="eyebrow reveal">/ selected work</span>
            <h2 className="cases__title h2 display reveal" data-d="1">
              Recent things <span className="italic">we&rsquo;re proud</span> of.
            </h2>
          </div>
          <div className="cases__filters reveal" data-d="2" role="tablist">
            {filters.map(f => (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                className={"cases__filter " + (filter === f.id ? "is-active" : "")}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="cases__grid">
          {visible.map((p, i) => (
            <article className={`case case--${p.tone} reveal`} data-d={(i % 3) + 1} key={p.name}>
              <div className="case__visual">
                <CaseShape kind={p.shape} />
                <span className="case__metric mono">{p.metric}</span>
              </div>
              <div className="case__body">
                <div className="case__meta mono">
                  <span>{p.kind}</span><span>·</span><span>{p.year}</span>
                </div>
                <h3 className="case__name display">{p.name}</h3>
                <p className="case__teaser">{p.teaser}</p>
                <a className="case__link" href="#contact">
                  Read case study
                  <span className="case__arr" aria-hidden="true">
                    <svg viewBox="0 0 14 14"><path d="M3 11 11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseShape({ kind }) {
  if (kind === "phone") return (
    <div className="cshape cshape--phone">
      <div className="cshape__notch" />
      <div className="cshape__line" /><div className="cshape__line" style={{width:'60%'}} />
      <div className="cshape__block" />
      <div className="cshape__row"><div /><div /><div /></div>
    </div>
  );
  if (kind === "dashboard") return (
    <div className="cshape cshape--dash">
      <div className="cshape__bar"><i/><i/><i/></div>
      <div className="cshape__cols"><span/><span/><span/></div>
      <div className="cshape__graph">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none">
          <path d="M0 30 L20 22 L40 26 L60 12 L80 18 L100 6" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </div>
  );
  if (kind === "blocks") return (
    <div className="cshape cshape--blocks">
      <div className="cshape__q"><span>?</span></div>
      <div className="cshape__a">
        <div className="cshape__line" /><div className="cshape__line" style={{width:'80%'}}/><div className="cshape__line" style={{width:'45%'}}/>
      </div>
    </div>
  );
  if (kind === "card") return (
    <div className="cshape cshape--card">
      <div className="cshape__bottle" />
      <div className="cshape__tag">PORTER<br/>& RYE</div>
    </div>
  );
  if (kind === "grid") return (
    <div className="cshape cshape--grid">
      {Array.from({length: 9}).map((_,i) => <span key={i} />)}
    </div>
  );
  return null;
}

window.CaseStudies = CaseStudies;
