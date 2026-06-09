/* Work index — full case study grid with filter */
function WorkIndexPage() {
  const P = window.CRAFYNE_PATHS;
  const projects = [
    {
      slug: "halcyon", name: "Halcyon", kind: "Mobile · iOS, Android",
      year: "2026", tags: ["mobile", "design"],
      teaser: "A calming sleep companion that doubled trial-to-paid conversions in six weeks.",
      metric: "+118% paid conv.", tone: "navy", featured: true, size: "feat",
      shape: "phones",
    },
    {
      slug: "moray", name: "Moray Bank Console", kind: "Enterprise · internal tool",
      year: "2025", tags: ["enterprise", "web"],
      teaser: "We rebuilt the ops console used by 4,200 bankers — and cut average task time in half.",
      metric: "−54% time-on-task", tone: "cream", size: "half", shape: "dashboard",
    },
    {
      slug: "lumenpath", name: "Lumenpath", kind: "AI · RAG search",
      year: "2025", tags: ["ai", "web"],
      teaser: "Internal knowledge search for a 2,000-person engineering org. Cited, not hallucinated.",
      metric: "0.8s median answer", tone: "orange", size: "half", shape: "search",
    },
    {
      slug: "porter", name: "Porter & Rye", kind: "Web · D2C storefront",
      year: "2024", tags: ["web", "design"],
      teaser: "A whiskey label's quiet, beautiful storefront — engineered to feel like a printed catalog.",
      metric: "+38% AOV", tone: "peach", size: "third", shape: "bottle",
    },
    {
      slug: "fieldwise", name: "Fieldwise", kind: "Mobile · field ops",
      year: "2024", tags: ["mobile", "enterprise"],
      teaser: "Offline-first inspections for utility crews — survives rain, gloves, and bad signal.",
      metric: "12k inspections/wk", tone: "crimson", size: "third", shape: "field",
    },
    {
      slug: "tessera", name: "Tessera", kind: "AI · creative tool",
      year: "2023", tags: ["ai", "design"],
      teaser: "A visual layout tool with AI suggestions you can actually trust — and dismiss without friction.",
      metric: "94% NPS @ launch", tone: "navy-2", size: "third", shape: "tiles",
    },
  ];
  const filters = [
    { id: "all", label: "All work" }, { id: "web", label: "Web" }, { id: "mobile", label: "Mobile" },
    { id: "ai", label: "AI" }, { id: "design", label: "Design" }, { id: "enterprise", label: "Enterprise" },
  ];
  const [filter, setFilter] = React.useState("all");
  const visible = filter === "all" ? projects : projects.filter(p => p.tags.includes(filter));

  return (
    <main>
      <section className="pageHero pageHero--crimson">
        <div className="wrap">
          <div className="pageHero__crumb reveal">
            <a href={P.home}>Crafyne</a><span>/</span><span>Work</span>
          </div>
          <div className="pageHero__eyebrow reveal">/ selected work · 2018–26</div>
          <h1 className="pageHero__title reveal" data-d="1">
            Things we <span className="italic">shipped</span> and<br />still feel good about.
          </h1>
          <p className="pageHero__sub reveal" data-d="2">
            38 active partners, 142 products in production. Below: the ones we keep mentioning in pitch meetings.
          </p>
          <div className="pageHero__meta reveal" data-d="3">
            <div className="pageHero__metaItem">
              <span className="pageHero__metaLabel">Active engagements</span>
              <span className="pageHero__metaVal">38 teams</span>
            </div>
            <div className="pageHero__metaItem">
              <span className="pageHero__metaLabel">Avg. project length</span>
              <span className="pageHero__metaVal">9 weeks</span>
            </div>
            <div className="pageHero__metaItem">
              <span className="pageHero__metaLabel">Repeat clients</span>
              <span className="pageHero__metaVal">96%</span>
            </div>
            <div className="pageHero__metaItem">
              <span className="pageHero__metaLabel">Next slot opens</span>
              <span className="pageHero__metaVal">Aug 4, 2026</span>
            </div>
          </div>
        </div>
      </section>

      <section className="workIdx">
        <div className="wrap">
          <div className="workIdx__head">
            <div className="workIdx__count mono reveal">
              Showing {visible.length} of {projects.length} projects
            </div>
            <div className="workIdx__filters reveal" data-d="1">
              {filters.map(f => (
                <button
                  key={f.id}
                  className={"cases__filter " + (filter === f.id ? "is-active" : "")}
                  onClick={() => setFilter(f.id)}
                >{f.label}</button>
              ))}
            </div>
          </div>

          <div className="workIdx__grid">
            {visible.map((p, i) => {
              const sizeClass = p.size === "feat" ? "workCard--feat" : p.size === "half" ? "workCard--half" : "workCard--third";
              return (
                <a className={`workCard ${sizeClass} reveal`} data-d={(i % 3) + 1} key={p.slug}
                   href={["halcyon","moray"].includes(p.slug) ? P.page(`case-${p.slug}`) : "#"}>
                  <div className={`workCard__visual workCard__visual--${p.tone}`}>
                    <span className="workCard__pill">{p.tags[0]}</span>
                    <WorkShape kind={p.shape} />
                    <span className="workCard__metric">{p.metric}</span>
                  </div>
                  <div className="workCard__body">
                    <div className="workCard__meta">
                      <span>{p.kind}</span><span>·</span><span>{p.year}</span>
                    </div>
                    <h3 className="workCard__name">{p.name}</h3>
                    <p className="workCard__teaser">{p.teaser}</p>
                    <span className="workCard__link">
                      {["halcyon","moray"].includes(p.slug) ? "Read case study" : "Coming soon"}
                      <svg viewBox="0 0 14 14"><path d="M3 11 11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function WorkShape({ kind }) {
  if (kind === "phones") return (
    <div style={{display:'flex', gap:'24px', alignItems:'center'}}>
      <div style={{width:140, height:280, background:'var(--cream)', borderRadius:24, padding:'20px 14px', display:'flex', flexDirection:'column', gap:10}}>
        <div style={{width:50, height:6, borderRadius:999, background:'rgba(15,10,7,0.3)', margin:'0 auto'}} />
        <div style={{flex:1, display:'flex', flexDirection:'column', gap:8, paddingTop:10}}>
          <div style={{height:60, borderRadius:12, background:'var(--peach)'}} />
          <div style={{height:8, borderRadius:999, background:'var(--crimson)', width:'80%'}} />
          <div style={{height:8, borderRadius:999, background:'var(--peach)', width:'60%'}} />
          <div style={{height:40, borderRadius:12, background:'var(--orange)', marginTop:'auto'}} />
        </div>
      </div>
      <div style={{width:140, height:280, background:'var(--navy-2)', borderRadius:24, padding:'20px 14px', display:'flex', flexDirection:'column', gap:10}}>
        <div style={{width:50, height:6, borderRadius:999, background:'rgba(255,255,255,0.25)', margin:'0 auto'}} />
        <div style={{flex:1, display:'flex', flexDirection:'column', gap:8, paddingTop:10}}>
          <div style={{height:8, borderRadius:999, background:'var(--orange)', width:'70%'}} />
          <div style={{height:8, borderRadius:999, background:'var(--peach)', width:'50%'}} />
          <div style={{height:80, borderRadius:12, background:'var(--crimson)', marginTop:8}} />
          <div style={{display:'flex', gap:8}}>
            <div style={{flex:1, height:24, borderRadius:8, background:'var(--orange)'}} />
            <div style={{flex:1, height:24, borderRadius:8, background:'var(--peach)'}} />
          </div>
        </div>
      </div>
    </div>
  );
  if (kind === "dashboard") return (
    <div style={{width:'100%', maxWidth:340, background:'var(--cream)', borderRadius:14, padding:18, display:'flex', flexDirection:'column', gap:12, color:'var(--ink)'}}>
      <div style={{display:'flex', gap:6}}>
        <span style={{width:8, height:8, borderRadius:999, background:'var(--crimson)'}}/>
        <span style={{width:8, height:8, borderRadius:999, background:'var(--orange)'}}/>
        <span style={{width:8, height:8, borderRadius:999, background:'var(--peach)'}}/>
      </div>
      <div style={{display:'flex', gap:10}}>
        <div style={{flex:1, height:50, background:'var(--peach)', borderRadius:8, display:'grid', placeItems:'center', fontFamily:'Bricolage Grotesque', fontWeight:700}}>42</div>
        <div style={{flex:1, height:50, background:'var(--orange)', borderRadius:8, display:'grid', placeItems:'center', fontFamily:'Bricolage Grotesque', fontWeight:700}}>3.2k</div>
        <div style={{flex:1, height:50, background:'var(--crimson)', color:'var(--cream)', borderRadius:8, display:'grid', placeItems:'center', fontFamily:'Bricolage Grotesque', fontWeight:700}}>96%</div>
      </div>
      <svg viewBox="0 0 100 30" style={{width:'100%', height:50}} preserveAspectRatio="none">
        <path d="M0 24 L15 16 L30 20 L45 8 L60 14 L80 4 L100 10" stroke="var(--crimson)" strokeWidth="2" fill="none"/>
        <path d="M0 24 L15 16 L30 20 L45 8 L60 14 L80 4 L100 10 L100 30 L0 30 Z" fill="var(--peach)" opacity="0.4"/>
      </svg>
    </div>
  );
  if (kind === "search") return (
    <div style={{width:'100%', maxWidth:340, display:'flex', flexDirection:'column', gap:14, color:'var(--ink)'}}>
      <div style={{background:'var(--cream)', borderRadius:14, padding:'14px 18px', display:'flex', alignItems:'center', gap:10}}>
        <div style={{width:14, height:14, border:'2px solid var(--ink)', borderRadius:999}}/>
        <div style={{height:8, borderRadius:999, background:'rgba(15,10,7,0.2)', flex:1}}/>
      </div>
      <div style={{background:'var(--cream)', borderRadius:14, padding:18, display:'flex', flexDirection:'column', gap:8}}>
        <div style={{height:8, borderRadius:999, background:'var(--ink)', width:'90%'}}/>
        <div style={{height:8, borderRadius:999, background:'rgba(15,10,7,0.4)', width:'70%'}}/>
        <div style={{height:8, borderRadius:999, background:'rgba(15,10,7,0.3)', width:'85%'}}/>
        <div style={{display:'flex', gap:6, marginTop:6}}>
          <span style={{fontSize:10, padding:'4px 10px', borderRadius:999, background:'var(--ink)', color:'var(--cream)', fontFamily:'JetBrains Mono'}}>doc/142</span>
          <span style={{fontSize:10, padding:'4px 10px', borderRadius:999, background:'var(--peach)', fontFamily:'JetBrains Mono'}}>0.8s</span>
        </div>
      </div>
    </div>
  );
  if (kind === "bottle") return (
    <div style={{display:'flex', gap:14, alignItems:'flex-end'}}>
      <div style={{width:50, height:120, background:'linear-gradient(to bottom, #5a2a14, #2a1208)', borderRadius:'6px 6px 4px 4px', position:'relative'}}>
        <div style={{position:'absolute', top:30, left:'50%', transform:'translateX(-50%)', width:36, height:50, background:'var(--cream)', display:'grid', placeItems:'center', fontFamily:'Bricolage Grotesque', fontSize:9, lineHeight:1, color:'var(--ink)', fontWeight:700, textAlign:'center'}}>P&R</div>
      </div>
      <div style={{width:50, height:80, background:'linear-gradient(to bottom, #5a2a14, #2a1208)', borderRadius:'6px 6px 4px 4px'}}/>
    </div>
  );
  if (kind === "field") return (
    <div style={{width:140, height:200, background:'var(--cream)', borderRadius:18, padding:14, display:'flex', flexDirection:'column', gap:8, color:'var(--ink)'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:'JetBrains Mono', fontSize:9, fontWeight:600, color:'var(--ink-soft)'}}>
        <span>FIELD</span>
        <span style={{padding:'2px 6px', borderRadius:6, background:'#4ADE80', color:'var(--ink)'}}>OFFLINE</span>
      </div>
      <div style={{flex:1, display:'flex', flexDirection:'column', gap:4, paddingTop:6}}>
        <div style={{display:'flex', alignItems:'center', gap:6}}><span style={{width:10, height:10, borderRadius:3, background:'#4ADE80'}}/><span style={{height:5, borderRadius:999, background:'rgba(15,10,7,0.5)', flex:1}}/></div>
        <div style={{display:'flex', alignItems:'center', gap:6}}><span style={{width:10, height:10, borderRadius:3, background:'#4ADE80'}}/><span style={{height:5, borderRadius:999, background:'rgba(15,10,7,0.5)', flex:1}}/></div>
        <div style={{display:'flex', alignItems:'center', gap:6}}><span style={{width:10, height:10, borderRadius:3, background:'var(--orange)'}}/><span style={{height:5, borderRadius:999, background:'rgba(15,10,7,0.5)', flex:1}}/></div>
        <div style={{display:'flex', alignItems:'center', gap:6}}><span style={{width:10, height:10, borderRadius:3, background:'var(--crimson)'}}/><span style={{height:5, borderRadius:999, background:'rgba(15,10,7,0.5)', flex:1}}/></div>
      </div>
    </div>
  );
  if (kind === "tiles") return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(4, 28px)', gap:6}}>
      {Array.from({length:16}).map((_,i)=>(
        <span key={i} style={{width:28, height:28, borderRadius:8,
          background: [3,6,9,12].includes(i) ? 'var(--orange)' : [1,5,11].includes(i) ? 'var(--peach)' : [8,14].includes(i) ? 'var(--crimson)' : 'rgba(255,255,255,0.16)'}}/>
      ))}
    </div>
  );
  return null;
}

window.WorkIndexPage = WorkIndexPage;
