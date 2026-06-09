/* Crafyne — App composes all sections */
const { useEffect, useState, useRef } = React;

// Scroll reveal observer hook — applies .in to .reveal elements as they enter.
// Content is visible by default; we add .js-reveal first to opt INTO the hidden state,
// then observe — so any element that never triggers the observer still ends visible.
function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'));
    // Mark items as JS-controlled so the hidden CSS rule applies
    els.forEach(el => el.classList.add('js-reveal'));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach(el => io.observe(el));

    // Safety net: if anything is still hidden after 2s (e.g. observer throttled,
    // tab backgrounded, or transition stuck), force it visible.
    const safety = setTimeout(() => {
      els.forEach(el => el.classList.add('in'));
    }, 2000);

    // If user prefers reduced motion, reveal everything immediately.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(el => el.classList.add('in'));
    }

    return () => { io.disconnect(); clearTimeout(safety); };
  }, []);
}

function App() {
  useScrollReveal();
  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <LogoStrip />
      <Services />
      <Process />
      <CaseStudies />
      <Team />
      <Testimonials />
      <Pricing />
      <TechStack />
      <CTA />
      <FAQ />
      <Footer />
      <CrafyneTweaks />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
