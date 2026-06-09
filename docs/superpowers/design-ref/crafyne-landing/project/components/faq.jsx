/* FAQ — accordion */
function FAQ() {
  const items = [
    {
      q: "How small is too small for Crafyne?",
      a: "If you have at least two weeks of work and a real decision-maker on the project, we'll talk. We've taken on focused sprints as small as $12.5k.",
    },
    {
      q: "Do you take equity in lieu of cash?",
      a: "Rarely, and only when we'd want to use the product ourselves. We'll usually suggest a smaller paid scope first so both sides can find out if we work well together.",
    },
    {
      q: "Where is the team based?",
      a: "Our core team is in Jakarta with a few collaborators in Singapore and Lisbon. We overlap with most timezones for at least four hours a day.",
    },
    {
      q: "Who owns the code and the designs?",
      a: "You do, on payment of the final invoice. Source files, design files, prototypes — all yours. We keep the right to talk about the work publicly unless you ask us not to.",
    },
    {
      q: "Can you work alongside our in-house team?",
      a: "Yes — about half of our engagements are mixed. We'll embed in your Linear, Slack, and standup, and review PRs from your team if helpful.",
    },
    {
      q: "What does \"senior pair\" actually mean?",
      a: "Every project is anchored by one principal-level engineer and one design director or staff designer. They make the calls and write most of the code. No project is run by a junior solo.",
    },
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <section className="faq section" id="faq">
      <div className="wrap faq__wrap">
        <div className="faq__head">
          <span className="eyebrow reveal">/ honest answers</span>
          <h2 className="faq__title h2 display reveal" data-d="1">
            Things people <span className="italic">actually</span> ask us.
          </h2>
          <p className="faq__sub reveal" data-d="2">
            Don&rsquo;t see your question? Email{" "}
            <a className="mono" href="mailto:hello@crafyne.studio">hello@crafyne.studio</a> and you&rsquo;ll
            get a real answer from a real person.
          </p>
        </div>
        <ul className="faq__list">
          {items.map((it, i) => (
            <li className={"faq__item reveal " + (open === i ? "is-open" : "")} data-d={(i % 3) + 1} key={i}>
              <button
                className="faq__q"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                <span className="faq__qNum mono">/{String(i + 1).padStart(2, "0")}</span>
                <span className="faq__qText">{it.q}</span>
                <span className="faq__toggle" aria-hidden="true">
                  <svg viewBox="0 0 16 16"><path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                </span>
              </button>
              <div className="faq__a">
                <p>{it.a}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
window.FAQ = FAQ;
