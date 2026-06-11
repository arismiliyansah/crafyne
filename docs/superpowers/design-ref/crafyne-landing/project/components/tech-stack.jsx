/* Tech stack — chip rows grouped by category */
function TechStack() {
  const groups = [
    { label: "Frontend", items: ["React", "Next.js", "TypeScript", "Astro", "SwiftUI", "Jetpack Compose"] },
    { label: "Backend", items: ["Node", "Go", "PostgreSQL", "tRPC", "GraphQL", "Redis"] },
    { label: "AI / ML", items: ["Anthropic", "OpenAI", "Weaviate", "LangChain", "Eval-driven dev"] },
    { label: "Infra", items: ["Vercel", "Fly.io", "AWS", "Terraform", "GitHub Actions", "Sentry"] },
    { label: "Design", items: ["Figma", "Framer", "Rive", "Lottie", "Linear", "Notion"] },
  ];
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
            <div className="stack__group reveal" data-d={i + 1} key={g.label}>
              <div className="stack__cat mono">{g.label}</div>
              <div className="stack__chips">
                {g.items.map(it => (
                  <span className="chip" key={it}>{it}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.TechStack = TechStack;
