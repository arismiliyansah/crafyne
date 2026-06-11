import type { Testimonial } from '@/lib/supabase/types'

// The .q--* CSS defines four tones; cycle within them.
const Q_TONES = ['crimson', 'peach', 'navy', 'orange'] as const

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null
  return (
    <section className="quotes section" id="testimonials">
      <div className="wrap">
        <div className="quotes__head">
          <span className="eyebrow reveal">/ said about us</span>
          <h2 className="quotes__title h2 display reveal" data-d="1">
            What it&rsquo;s like to <span className="italic">work with us.</span>
          </h2>
        </div>
        <div className="quotes__grid">
          {testimonials.map((q, i) => {
            const role = [q.author_role, q.author_company].filter(Boolean).join(', ')
            const initials = q.author_name.split(' ').map(n => n[0]).join('')
            return (
              <figure className={`q q--${Q_TONES[i % Q_TONES.length]} reveal`} data-d={(i % 2) + 1} key={q.id}>
                <div className="q__mark display">&ldquo;</div>
                <blockquote className="q__body">{q.quote}</blockquote>
                <figcaption className="q__cap">
                  <div className="q__avatar">{initials}</div>
                  <div>
                    <div className="q__who">{q.author_name}</div>
                    <div className="q__role mono">{role}</div>
                  </div>
                  <div className="q__stars" aria-label={`${q.rating} out of 5`}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <span key={j} className={j < q.rating ? 'on' : ''}>★</span>
                    ))}
                  </div>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
