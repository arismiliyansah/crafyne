/* Journal index */
function JournalPage() {
  const P = window.CRAFYNE_PATHS;
  const featured = {
    big: "T", tag: "Engineering · long read",
    title: "The case for boring tech in an age of churn",
    excerpt: "We keep picking PostgreSQL, Go, and Next.js. Here's why we think your studio probably should too — and the small list of cases where we don't.",
    author: "Sari Wibowo",
    date: "12 May 2026",
    readTime: "12 min read",
  };

  const articles = [
    { big: "R", tag: "Process", title: "Why we ship every Thursday", excerpt: "The hidden cost of \"we'll ship when it's ready,\" and the rhythm we replaced it with.", author: "Sari Wibowo", date: "28 Apr 2026", read: "6 min", tone: "navy" },
    { big: "D", tag: "Design", title: "Designing for fatigue, not focus", excerpt: "Most apps are designed for users at their sharpest. We make ours for users at their tiredest.", author: "Daniel Okafor", date: "14 Apr 2026", read: "9 min", tone: "peach" },
    { big: "A", tag: "AI", title: "Evals before features", excerpt: "An RAG product is one bad answer from cancellation. Here's the eval rig we use on every project.", author: "Arjun Pillai", date: "31 Mar 2026", read: "11 min", tone: "orange" },
    { big: "H", tag: "Hiring", title: "The paid trial week, defended", excerpt: "Why we pay every candidate for a week of real work — and why the interview gauntlet is not enough.", author: "Sari Wibowo", date: "18 Mar 2026", read: "7 min", tone: "crimson" },
    { big: "M", tag: "Mobile", title: "Native modules are not the enemy", excerpt: "React Native plus a hand-rolled native module is the right answer more often than the discourse suggests.", author: "Mei Tanaka", date: "04 Mar 2026", read: "10 min", tone: "navy" },
    { big: "W", tag: "Writing", title: "How we write project briefs", excerpt: "The template, the tone, the rules — and the one section we always argue about.", author: "Hana Pratiwi", date: "20 Feb 2026", read: "5 min", tone: "peach" },
    { big: "L", tag: "Leadership", title: "We stayed small. On purpose.", excerpt: "Eight years, six people, four chances to scale that we said no to. Here's what we learned.", author: "Sari Wibowo", date: "06 Feb 2026", read: "8 min", tone: "crimson" },
    { big: "C", tag: "Code", title: "TypeScript: the smaller the better", excerpt: "Why we cap our type complexity and what we do when a clever type wants in.", author: "Lucas Marin", date: "23 Jan 2026", read: "6 min", tone: "orange" },
  ];

  const filters = ["All", "Engineering", "Design", "AI", "Process", "Leadership"];
  const [filter, setFilter] = React.useState("All");
  const visible = filter === "All" ? articles : articles.filter(a => a.tag.toLowerCase().includes(filter.toLowerCase()) || filter.toLowerCase().includes(a.tag.toLowerCase()));

  return (
    <main>
      <section className="pageHero pageHero--ink">
        <div className="wrap">
          <div className="pageHero__crumb reveal">
            <a href={P.home}>Crafyne</a><span>/</span><span>Journal</span>
          </div>
          <div className="pageHero__eyebrow reveal">/ writing, twice a month</div>
          <h1 className="pageHero__title reveal" data-d="1">
            What we&rsquo;re<br/>
            <span className="italic" style={{fontFamily:'"Instrument Serif", serif', textTransform:'none', fontWeight:400}}>thinking about.</span>
          </h1>
          <p className="pageHero__sub reveal" data-d="2">
            Notes on engineering, design, and how to run a studio that ships. Written by the team,
            edited by no one, posted when ready — usually twice a month.
          </p>
        </div>
      </section>

      <section className="jrnFeat">
        <div className="wrap">
          <div className="jrnFeat__card reveal">
            <div className="jrnFeat__visual">
              <span className="jrnFeat__bigChar">{featured.big}</span>
            </div>
            <div className="jrnFeat__body">
              <span className="jrnFeat__tag">{featured.tag} · featured</span>
              <h2 className="jrnFeat__title">{featured.title}</h2>
              <p className="jrnFeat__excerpt">{featured.excerpt}</p>
              <div className="jrnFeat__meta">
                <span>By {featured.author}</span>
                <span>·</span>
                <span>{featured.date}</span>
                <span>·</span>
                <span>{featured.readTime}</span>
              </div>
              <a href="#" className="btn btn--ink" style={{alignSelf:'flex-start', marginTop:8}}>
                Read article
                <span className="btn__arrow" aria-hidden="true">
                  <svg viewBox="0 0 12 12"><path d="M3 9 9 3M9 3H4M9 3v5" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="jrnList">
        <div className="wrap">
          <div className="jrnList__head">
            <div>
              <div className="eyebrow reveal">/ archive</div>
              <h2 className="jrnList__title reveal" data-d="1">All articles</h2>
            </div>
            <div className="jrnList__filters reveal" data-d="2">
              {filters.map(f => (
                <button
                  key={f}
                  className={"cases__filter " + (filter === f ? "is-active" : "")}
                  onClick={() => setFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="jrnList__grid">
            {visible.map((a, i) => (
              <a className="article reveal" data-d={(i % 3) + 1} key={a.title} href="#">
                <div className={`article__visual article__visual--${a.tone}`}>
                  <span className="article__visualBig">{a.big}</span>
                </div>
                <div className="article__body">
                  <span className="article__tag">{a.tag}</span>
                  <h3 className="article__title">{a.title}</h3>
                  <p style={{fontSize:14, lineHeight:1.5, color:'var(--ink-soft)', margin:0}}>{a.excerpt}</p>
                  <div className="article__meta">
                    <span>{a.date}</span>
                    <span>·</span>
                    <span>{a.read}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="cta section--tight">
        <div className="wrap">
          <div className="cta__panel">
            <div className="cta__bg" aria-hidden="true">
              <span className="cta__blob cta__blob--a" />
              <span className="cta__blob cta__blob--b" />
            </div>
            <div className="cta__inner">
              <div className="cta__copy">
                <span className="eyebrow cta__eye reveal">/ newsletter</span>
                <h2 className="cta__title display reveal" data-d="1">
                  Twice a month, <span className="italic">no fluff.</span>
                </h2>
                <p className="cta__sub reveal" data-d="2">
                  We send a short note when something new goes up. No drip campaigns, no
                  &ldquo;just checking in,&rdquo; no marketing automation.
                </p>
                <form className="cta__row reveal" data-d="3" style={{display:'flex', gap:12, flexWrap:'wrap'}} onSubmit={e => e.preventDefault()}>
                  <input
                    type="email" placeholder="your@email.com"
                    style={{flex:'1 1 240px', padding:'14px 18px', borderRadius:999, border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.06)', color:'var(--cream)', fontSize:15, fontFamily:'inherit', outline:'none'}}
                  />
                  <button type="submit" className="btn btn--orange">
                    Subscribe
                    <span className="btn__arrow" aria-hidden="true">
                      <svg viewBox="0 0 12 12"><path d="M3 9 9 3M9 3H4M9 3v5" stroke="#0E1530" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
                    </span>
                  </button>
                </form>
              </div>
              <div className="cta__arrow reveal" data-d="2" aria-hidden="true">
                <svg viewBox="0 0 200 200">
                  <path d="M30 170 L170 30 M170 30 H80 M170 30 V120" stroke="#FFD9CF" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
window.JournalPage = JournalPage;
