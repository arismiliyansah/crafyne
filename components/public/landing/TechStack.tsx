import type { TechGroup } from '@/lib/supabase/types'

export default function TechStack({ groups }: { groups: TechGroup[] }) {
  if (groups.length === 0) return null
  return (
    <section className="stack section">
      <div className="wrap">
        <div className="stack__head">
          <span className="eyebrow reveal">/ our stack</span>
          <h2 className="stack__title h2 display reveal" data-d="1">
            We pick tools that <span className="italic">survive</span> the project.
          </h2>
        </div>
        <div className="stack__groups">
          {groups.map((g, i) => (
            <div className="stack__group reveal" data-d={i + 1} key={g.id}>
              <div className="stack__cat mono">{g.label}</div>
              <div className="stack__chips">
                {g.items.map(it => (<span className="chip" key={it}>{it}</span>))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
