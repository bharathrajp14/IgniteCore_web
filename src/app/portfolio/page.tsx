import type { Metadata } from "next";
import { PROJECTS } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Portfolio | IgniteCore Projects and Builds",
  description:
    "Review IgniteCore project work including JobBoard Pro, LifeOS, HexStrike AI, and internal automation demo tools.",
};

export default function PortfolioPage() {
  return (
    <section className="section-shell">
      <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
        <p className="kicker">Portfolio</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">Selected builds that reflect delivery quality</h1>
        <p className="mt-4 max-w-3xl text-[var(--color-slate)]">
          Project snapshots for clients, collaborators, and recruiters evaluating architecture quality and execution standards.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {PROJECTS.map((project) => (
            <article key={project.name} className="surface-card p-6">
              <h2 className="text-2xl">{project.name}</h2>
              <p className="mt-2 text-sm text-[var(--color-slate)]">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="rounded-md bg-[var(--color-cream)] px-2 py-1 font-mono text-xs text-[var(--color-deep-navy)]">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex gap-3">
                <a href={project.demo} target="_blank" rel="noreferrer" className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-semibold hover:bg-[var(--color-cream)]">
                  Live Demo
                </a>
                <a href={project.github} target="_blank" rel="noreferrer" className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-semibold hover:bg-[var(--color-cream)]">
                  GitHub
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
