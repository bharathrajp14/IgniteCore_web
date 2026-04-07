import type { Metadata } from "next";
import { PORTFOLIO_PROJECTS, SKILLS } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Portfolio: AI and Automation Projects | IgniteCore",
  description:
    "Explore JobBoard Pro, LifeOS, and HexStrike AI with tech stack details, GitHub links, and practical delivery capabilities.",
};

export default function PortfolioPage() {
  return (
    <section className="section-shell">
      <div className="mx-auto w-full max-w-[1100px] space-y-8 px-4 md:px-6">
        <header>
          <h1 className="font-display text-4xl italic md:text-5xl">Portfolio</h1>
          <p className="mt-4 max-w-3xl text-[var(--color-slate)]">
            Featured projects that demonstrate product thinking, automation delivery, and practical AI integration.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {PORTFOLIO_PROJECTS.map((project) => (
            <article key={project.name} className="rounded-xl border border-[var(--color-border)] bg-white p-5">
              <h2 className="text-2xl">{project.name}</h2>
              <p className="mt-2 text-sm text-[var(--color-slate)]">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-[var(--color-cream)] px-2 py-1 font-mono text-xs text-[var(--color-deep-navy)]">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex gap-3">
                <a href={project.github} target="_blank" rel="noreferrer" className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm font-medium hover:bg-[var(--color-cream)]">
                  GitHub
                </a>
                <a href={project.demo} target="_blank" rel="noreferrer" className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm font-medium hover:bg-[var(--color-cream)]">
                  Live demo
                </a>
              </div>
            </article>
          ))}
        </div>

        <article className="rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="text-2xl">Skill depth</h2>
          <div className="mt-4 space-y-4">
            {SKILLS.map((skill) => (
              <div key={skill.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{skill.name}</span>
                  <span className="font-mono text-[var(--color-teal)]">{skill.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-cream)]">
                  <div className="h-2 rounded-full bg-[var(--color-orange)]" style={{ width: `${skill.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
