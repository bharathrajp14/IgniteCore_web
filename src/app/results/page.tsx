import type { Metadata } from "next";
import Link from "next/link";
import { CASE_STUDIES } from "@/lib/siteContent";
import { translate } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18nServer";

export const metadata: Metadata = {
  title: "Results | IgniteCore Case Studies",
  description:
    "See measurable case study outcomes delivered by IgniteCore across healthcare, education, and real estate workflows.",
};

export default async function ResultsPage() {
  const language = await getServerLanguage();
  const t = (key: string) => translate(language, key);

  return (
    <section className="section-shell">
      <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
        <p className="kicker">{t("results.kicker")}</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">{t("results.title")}</h1>
        <p className="mt-4 max-w-3xl text-[var(--color-slate)]">
          {t("results.intro")}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {CASE_STUDIES.map((study) => (
            <article key={study.title} className="surface-card p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-slate)]">{study.industry}</p>
              <h2 className="mt-2 text-2xl">{study.title}</h2>
              <p className="mt-3 text-sm text-[var(--color-slate)]"><strong className="text-[var(--color-deep-navy)]">{t("results.problem")}</strong> {study.problem}</p>
              <p className="mt-2 text-sm text-[var(--color-slate)]"><strong className="text-[var(--color-deep-navy)]">{t("results.solution")}</strong> {study.solution}</p>
              <p className="mt-2 text-sm text-[var(--color-slate)]"><strong className="text-[var(--color-deep-navy)]">{t("results.outcome")}</strong> {study.outcome}</p>
              <p className="mt-2 text-sm text-[var(--color-deep-navy)]"><strong>{t("results.impact")}</strong> {study.impact}</p>
              <p className="mt-3 rounded-md bg-[var(--color-cream)] px-3 py-2 text-xs font-mono text-[var(--color-slate)]">{study.beforeAfter}</p>
            </article>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/contact" className="rounded-md bg-[var(--color-orange)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--color-ember)]">
            {t("results.cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
