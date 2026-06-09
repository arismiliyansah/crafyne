/* Team — irregular grid w/ avatar placeholders */
function Team() {
  const people = [
    { name: "Sari Wibowo", role: "Founder · Principal Engineer", tone: "crimson", initials: "SW" },
    { name: "Daniel Okafor", role: "Design Director", tone: "peach", initials: "DO" },
    { name: "Mei Tanaka", role: "Staff iOS Engineer", tone: "navy", initials: "MT" },
    { name: "Arjun Pillai", role: "AI / Platform Lead", tone: "orange", initials: "AP" },
    { name: "Hana Pratiwi", role: "Product Designer", tone: "cream", initials: "HP" },
    { name: "Lucas Marin", role: "Engineering Manager", tone: "navy-2", initials: "LM" },
  ];
  return (
    <section className="team section" id="team">
      <div className="wrap">
        <div className="team__head">
          <span className="eyebrow reveal">/ the studio</span>
          <h2 className="team__title h2 display reveal" data-d="1">
            Six people. <span className="italic">No middlemen.</span><br />
            You talk to the person doing the work.
          </h2>
          <p className="team__sub reveal" data-d="2">
            We keep the studio small on purpose. Every project is run by a senior pair
            and supported by the whole team in weekly critique.
          </p>
        </div>
        <div className="team__grid">
          {people.map((p, i) => (
            <figure className={`tm tm--${p.tone} reveal`} data-d={(i % 3) + 1} key={p.name}>
              <div className="tm__avatar">
                <span className="tm__initials display">{p.initials}</span>
                <span className="tm__tag mono">portrait</span>
              </div>
              <figcaption className="tm__cap">
                <div className="tm__name display">{p.name}</div>
                <div className="tm__role">{p.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Team = Team;
