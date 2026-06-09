/* Process — 4-step flow */
function Process() {
  const steps = [
    {
      n: "01", t: "Listen",
      blurb: "We start with a 90-minute working session — your goals, constraints, the messy real version. No deck.",
      details: ["Stakeholder interviews", "Current-state audit", "Success metrics defined together"],
    },
    {
      n: "02", t: "Shape",
      blurb: "A two-week sprint to pressure-test the idea. Sketches, prototypes, and a written scope you can sign off on.",
      details: ["Flow & screen architecture", "Hi-fi prototype + user testing", "Estimate &  team plan"],
    },
    {
      n: "03", t: "Build",
      blurb: "Weekly demos, every Thursday. You ship to staging at end of week one. You ship to users by month two.",
      details: ["Trunk-based engineering", "Design QA before merge", "Live-build environment from day 1"],
    },
    {
      n: "04", t: "Tend",
      blurb: "We don't disappear at launch. We measure, iterate, and hand off cleanly when you're ready.",
      details: ["30-day stabilization window", "Documentation & runbooks", "Optional retainer for ongoing work"],
    },
  ];
  return (
    <section className="proc section" id="process">
      <div className="wrap">
        <div className="proc__head">
          <span className="eyebrow reveal">/ how we work</span>
          <h2 className="proc__title h2 display reveal" data-d="1">
            A small process, <span className="italic">repeated</span> well.
          </h2>
        </div>
        <ol className="proc__list">
          {steps.map((s, i) => (
            <li className="proc__step reveal" data-d={i + 1} key={i}>
              <div className="proc__n display">{s.n}</div>
              <div className="proc__main">
                <h3 className="proc__t display">{s.t}</h3>
                <p className="proc__blurb">{s.blurb}</p>
              </div>
              <ul className="proc__details">
                {s.details.map((d, j) => (
                  <li key={j}><span className="proc__bullet" />{d}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
window.Process = Process;
