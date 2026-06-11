/* Stats — animated counters on enter */
function useCountUp(target, start, duration = 1600) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (!start) return;
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value;
}

function StatItem({ value, suffix, label, decimals = 0, started }) {
  const v = useCountUp(value, started);
  const display = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();
  return (
    <div className="stat">
      <div className="stat__num display">
        {display}<span className="stat__suffix">{suffix}</span>
      </div>
      <div className="stat__label">{label}</div>
    </div>
  );
}

function Stats() {
  const ref = React.useRef(null);
  const [started, setStarted] = React.useState(false);
  React.useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setStarted(true); io.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <section className="stats" ref={ref}>
      <div className="wrap">
        <div className="stats__head reveal">
          <span className="eyebrow">/ by the numbers</span>
          <h2 className="stats__title h2 display">
            Eight years of <span className="italic">shipped</span> products,
            measured in trust&nbsp;not&nbsp;tickets.
          </h2>
        </div>
        <div className="stats__grid">
          <StatItem value={142} suffix="" label="Products shipped" started={started} />
          <StatItem value={38} suffix="" label="Active retainer clients" started={started} />
          <StatItem value={4.9} decimals={1} suffix="/5" label="Avg. client rating" started={started} />
          <StatItem value={96} suffix="%" label="Retention after first year" started={started} />
        </div>
      </div>
    </section>
  );
}
window.Stats = Stats;
