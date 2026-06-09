/* Testimonials */
function Testimonials() {
  const quotes = [
    {
      body: "Crafyne shipped what our last two agencies couldn't even scope. They asked harder questions and made us better at our own product.",
      who: "Priya Anand",
      role: "VP Product, Halcyon",
      tone: "crimson",
      rating: 5,
    },
    {
      body: "Felt like working with two senior people I'd hired full-time — except the work landed on Thursday like clockwork.",
      who: "Tomás Reyes",
      role: "Founder, Lumenpath",
      tone: "peach",
      rating: 5,
    },
    {
      body: "They cut our internal tool from a 90-second login to a 4-second one. The team still talks about it in standups.",
      who: "Yuki Hoshino",
      role: "Eng Director, Moray Bank",
      tone: "navy",
      rating: 5,
    },
    {
      body: "The Crafyne team writes more in writing than any vendor we've worked with. Briefs, decisions, trade-offs — it's all there.",
      who: "Anya Müller",
      role: "Head of Ops, Fieldwise",
      tone: "orange",
      rating: 5,
    },
  ];
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
          {quotes.map((q, i) => (
            <figure className={`q q--${q.tone} reveal`} data-d={(i % 2) + 1} key={i}>
              <div className="q__mark display">&ldquo;</div>
              <blockquote className="q__body">{q.body}</blockquote>
              <figcaption className="q__cap">
                <div className="q__avatar">{q.who.split(' ').map(n=>n[0]).join('')}</div>
                <div>
                  <div className="q__who">{q.who}</div>
                  <div className="q__role mono">{q.role}</div>
                </div>
                <div className="q__stars" aria-label={`${q.rating} out of 5`}>
                  {Array.from({length:5}).map((_,j)=>(
                    <span key={j} className={j < q.rating ? "on" : ""}>★</span>
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Testimonials = Testimonials;
