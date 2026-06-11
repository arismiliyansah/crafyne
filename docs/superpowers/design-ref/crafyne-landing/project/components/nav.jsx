/* Nav — shared across landing + sub-pages, with animated mobile menu */
function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  // Lock page scroll while the mobile menu is open (lock both html & body —
  // on mobile the scroll container is often the html element, not body)
  React.useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (menuOpen) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      html.classList.add('nav-locked');
    } else {
      html.style.overflow = '';
      body.style.overflow = '';
      html.classList.remove('nav-locked');
    }
    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      html.classList.remove('nav-locked');
    };
  }, [menuOpen]);
  // Close on escape
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const P = window.CRAFYNE_PATHS;
  const links = [
    { href: P.page('work'), label: 'Work' },
    { href: P.landing('services'), label: 'Services' },
    { href: P.landing('process'), label: 'Process' },
    { href: P.landing('pricing'), label: 'Pricing' },
    { href: P.page('about'), label: 'About' },
    { href: P.page('journal'), label: 'Journal' },
    { href: P.page('careers'), label: 'Careers' },
  ];

  return (
    <nav className={"nav " + (scrolled ? "nav--scrolled " : "") + (menuOpen ? "nav--menu-open" : "")}>
      <div className="nav__inner wrap" style={{ height: "44px" }}>
        <a href={P.home} className="nav__brand" onClick={() => setMenuOpen(false)}>
          <span className="nav__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M4 4h7a6 6 0 0 1 0 12H8l8 4H4z" fill="currentColor" /></svg>
          </span>
          <span data-brand-name>Crafyne</span>
          <span className="nav__brand-suffix mono">/studio</span>
        </a>

        <div className="nav__links" style={{ fontSize: "16px", fontWeight: "700" }}>
          {links.slice(0, 6).map(l => (
            <a key={l.label} href={l.href}>{l.label}</a>
          ))}
        </div>

        <div className="nav__cta">
          <a href={P.page('careers')} className="nav__login">Careers</a>
          <a href={P.page('contact')} className="btn btn--ink nav__book">
            Book a call
            <span className="btn__arrow" aria-hidden="true">
              <svg viewBox="0 0 12 12"><path d="M3 9 9 3M9 3H4M9 3v5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
            </span>
          </a>
        </div>

        <button
          className="nav__burger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span className="nav__burgerBox" aria-hidden="true">
            <span className="nav__burgerLine" />
            <span className="nav__burgerLine" />
          </span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div className={"navMenu " + (menuOpen ? "navMenu--open" : "")} aria-hidden={!menuOpen}>
        <button className="navMenu__close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
        </button>
        <div className="navMenu__inner">
          <ul className="navMenu__list">
            {links.map((l, i) => (
              <li className="navMenu__item" key={l.label} style={{ transitionDelay: (menuOpen ? 0.12 + i * 0.05 : 0) + 's' }}>
                <a href={l.href} onClick={() => setMenuOpen(false)}>
                  <span className="navMenu__num mono">/{String(i + 1).padStart(2, '0')}</span>
                  <span className="navMenu__label">{l.label}</span>
                  <span className="navMenu__arr" aria-hidden="true">
                    <svg viewBox="0 0 14 14"><path d="M3 11 11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="navMenu__foot" style={{ transitionDelay: (menuOpen ? 0.12 + links.length * 0.05 : 0) + 's' }}>
            <a href={P.page('contact')} className="btn btn--orange navMenu__cta" onClick={() => setMenuOpen(false)}>
              Book a call
              <span className="btn__arrow" aria-hidden="true">
                <svg viewBox="0 0 12 12"><path d="M3 9 9 3M9 3H4M9 3v5" stroke="#0E1530" strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
              </span>
            </a>
            <a className="navMenu__mail mono" href="mailto:hello@crafyne.studio">hello@crafyne.studio</a>
          </div>
        </div>
      </div>
    </nav>);

}
window.Nav = Nav;
