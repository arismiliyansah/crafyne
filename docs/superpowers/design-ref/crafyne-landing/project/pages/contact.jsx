/* Contact page — project intake form */
function ContactPage() {
  const P = window.CRAFYNE_PATHS;
  const [form, setForm] = React.useState({
    name: '', email: '', company: '', role: '',
    services: [], budget: '', timeline: '',
    project: '', how: '',
  });
  const [submitted, setSubmitted] = React.useState(false);

  const services = ['Product design', 'Web engineering', 'Mobile apps', 'AI & ML', 'Enterprise software', 'Not sure yet'];
  const budgets = ['Under $25k', '$25k–$75k', '$75k–$200k', '$200k+', 'Retainer'];
  const timelines = ['ASAP', 'Within a month', 'Within a quarter', 'Just exploring'];

  const toggleService = (s) => {
    setForm(f => ({ ...f, services: f.services.includes(s) ? f.services.filter(x => x !== s) : [...f.services, s] }));
  };
  const onSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <main className="contactPage">
      <section className="pageHero pageHero--crimson">
        <div className="wrap">
          <div className="pageHero__crumb reveal">
            <a href={P.home}>Crafyne</a><span>/</span><span>Contact</span>
          </div>
          <div className="pageHero__eyebrow reveal">/ start a project</div>
          <h1 className="pageHero__title reveal" data-d="1">
            Tell us what <span className="italic" style={{fontFamily:'"Instrument Serif", serif', textTransform:'none', fontWeight:400}}>you&rsquo;re building.</span>
          </h1>
          <p className="pageHero__sub reveal" data-d="2">
            A real human replies within one working day with honest first impressions. If we&rsquo;re not
            the right team, we&rsquo;ll tell you who is.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap contactGrid">
          <aside className="contactInfo">
            <div className="contactInfo__avail reveal">
              <div className="contactInfo__availLabel">
                <span className="contactInfo__dot" /> Booking now
              </div>
              <div style={{fontFamily:'Bricolage Grotesque', fontSize:20, fontWeight:600}}>Next slot opens Aug 4, 2026</div>
              <div style={{fontSize:13, opacity:0.7, marginTop:4}}>We respond to all inquiries within one working day, Asia/Jakarta hours.</div>
            </div>

            <div className="contactInfo__group reveal" data-d="1">
              <span className="contactInfo__label">Email</span>
              <span className="contactInfo__val"><a href="mailto:hello@crafyne.studio">hello@crafyne.studio</a></span>
            </div>
            <div className="contactInfo__group reveal" data-d="1">
              <span className="contactInfo__label">Phone</span>
              <span className="contactInfo__val mono" style={{fontFamily:'JetBrains Mono', fontSize:18}}>+62 21 5089 1212</span>
            </div>
            <div className="contactInfo__group reveal" data-d="2">
              <span className="contactInfo__label">Studio</span>
              <span className="contactInfo__val" style={{fontSize:16, fontWeight:500, lineHeight:1.5}}>
                Setiabudi One, 14th floor<br/>
                Jl. HR Rasuna Said<br/>
                Jakarta 12920, Indonesia
              </span>
            </div>
            <div className="contactInfo__group reveal" data-d="2">
              <span className="contactInfo__label">Hours</span>
              <span className="contactInfo__val" style={{fontSize:16}}>Mon–Fri · 09:00–18:00 WIB</span>
            </div>
            <div className="contactInfo__group reveal" data-d="3">
              <span className="contactInfo__label">For press</span>
              <span className="contactInfo__val"><a href="mailto:press@crafyne.studio" style={{fontSize:16}}>press@crafyne.studio</a></span>
            </div>
          </aside>

          {submitted ? (
            <div className="contactForm reveal">
              <div style={{display:'flex', flexDirection:'column', gap:20}}>
                <div style={{width:56, height:56, borderRadius:999, background:'var(--crimson)', color:'var(--cream)', display:'grid', placeItems:'center', fontFamily:'Bricolage Grotesque', fontSize:28, fontWeight:700}}>✓</div>
                <h2 style={{fontFamily:'Bricolage Grotesque', fontSize:32, fontWeight:700, letterSpacing:'-0.02em', lineHeight:1.1, margin:0}}>Got it — {form.name || 'thank you'}.</h2>
                <p style={{fontSize:17, lineHeight:1.55, color:'var(--ink-soft)', margin:0}}>
                  A real person is reading your message right now and will reply to {form.email || 'you'} within
                  one working day. If it&rsquo;s urgent, ring us — we pick up.
                </p>
                <div className="contactForm__success">
                  <strong>While you wait:</strong> have a look at our most recent case study, <a href={P.page('case-halcyon')} style={{color:'var(--crimson)', fontWeight:600}}>Halcyon</a>. It&rsquo;s probably the best window into how we actually work.
                </div>
                <button className="btn btn--ink" style={{alignSelf:'flex-start'}} onClick={() => { setSubmitted(false); setForm({name:'',email:'',company:'',role:'',services:[],budget:'',timeline:'',project:'',how:''}); }}>
                  Send another →
                </button>
              </div>
            </div>
          ) : (
            <form className="contactForm reveal" onSubmit={onSubmit}>
              <div style={{marginBottom:24}}>
                <div className="eyebrow" style={{color:'var(--crimson)', marginBottom:8}}>/ section 01</div>
                <h2 style={{fontFamily:'Bricolage Grotesque', fontSize:24, fontWeight:700, letterSpacing:'-0.02em', margin:0}}>Who&rsquo;s asking?</h2>
              </div>
              <div className="contactForm__row contactForm__row--two">
                <div className="field">
                  <label className="field__label">Your name</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Jane Doe" />
                </div>
                <div className="field">
                  <label className="field__label">Email</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="jane@company.com" />
                </div>
              </div>
              <div className="contactForm__row contactForm__row--two">
                <div className="field">
                  <label className="field__label">Company</label>
                  <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="Acme Inc." />
                </div>
                <div className="field">
                  <label className="field__label">Your role</label>
                  <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="Head of Product" />
                </div>
              </div>

              <div style={{margin:'40px 0 24px'}}>
                <div className="eyebrow" style={{color:'var(--crimson)', marginBottom:8}}>/ section 02</div>
                <h2 style={{fontFamily:'Bricolage Grotesque', fontSize:24, fontWeight:700, letterSpacing:'-0.02em', margin:0}}>The project</h2>
              </div>
              <div className="contactForm__row">
                <div className="field">
                  <label className="field__label">What do you need? (pick any)</label>
                  <div className="field__chips">
                    {services.map(s => (
                      <button type="button" key={s}
                        className={"field__chip " + (form.services.includes(s) ? "is-on" : "")}
                        onClick={() => toggleService(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="contactForm__row contactForm__row--two">
                <div className="field">
                  <label className="field__label">Budget</label>
                  <select value={form.budget} onChange={e => setForm({...form, budget: e.target.value})}>
                    <option value="">Pick a range</option>
                    {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="field__label">Timeline</label>
                  <select value={form.timeline} onChange={e => setForm({...form, timeline: e.target.value})}>
                    <option value="">When do you want to start?</option>
                    {timelines.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="contactForm__row">
                <div className="field">
                  <label className="field__label">Tell us about it</label>
                  <textarea required value={form.project} onChange={e => setForm({...form, project: e.target.value})} placeholder="What are you building? Who's it for? What's the messy real version?" />
                </div>
              </div>
              <div className="contactForm__row">
                <div className="field">
                  <label className="field__label">How did you find us? (optional)</label>
                  <input value={form.how} onChange={e => setForm({...form, how: e.target.value})} placeholder="A friend, a Google search, a talk we gave..." />
                </div>
              </div>

              <div className="contactForm__submit">
                <span className="contactForm__note">We never share your details. You&rsquo;ll get one human reply, no sequence.</span>
                <button type="submit" className="btn btn--ink">
                  Send to Crafyne
                  <span className="btn__arrow" aria-hidden="true">
                    <svg viewBox="0 0 12 12"><path d="M3 9 9 3M9 3H4M9 3v5" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
window.ContactPage = ContactPage;
