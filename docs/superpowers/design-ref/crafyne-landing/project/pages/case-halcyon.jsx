/* Case study — Halcyon */
function CaseHalcyonPage() {
  const P = window.CRAFYNE_PATHS;
  return (
    <main>
      <section className="caseHero">
        <div className="wrap caseHero__inner">
          <div className="caseHero__crumb reveal">
            <a href={P.home}>Crafyne</a>
            <span>/</span>
            <a href={P.page('work')}>Work</a>
            <span>/</span>
            <span>Halcyon</span>
          </div>
          <h1 className="caseHero__title reveal" data-d="1">Halcyon</h1>
          <p className="caseHero__lede reveal" data-d="2">
            A calming sleep companion that doubled trial-to-paid conversions in six weeks.
            We rebuilt the first-run experience around one feeling: relief.
          </p>
        </div>
        <div className="caseVisual" style={{background:'var(--navy)'}}>
          <div style={{position:'absolute', inset:0, display:'grid', placeItems:'center', padding:60}}>
            <div style={{display:'flex', gap:40, alignItems:'center'}}>
              <div style={{width:200, height:400, background:'var(--cream)', borderRadius:36, padding:'32px 22px', display:'flex', flexDirection:'column', gap:14, color:'var(--ink)'}}>
                <div style={{width:70, height:8, borderRadius:999, background:'rgba(15,10,7,0.3)', margin:'0 auto'}} />
                <div style={{fontFamily:'Bricolage Grotesque', fontSize:14, fontWeight:600, textAlign:'center', opacity:0.6, marginTop:12}}>Tonight</div>
                <div style={{fontFamily:'Bricolage Grotesque', fontSize:36, fontWeight:700, textAlign:'center', letterSpacing:'-0.02em', lineHeight:1}}>Rest well</div>
                <div style={{height:140, borderRadius:20, background:'linear-gradient(135deg, var(--peach), var(--orange))', marginTop:8, display:'grid', placeItems:'center'}}>
                  <span style={{fontFamily:'Bricolage Grotesque', fontSize:48, fontWeight:700, color:'var(--cream)'}}>◐</span>
                </div>
                <div style={{height:8, borderRadius:999, background:'var(--ink)', width:'90%', marginTop:'auto'}}/>
                <div style={{height:8, borderRadius:999, background:'rgba(15,10,7,0.3)', width:'60%'}}/>
                <div style={{height:44, borderRadius:14, background:'var(--crimson)', color:'var(--cream)', display:'grid', placeItems:'center', fontFamily:'Bricolage Grotesque', fontWeight:600, fontSize:14, marginTop:8}}>Begin</div>
              </div>
              <div style={{width:200, height:400, background:'#1A2440', borderRadius:36, padding:'32px 22px', display:'flex', flexDirection:'column', gap:10}}>
                <div style={{width:70, height:8, borderRadius:999, background:'rgba(255,255,255,0.25)', margin:'0 auto'}} />
                <div style={{fontFamily:'JetBrains Mono', fontSize:11, color:'var(--peach)', marginTop:12}}>23:14</div>
                <div style={{fontFamily:'Bricolage Grotesque', fontSize:28, fontWeight:700, color:'var(--cream)', lineHeight:1.1, letterSpacing:'-0.02em'}}>Drift, ch. 4</div>
                <div style={{height:80, borderRadius:14, background:'linear-gradient(135deg, var(--crimson), #4a0a0a)', marginTop:14, display:'flex', alignItems:'center', gap:12, padding:'0 16px'}}>
                  <div style={{width:36, height:36, borderRadius:999, background:'var(--cream)', display:'grid', placeItems:'center', color:'var(--crimson)', fontFamily:'Bricolage Grotesque', fontWeight:700}}>▶</div>
                  <div style={{flex:1, display:'flex', flexDirection:'column', gap:6}}>
                    <div style={{height:5, borderRadius:999, background:'rgba(255,255,255,0.3)'}}/>
                    <div style={{height:5, borderRadius:999, background:'var(--peach)', width:'40%'}}/>
                  </div>
                </div>
                <div style={{marginTop:'auto', display:'flex', gap:6}}>
                  <span style={{flex:1, height:30, borderRadius:8, background:'rgba(255,255,255,0.12)'}}/>
                  <span style={{flex:1, height:30, borderRadius:8, background:'rgba(255,255,255,0.12)'}}/>
                  <span style={{flex:1, height:30, borderRadius:8, background:'var(--orange)'}}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="caseFacts">
        <div className="wrap caseFacts__grid">
          <div className="caseFacts__item"><span className="caseFacts__label">Client</span><span className="caseFacts__val">Halcyon Wellness</span></div>
          <div className="caseFacts__item"><span className="caseFacts__label">Year</span><span className="caseFacts__val">2026</span></div>
          <div className="caseFacts__item"><span className="caseFacts__label">Engagement</span><span className="caseFacts__val">14 weeks</span></div>
          <div className="caseFacts__item"><span className="caseFacts__label">Team</span><span className="caseFacts__val">2 + part-time PM</span></div>
          <div className="caseFacts__item"><span className="caseFacts__label">Stack</span><span className="caseFacts__val">React Native · Hono</span></div>
        </div>
      </section>

      <section className="caseBody">
        <div className="wrap caseBody__inner">
          <div className="caseBody__sectionLabel reveal">/ brief</div>
          <div>
            <div className="caseSection reveal" data-d="1">
              <h2>The brief: trial users were bouncing on night two.</h2>
              <p>
                Halcyon had a beautiful onboarding and a respectable day-one retention, but trial-to-paid
                hovered at 11%. Users who came back for a second night converted at 4× the rate of
                first-nighters — but most never came back at all.
              </p>
              <p>
                The team had three competing theories. We spent the first week not building anything,
                just watching ten users use the app for a week, on their own beds, in their own homes.
              </p>
            </div>

            <div className="caseSection reveal" data-d="1">
              <div className="caseBody__sectionLabel" style={{position:'static', marginBottom:8}}>/ approach</div>
              <h2>One feeling, every screen: relief.</h2>
              <p>
                The fix wasn&rsquo;t a feature — it was a tone. The app felt like it wanted you to do something:
                rate your day, log your sleep, finish a meditation. We rewrote every interaction around the
                assumption that the user was tired and trying to stop, not start.
              </p>
              <ul>
                <li>Removed every screen that asked the user to rate, score, or rank.</li>
                <li>Rebuilt the player around a single primary action: <em>Begin</em>. Pause and resume are gestures, not buttons.</li>
                <li>Switched from a daily streak metric to a private &ldquo;nights together&rdquo; counter that only the user sees.</li>
                <li>Added a 90-second &ldquo;first night&rdquo; pre-roll: a real human voice setting expectations, then silence.</li>
              </ul>
            </div>

            <div className="casePull reveal">
              <p className="casePull__quote">
                &ldquo;Crafyne shipped what our last two agencies couldn&rsquo;t even scope.
                They asked harder questions and made us better at our own product.&rdquo;
              </p>
              <div className="casePull__who">
                <div className="casePull__avatar">PA</div>
                <div>
                  <div className="casePull__name">Priya Anand</div>
                  <div className="casePull__role">VP Product, Halcyon</div>
                </div>
              </div>
            </div>

            <div className="caseSection reveal">
              <div className="caseBody__sectionLabel" style={{position:'static', marginBottom:8}}>/ launch</div>
              <h2>Shipped in fourteen weeks. Quietly.</h2>
              <p>
                We staged the launch as a silent A/B over four weeks: 5%, 20%, 50%, 100%. The new flow
                won on every cohort by day three. We turned the old flow off without an announcement —
                Halcyon doesn&rsquo;t do feature launches, and we agreed not to start.
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
              <div className="caseOutcome__big">+118%</div>
              <div className="caseOutcome__label">Trial-to-paid conversion, six weeks after rollout. Sustained at +94% one year later.</div>
            </div>
            <div className="caseOutcome__item reveal" data-d="2">
              <div className="caseOutcome__big">3.4×</div>
              <div className="caseOutcome__label">Median sessions per week among new trial users vs. the previous version.</div>
            </div>
            <div className="caseOutcome__item reveal" data-d="3">
              <div className="caseOutcome__big">0</div>
              <div className="caseOutcome__label">Lines of marketing copy added. Every gain came from removing things.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="caseRelated">
        <div className="wrap">
          <h2>Other work</h2>
          <div className="caseRelated__grid">
            <a className="workCard workCard--half" href={P.page('case-moray')}>
              <div className="workCard__visual workCard__visual--cream" style={{aspectRatio:'4/3'}}>
                <span className="workCard__pill">Enterprise</span>
                <div style={{width:'100%', maxWidth:280, background:'var(--paper)', borderRadius:14, padding:18, color:'var(--ink)'}}>
                  <div style={{display:'flex', gap:6, marginBottom:12}}>
                    <span style={{width:8,height:8,borderRadius:999,background:'var(--crimson)'}}/>
                    <span style={{width:8,height:8,borderRadius:999,background:'var(--orange)'}}/>
                    <span style={{width:8,height:8,borderRadius:999,background:'var(--peach)'}}/>
                  </div>
                  <svg viewBox="0 0 100 30" style={{width:'100%',height:50}} preserveAspectRatio="none">
                    <path d="M0 24 L20 16 L40 20 L60 8 L80 14 L100 4" stroke="var(--crimson)" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
              </div>
              <div className="workCard__body">
                <div className="workCard__meta"><span>Enterprise</span><span>·</span><span>2025</span></div>
                <h3 className="workCard__name">Moray Bank Console</h3>
                <p className="workCard__teaser">We rebuilt the ops console used by 4,200 bankers — and cut average task time in half.</p>
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
window.CaseHalcyonPage = CaseHalcyonPage;
