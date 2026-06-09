// Client logo marquee — wordmarks from the proof_clients setting
export default function LogoStrip({ clients }: { clients: string[] }) {
  if (clients.length === 0) return null
  const full = [...clients, ...clients]
  return (
    <section className="logos">
      <div className="wrap logos__head">
        <span className="eyebrow">/ trusted by teams worldwide</span>
        <span className="logos__note mono">Selected clients · 2018&ndash;26</span>
      </div>
      <div className="logos__track" aria-hidden="false">
        <div className="logos__rail">
          {full.map((name, i) => (
            <div className="logos__item" key={i}>
              <span className="logos__glyph">◆</span>
              <span className="logos__name">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
