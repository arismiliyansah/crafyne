/* Client logo marquee — placeholder logotypes (no real brand recreation) */
function LogoStrip() {
  const logos = [
    { name: "northwind", glyph: "▲" },
    { name: "porter & rye", glyph: "✦" },
    { name: "lumenpath", glyph: "◐" },
    { name: "halcyon", glyph: "✺" },
    { name: "kindlepost", glyph: "◇" },
    { name: "fieldwise", glyph: "❍" },
    { name: "moray bank", glyph: "▣" },
    { name: "tessera", glyph: "✶" },
  ];
  const full = [...logos, ...logos];
  return (
    <section className="logos">
      <div className="wrap logos__head">
        <span className="eyebrow">/ trusted by 38 teams worldwide</span>
        <span className="logos__note mono">Selected clients · 2018&ndash;26</span>
      </div>
      <div className="logos__track" aria-hidden="false">
        <div className="logos__rail">
          {full.map((l, i) => (
            <div className="logos__item" key={i}>
              <span className="logos__glyph">{l.glyph}</span>
              <span className="logos__name">{l.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.LogoStrip = LogoStrip;
