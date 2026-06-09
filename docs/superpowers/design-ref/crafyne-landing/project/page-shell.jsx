/* Shared page-shell helpers — wraps a sub-page's content with Nav + Footer
   and runs the scroll-reveal observer. Pages render:
     ReactDOM.createRoot(document.getElementById('root')).render(
       <PageShell><MyPage /></PageShell>
     );
*/
function useScrollRevealShell() {
  React.useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'));
    els.forEach(el => el.classList.add('js-reveal'));
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach(el => io.observe(el));
    const safety = setTimeout(() => els.forEach(el => el.classList.add('in')), 2000);
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(el => el.classList.add('in'));
    }
    return () => { io.disconnect(); clearTimeout(safety); };
  }, []);
}

function PageShell({ children }) {
  useScrollRevealShell();
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}

window.PageShell = PageShell;
window.useScrollRevealShell = useScrollRevealShell;
