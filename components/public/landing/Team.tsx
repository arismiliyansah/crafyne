import Image from 'next/image'
import type { TeamMember, SiteSettings } from '@/lib/supabase/types'
import { toneByIndex } from './tones'

const NUM_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve']

export default function Team({ team, settings }: { team: TeamMember[]; settings: SiteSettings }) {
  if (team.length === 0) return null
  const countWord = NUM_WORDS[team.length] ?? String(team.length)

  return (
    <section className="team section" id="team">
      <div className="wrap">
        <div className="team__head">
          <span className="eyebrow reveal">/ {settings.team_eyebrow || 'the studio'}</span>
          <h2 className="team__title h2 display reveal" data-d="1">
            {settings.team_title || (
              <>
                {countWord} people. <span className="italic">No middlemen.</span><br />
                You talk to the person doing the work.
              </>
            )}
          </h2>
          <p className="team__sub reveal" data-d="2">
            {settings.team_sub || 'We keep the studio small on purpose. Every project is run by a senior pair and supported by the whole team in weekly critique.'}
          </p>
        </div>
        <div className="team__grid">
          {team.map((p, i) => {
            const initials = p.name.split(' ').map(n => n[0]).join('').slice(0, 2)
            return (
              <figure className={`tm tm--${toneByIndex(i)} reveal`} data-d={(i % 3) + 1} key={p.id}>
                <div className="tm__avatar">
                  {p.photo_url
                    ? <Image src={p.photo_url} alt={p.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
                    : (
                      <>
                        <span className="tm__initials display">{initials}</span>
                        <span className="tm__tag mono">portrait</span>
                      </>
                    )}
                </div>
                <figcaption className="tm__cap">
                  <div className="tm__name display">{p.name}</div>
                  <div className="tm__role">{p.role}</div>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
