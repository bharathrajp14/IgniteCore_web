import type { Metadata } from "next";
import Link from "next/link";
import { QualifierBookingForm } from "@/components/QualifierBookingForm";
import { formatTranslation, translate } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18nServer";
import {
  BRAND,
  CASE_STUDIES,
  COURSE_MODULES,
  HOME_PROBLEMS,
  HOW_IT_WORKS,
  PROJECTS,
  SERVICES,
  TRUST_STRIP,
} from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "IgniteCore Solutions | AI Automation and Conversion-Focused Websites",
  description:
    "AI automation partner for clinics, coaching institutes, and real estate teams that need reliable lead follow-up.",
};

export default async function HomePage() {
  const language = await getServerLanguage();
  const t = (key: string) => translate(language, key);

  return (
    <>
      <section className="hex-bg bg-[var(--color-dark)] text-white">
        <div className="section-shell mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <p className="kicker text-slate-300">{t("home.hero.kicker")}</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight md:text-6xl">
            {t("home.hero.headline")}
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-200 md:text-lg">
            {t("home.hero.subheadline")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#qualifier"
              className="min-h-11 rounded-md bg-[var(--color-orange)] px-6 py-3 text-center font-semibold text-white hover:bg-[var(--color-ember)]"
            >
              {t("home.final.primary")}
            </a>
            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="min-h-11 rounded-md border border-white/30 px-6 py-3 text-center font-medium text-white hover:bg-white/10"
            >
              {t("cta.whatsapp")}
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-300">
            {t("home.hero.nextHint")}
          </p>
        </div>
      </section>

      <section id="qualifier" className="section-shell bg-white">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <p className="kicker">{t("home.qualifier.kicker")}</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">{t("home.qualifier.title")}</h2>
          <p className="mt-4 max-w-2xl text-sm text-[var(--color-slate)] md:text-base">
            {t("home.qualifier.desc")}
          </p>
          <QualifierBookingForm />
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-white">
        <div className="mx-auto grid w-full max-w-[1100px] gap-2 px-4 py-5 md:grid-cols-4 md:px-6">
          {TRUST_STRIP.map((item) => (
            <p key={item} className="text-center text-xs font-mono uppercase tracking-[0.16em] text-[var(--color-slate)]">
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <p className="kicker">{t("home.problems.kicker")}</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">{t("home.problems.title")}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {HOME_PROBLEMS.map((problem) => (
              <article key={problem.title} className="surface-card p-6">
                <h3 className="text-2xl">{problem.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-slate)]">{problem.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell bg-white">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <p className="kicker">{t("home.services.kicker")}</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">{t("home.services.title")}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {SERVICES.slice(0, 6).map((service) => (
              <article key={service.name} className="surface-card p-6">
                <h3 className="text-2xl">{service.name}</h3>
                <p className="mt-2 text-sm text-[var(--color-slate)]">{service.description}</p>
                <p className="mt-3 text-sm text-[var(--color-deep-navy)]">
                  <strong>{t("home.services.for")}</strong> {service.audience}
                </p>
                <p className="mt-1 text-sm text-[var(--color-deep-navy)]">
                  <strong>{t("home.services.outcome")}</strong> {service.outcome}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/services" className="rounded-md border border-[var(--color-border)] px-5 py-3 text-sm font-semibold hover:bg-[var(--color-cream)]">
              {t("home.services.seeAll")}
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <p className="kicker">{t("home.how.kicker")}</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">{t("home.how.title")}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <article key={item.step} className="surface-card p-6">
                <p className="font-mono text-xs tracking-[0.18em] text-[var(--color-teal)]">{t("home.how.step")} {item.step}</p>
                <h3 className="mt-2 text-2xl">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-slate)]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell bg-white">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <p className="kicker">{t("home.learn.kicker")}</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">{t("home.learn.title")}</h2>
          <p className="mt-4 max-w-2xl text-sm text-[var(--color-slate)] md:text-base">
            {t("home.learn.desc")}
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {COURSE_MODULES.slice(0, 3).map((course) => (
              <article key={course.slug} className="surface-card p-6">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-teal)]">{course.category}</p>
                <h3 className="mt-2 text-xl">{course.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-slate)]">{course.summary}</p>
                <p className="mt-3 text-xs text-[var(--color-deep-navy)]">{course.duration} | {course.lessons} lessons</p>
              </article>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/courses" className="rounded-md border border-[var(--color-border)] px-5 py-3 text-sm font-semibold hover:bg-[var(--color-cream)]">
              {t("home.learn.explore")}
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell bg-white">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <p className="kicker">{t("home.projects.kicker")}</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">{t("home.projects.title")}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {PROJECTS.slice(0, 4).map((project) => (
              <article key={project.name} className="surface-card p-6">
                <h3 className="text-2xl">{project.name}</h3>
                <p className="mt-2 text-sm text-[var(--color-slate)]">{project.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="rounded-md bg-[var(--color-cream)] px-2 py-1 font-mono text-xs text-[var(--color-deep-navy)]">
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <p className="kicker">{t("home.results.kicker")}</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">{t("home.results.title")}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {CASE_STUDIES.map((study: Record<string, string>) => (
              <article key={study.title} className="surface-card p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-slate)]">{study.industry}</p>
                <h3 className="mt-2 text-2xl">{study.title}</h3>
                <p className="mt-3 text-sm text-[var(--color-slate)]">{study.problem}</p>
                <p className="mt-3 text-sm italic text-[var(--color-slate)]">&quot;{study.solution}&quot;</p>
                <p className="mt-3 text-sm font-medium text-[var(--color-deep-navy)]">{study.impact}</p>
                <p className="mt-3 text-sm font-bold text-[var(--color-slate)]">{study.beforeAfter}</p>
              </article>
            ))}
          </div>
        </div>
      </section>



      <section className="section-shell bg-[var(--color-dark)] text-white">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <h2 className="font-display text-3xl md:text-5xl">{t("home.final.title")}</h2>
          <p className="mt-4 max-w-2xl text-sm text-slate-300 md:text-base">
            {formatTranslation(t("home.final.desc"), { email: BRAND.email, phone: BRAND.phone })}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#qualifier" className="rounded-md bg-[var(--color-orange)] px-6 py-3 text-center font-semibold text-white hover:bg-[var(--color-ember)]">
              {t("home.final.primary")}
            </a>
            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-white/30 px-6 py-3 text-center font-semibold text-white hover:bg-white/10"
            >
              {t("home.final.secondary")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
