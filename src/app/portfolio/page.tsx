import type { Metadata } from "next";
import { PROJECTS } from "@/lib/siteContent";
import { translate } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18nServer";

export const metadata: Metadata = {
  title: "Portfolio | IgniteCore Projects and Builds",
  description:
    "Review IgniteCore project work including JobBoard Pro, LifeOS, HexStrike AI, and internal automation demo tools.",
};

export default async function PortfolioPage() {
  const language = await getServerLanguage();
  const t = (key: string) => translate(language, key);

  return (
    <section className="section-shell">
      <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
        <p className="kicker">{t("portfolio.kicker")}</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">{t("portfolio.title")}</h1>
        <p className="mt-4 max-w-3xl text-[var(--color-slate)]">
          {t("portfolio.intro")}
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
                  {t("portfolio.demo")}
                </a>
                <a href={project.github} target="_blank" rel="noreferrer" className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-semibold hover:bg-[var(--color-cream)]">
                  {t("portfolio.github")}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
