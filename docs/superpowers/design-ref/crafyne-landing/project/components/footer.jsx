/* Footer */
function Footer() {
  const P = window.CRAFYNE_PATHS;
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__top">
          <div className="foot__brand">
            <div className="foot__brandLine">
              <span className="foot__mark" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M4 4h7a6 6 0 0 1 0 12H8l8 4H4z" fill="currentColor"/></svg>
              </span>
              <span className="foot__brandName display" data-brand-name>Crafyne</span>
            </div>
            <p className="foot__line">
              An independent software studio. We build software for people who care how it feels.
            </p>
            <div className="foot__addr mono">
              Setiabudi One, 14th floor<br />
              Jakarta · Indonesia
            </div>
          </div>
          <div className="foot__cols">
            <div className="foot__col">
              <div className="foot__h mono">Studio</div>
              <a href={P.page('work')}>Work</a>
              <a href={P.landing('services')}>Services</a>
              <a href={P.landing('process')}>Process</a>
              <a href={P.landing('pricing')}>Pricing</a>
              <a href={P.page('about')}>About</a>
            </div>
            <div className="foot__col">
              <div className="foot__h mono">Company</div>
              <a href={P.page('about')}>About</a>
              <a href={P.page('journal')}>Journal</a>
              <a href={P.page('careers')}>Careers <span className="foot__pill">2 open</span></a>
              <a href="#">Press kit</a>
            </div>
            <div className="foot__col">
              <div className="foot__h mono">Get in touch</div>
              <a className="mono" href="mailto:hello@crafyne.studio">hello@crafyne.studio</a>
              <a className="mono" href={P.page('contact')}>Start a project</a>
              <div className="foot__social">
                <a href="#" aria-label="LinkedIn">Li</a>
                <a href="#" aria-label="X">X</a>
                <a href="#" aria-label="Github">Gh</a>
                <a href="#" aria-label="Dribbble">Dr</a>
              </div>
            </div>
          </div>
        </div>
        <div className="foot__wordmark display" aria-hidden="true">CRAFYNE</div>
        <div className="foot__bot">
          <div className="mono">© 2026 Crafyne Studio · Booking Q3 slots</div>
          <div className="foot__legal mono">
            <a href="#">Privacy</a>
            <span>·</span>
            <a href="#">Terms</a>
            <span>·</span>
            <a href="#">Colophon</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
