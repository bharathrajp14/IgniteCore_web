import type { Metadata } from "next";
import Link from "next/link";
import { LeadMagnetForm } from "@/components/LeadMagnetForm";
import { NewsletterForm } from "@/components/NewsletterForm";
import { COURSE_BODY, COURSE_HIGHLIGHTS, COURSE_MODULES, COURSE_OVERVIEW, PUBLIC_COURSES } from "@/lib/siteContent";
import { translate } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18nServer";

export const metadata: Metadata = {
  title: "Courses | IgniteCore Video Course for AI Automation and Web Systems",
  description:
    "Watch IgniteCore video lessons on AI automation, WhatsApp workflows, conversion websites, and lead pipelines for growth-focused teams.",
};

export default async function CoursesPage() {
  const language = await getServerLanguage();
  const t = (key: string) => translate(language, key);

  return (
    <section className="section-shell">
      <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
        <p className="kicker">{t("courses.kicker")}</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">{COURSE_OVERVIEW.title}</h1>
        <p className="mt-4 max-w-3xl text-[var(--color-slate)]">{COURSE_OVERVIEW.description}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {COURSE_HIGHLIGHTS.map((item) => (
            <article key={item} className="surface-card p-4 text-sm text-[var(--color-deep-navy)]">
              {item}
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <article className="surface-card p-6">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-teal)]">{COURSE_OVERVIEW.duration}</p>
            <h2 className="mt-2 text-2xl">{COURSE_OVERVIEW.subtitle}</h2>
            <p className="mt-3 text-sm text-[var(--color-slate)]">{COURSE_OVERVIEW.format}</p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {COURSE_MODULES.map((module) => (
                <Link key={module.slug} href={`/courses/${module.slug}`} className="rounded-xl border border-[var(--color-border)] p-4 transition hover:bg-[var(--color-cream)]">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-teal)]">
                    {module.category} · {module.duration}
                  </p>
                  <h3 className="mt-2 text-xl">{module.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-slate)]">{module.summary}</p>
                </Link>
              ))}
            </div>
          </article>

          <div className="space-y-4">
            <article className="surface-card p-6">
              <h2 className="text-2xl">{t("courses.learn.title")}</h2>
              <p className="mt-2 text-sm text-[var(--color-slate)]">{t("courses.learn.desc")}</p>
              <ul className="mt-4 space-y-2 text-sm text-[var(--color-deep-navy)]">
                {COURSE_BODY.sections.map((section) => (
                  <li key={section.heading}>{section.heading}</li>
                ))}
              </ul>
            </article>

            <article className="surface-card p-6">
              <h2 className="text-2xl">{t("courses.resources.title")}</h2>
              <p className="mt-2 text-sm text-[var(--color-slate)]">{t("courses.resources.desc")}</p>
              <div className="mt-4 flex flex-col gap-3">
                <Link href="/contact" className="rounded-md bg-[var(--color-orange)] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[var(--color-ember)]">
                  {t("courses.resources.auditCta")}
                </Link>
                <Link href="/portfolio" className="rounded-md border border-[var(--color-border)] px-4 py-3 text-center text-sm font-semibold hover:bg-[var(--color-cream)]">
                  {t("courses.resources.projectsCta")}
                </Link>
              </div>
            </article>
          </div>
        </div>

        <div className="mt-10">
          <p className="kicker">{t("courses.public.kicker")}</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">{t("courses.public.title")}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {PUBLIC_COURSES.map((course) => (
              <a key={course.title} href={course.url} target="_blank" rel="noreferrer" className="surface-card p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-teal)]">
                  {course.provider} · {course.format}
                </p>
                <h3 className="mt-2 text-2xl">{course.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-slate)]">{course.focus}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <NewsletterForm />
          <article className="surface-card p-6">
            <h2 className="text-2xl">{t("courses.starter.title")}</h2>
            <p className="mt-2 text-sm text-[var(--color-slate)]">
              {t("courses.starter.desc")}
            </p>
            <LeadMagnetForm />
          </article>
        </div>
      </div>
    </section>
  );
}
