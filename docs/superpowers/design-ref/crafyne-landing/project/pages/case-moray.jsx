/* Case study — Moray Bank */
function CaseMorayPage() {
  const P = window.CRAFYNE_PATHS;
  return (
    <main>
      <section className="caseHero" style={{background:'var(--navy)'}}>
        <div className="wrap caseHero__inner">
          <div className="caseHero__crumb reveal">
            <a href={P.home}>Crafyne</a><span>/</span>
            <a href={P.page('work')}>Work</a><span>/</span>
            <span>Moray Bank</span>
          </div>
          <h1 className="caseHero__title reveal" data-d="1">Moray Bank<br/>Console.</h1>
          <p className="caseHero__lede reveal" data-d="2">
            We rebuilt the operations console used by 4,200 bankers — and cut average task time in half.
            Eight months. No big-bang migration. No retraining.
          </p>
        </div>
        <div className="caseVisual" style={{background:'var(--navy-2)'}}>
          <div style={{position:'absolute', inset:0, padding:60, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <div style={{width:'min(720px, 90%)', background:'var(--cream)', borderRadius:20, padding:24, color:'var(--ink)', display:'flex', flexDirection:'column', gap:18, boxShadow:'0 40px 80px -20px rgba(0,0,0,0.4)'}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <div style={{display:'flex', gap:8, alignItems:'center'}}>
                  <span style={{width:10,height:10,borderRadius:999,background:'var(--crimson)'}}/>
                  <span style={{width:10,height:10,borderRadius:999,background:'var(--orange)'}}/>
                  <span style={{width:10,height:10,borderRadius:999,background:'var(--peach)'}}/>
                  <span style={{fontFamily:'JetBrains Mono', fontSize:11, marginLeft:8, color:'var(--mute)'}}>console.moray.bank</span>
                </div>
                <span style={{fontFamily:'JetBrains Mono', fontSize:11, padding:'4px 10px', borderRadius:999, background:'#4ADE80', color:'var(--ink)'}}>ALL SYSTEMS NORMAL</span>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'180px 1fr', gap:18}}>
                <div style={{display:'flex', flexDirection:'column', gap:8}}>
                  {['Accounts','Approvals','Disputes','Reports','Ledger','Settings'].map((label,i)=>(
                    <div key={label} style={{padding:'10px 14px', borderRadius:10, background: i===1 ? 'var(--ink)' : 'transparent', color: i===1 ? 'var(--cream)' : 'var(--ink)', fontSize:13, fontWeight:500}}>{label}</div>
                  ))}
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:14}}>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12}}>
                    <div style={{background:'var(--peach)', padding:14, borderRadius:12}}><div style={{fontFamily:'JetBrains Mono', fontSize:10, color:'var(--ink-soft)'}}>QUEUE</div><div style={{fontFamily:'Bricolage Grotesque', fontSize:28, fontWeight:700, lineHeight:1, marginTop:6}}>42</div></div>
                    <div style={{background:'var(--orange)', padding:14, borderRadius:12}}><div style={{fontFamily:'JetBrains Mono', fontSize:10, color:'var(--ink-soft)'}}>TODAY</div><div style={{fontFamily:'Bricolage Grotesque', fontSize:28, fontWeight:700, lineHeight:1, marginTop:6}}>1,238</div></div>
                    <div style={{background:'var(--crimson)', color:'var(--cream)', padding:14, borderRadius:12}}><div style={{fontFamily:'JetBrains Mono', fontSize:10, opacity:0.7}}>SLA</div><div style={{fontFamily:'Bricolage Grotesque', fontSize:28, fontWeight:700, lineHeight:1, marginTop:6}}>99.4%</div></div>
                  </div>
                  <div style={{background:'var(--paper)', borderRadius:12, padding:14, display:'flex', flexDirection:'column', gap:8}}>
                    {[
                      {n:'A-104', who:'Sari W.', amt:'$2,400', tag:'Wire transfer'},
                      {n:'A-105', who:'Jonas M.', amt:'$18.50', tag:'Card dispute'},
                      {n:'A-106', who:'Elena R.', amt:'$640.00', tag:'Refund'},
                    ].map(row=>(
                      <div key={row.n} style={{display:'grid', gridTemplateColumns:'60px 1fr 80px 100px', gap:12, fontSize:12, alignItems:'center'}}>
                        <span style={{fontFamily:'JetBrains Mono', color:'var(--mute)'}}>{row.n}</span>
                        <span style={{fontWeight:500}}>{row.who}</span>
                        <span style={{fontFamily:'JetBrains Mono', textAlign:'right'}}>{row.amt}</span>
                        <span style={{fontSize:10, padding:'4px 8px', borderRadius:999, background:'var(--ink)', color:'var(--cream)', textAlign:'center', fontFamily:'JetBrains Mono', textTransform:'uppercase'}}>{row.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="caseFacts">
        <div className="wrap caseFacts__grid">
          <div className="caseFacts__item"><span className="caseFacts__label">Client</span><span className="caseFacts__val">Moray Bank</span></div>
          <div className="caseFacts__item"><span className="caseFacts__label">Year</span><span className="caseFacts__val">2025</span></div>
          <div className="caseFacts__item"><span className="caseFacts__label">Engagement</span><span className="caseFacts__val">32 weeks</span></div>
          <div className="caseFacts__item"><span className="caseFacts__label">Team</span><span className="caseFacts__val">3 + embedded PM</span></div>
          <div className="caseFacts__item"><span className="caseFacts__label">Stack</span><span className="caseFacts__val">Next.js · Go · Postgres</span></div>
        </div>
      </section>

      <section className="caseBody">
        <div className="wrap caseBody__inner">
          <div className="caseBody__sectionLabel reveal">/ context</div>
          <div>
            <div className="caseSection reveal" data-d="1">
              <h2>4,200 bankers, one 12-year-old internal tool.</h2>
              <p>
                Moray&rsquo;s operations console was the daily home of thousands of employees, but it had grown
                organically since 2013. Every team had its own page, its own conventions, its own keyboard
                shortcuts. Onboarding new bankers took six weeks. Senior bankers had memorized which screens
                to avoid.
              </p>
              <p>
                Compliance gave us a hard constraint: no behaviour change for the bankers. Whatever we shipped
                had to be drop-in compatible, keyboard-shortcut-equivalent, and feature-parity from day one.
              </p>
            </div>

            <div className="caseSection reveal">
              <div className="caseBody__sectionLabel" style={{position:'static', marginBottom:8}}>/ approach</div>
              <h2>Quietly faster. Then visibly better.</h2>
              <p>
                We rebuilt the front end behind a feature flag for nine weeks before any banker saw it.
                The new console looked identical, but loaded ten times faster and shared a single data layer.
              </p>
              <ul>
                <li>Strangler-fig migration: one route at a time, behind feature flags, with parity tests.</li>
                <li>Replaced six in-house tables with a single virtualized data grid the whole org uses.</li>
                <li>Standardized the keyboard shortcuts to be consistent across teams — opt-in for the first 90 days.</li>
                <li>Built a banker-facing changelog that explains what changed and why, in plain English.</li>
              </ul>
            </div>

            <div className="casePull reveal">
              <p className="casePull__quote">
                &ldquo;They cut our internal tool from a 90-second login to a 4-second one.
                The team still talks about it in standups.&rdquo;
              </p>
              <div className="casePull__who">
                <div className="casePull__avatar">YH</div>
                <div>
                  <div className="casePull__name">Yuki Hoshino</div>
                  <div className="casePull__role">Engineering Director, Moray Bank</div>
                </div>
              </div>
            </div>

            <div className="caseSection reveal">
              <div className="caseBody__sectionLabel" style={{position:'static', marginBottom:8}}>/ handoff</div>
              <h2>Their team runs it now. Cleanly.</h2>
              <p>
                We finished with two weeks of pair-programming with Moray&rsquo;s platform team — not training,
                co-ownership. They&rsquo;ve added six features since handoff without our involvement, which is
                the version of success we keep score on.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="caseOutcome">
        <div className="wrap">
          <div className="caseBody__sectionLabel" style={{position:'static', marginBottom:24}}>/ outcome</div>
          <div className="caseOutcome__grid">
            <div className="caseOutcome__item reveal" data-d="1">
              <div className="caseOutcome__big">−54%</div>
              <div className="caseOutcome__label">Median task time across the top 12 banker workflows, measured weekly for six months.</div>
            </div>
            <div className="caseOutcome__item reveal" data-d="2">
              <div className="caseOutcome__big">6 → 2</div>
              <div className="caseOutcome__label">Weeks to onboard a new banker to console proficiency. Same training, different tool.</div>
            </div>
            <div className="caseOutcome__item reveal" data-d="3">
              <div className="caseOutcome__big">0</div>
              <div className="caseOutcome__label">Production incidents related to the migration in the twelve months following cutover.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="caseRelated">
        <div className="wrap">
          <h2>Other work</h2>
          <div className="caseRelated__grid">
            <a className="workCard workCard--half" href={P.page('case-halcyon')}>
              <div className="workCard__visual workCard__visual--navy" style={{aspectRatio:'4/3'}}>
                <span className="workCard__pill">Mobile</span>
                <div style={{display:'flex', gap:12}}>
                  <div style={{width:80,height:160,background:'var(--cream)',borderRadius:14}}/>
                  <div style={{width:80,height:160,background:'#1A2440',borderRadius:14}}/>
                </div>
              </div>
              <div className="workCard__body">
                <div className="workCard__meta"><span>Mobile</span><span>·</span><span>2026</span></div>
                <h3 className="workCard__name">Halcyon</h3>
                <p className="workCard__teaser">A calming sleep companion that doubled trial-to-paid conversions in six weeks.</p>
                <span className="workCard__link">Read case study →</span>
              </div>
            </a>
            <a className="workCard workCard--half" href={P.page('work')}>
              <div className="workCard__visual workCard__visual--orange" style={{aspectRatio:'4/3'}}>
                <span className="workCard__pill">All work</span>
                <div style={{fontFamily:'Bricolage Grotesque', fontSize:80, fontWeight:700, letterSpacing:'-0.04em', lineHeight:1}}>06</div>
              </div>
              <div className="workCard__body">
                <div className="workCard__meta"><span>Index</span></div>
                <h3 className="workCard__name">See all work</h3>
                <p className="workCard__teaser">Six selected case studies across web, mobile, AI and enterprise software.</p>
                <span className="workCard__link">Browse projects →</span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
window.CaseMorayPage = CaseMorayPage;
