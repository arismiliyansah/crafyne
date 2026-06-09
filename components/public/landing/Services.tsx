import type { Service } from '@/lib/supabase/types'

function ServiceCard({ idx, title, body, bullets, tone, span, glyph }: {
  idx: number; title: string; body: string; bullets: string[]; tone: string; span: string; glyph: string | null
}) {
  return (
    <article className={`svc svc--${tone} ${span ? 'svc--' + span : ''} reveal`} data-d={idx}>
      <div className="svc__head">
        <span className="mono svc__idx">/{String(idx).padStart(2, '0')}</span>
        <span className="svc__glyph" aria-hidden="true">{glyph}</span>
      </div>
      <h3 className="svc__title display">{title}</h3>
      <p className="svc__body">{body}</p>
      <ul className="svc__list">
        {bullets.map((b, i) => (<li key={i}><span className="svc__bullet" />{b}</li>))}
      </ul>
      <a className="svc__cta" href="#contact">
        <span>See deliverables</span>
        <span className="svc__arrow" aria-hidden="true">
          <svg viewBox="0 0 14 14"><path d="M3 11 11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
        </span>
      </a>
    </article>
  )
}

export default function Services({ services }: { services: Service[] }) {
  if (services.length === 0) return null
  return (
    <section className="svcs section" id="services">
      <div className="wrap">
        <div className="svcs__head">
          <span className="eyebrow reveal">/ what we do</span>
          <h2 className="svcs__title h2 display reveal" data-d="1">
            Five practices. <span className="italic">One team</span>.<br />
            Built around how good software actually gets made.
          </h2>
          <p className="svcs__sub reveal" data-d="2">
            We don&rsquo;t hand projects to juniors when you&rsquo;re not looking. Every engagement
            runs with a senior pair: someone who designs, someone who ships.
          </p>
        </div>
        <div className="svcs__grid">
          {services.map((s, i) => (
            <ServiceCard key={s.id} idx={i + 1} title={s.title} body={s.body} bullets={s.bullets} tone={s.tone} span={s.span} glyph={s.glyph} />
          ))}
        </div>
      </div>
    </section>
  )
}
