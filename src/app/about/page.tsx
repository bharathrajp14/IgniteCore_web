import type { Metadata } from "next";
import Script from "next/script";
import { translate } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18nServer";
import { BRAND } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "About IgniteCore Solutions | Practical AI and Web Systems",
  description:
    "Learn the vision behind IgniteCore Solutions and how we help growth-focused businesses adopt practical AI automation and modern digital systems.",
};

export default async function AboutPage() {
  const language = await getServerLanguage();
  const t = (key: string) => translate(language, key);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: BRAND.founder,
    jobTitle: "Founder, IgniteCore Solutions",
    worksFor: BRAND.company,
    sameAs: [BRAND.github, BRAND.linkedin],
  };

  return (
    <section className="section-shell">
      <Script id="person-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
        <p className="kicker">{t("about.kicker")}</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">{t("about.title")}</h1>
        <p className="mt-5 max-w-3xl text-[var(--color-slate)]">
          {t("about.intro")}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="surface-card p-6">
            <h2 className="text-2xl">{t("about.founder.title")}</h2>
            <p className="mt-3 text-sm text-[var(--color-slate)]">
              {t("about.founder.body")}
            </p>
          </article>
          <article className="surface-card p-6">
            <h2 className="text-2xl">{t("about.why.title")}</h2>
            <p className="mt-3 text-sm text-[var(--color-slate)]">{BRAND.mission}</p>
            <p className="mt-3 text-sm text-[var(--color-slate)]">{BRAND.vision}</p>
          </article>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="surface-card p-5">
            <h3 className="text-xl">{t("about.clarity.title")}</h3>
            <p className="mt-2 text-sm text-[var(--color-slate)]">{t("about.clarity.body")}</p>
          </article>
          <article className="surface-card p-5">
            <h3 className="text-xl">{t("about.execution.title")}</h3>
            <p className="mt-2 text-sm text-[var(--color-slate)]">{t("about.execution.body")}</p>
          </article>
          <article className="surface-card p-5">
            <h3 className="text-xl">{t("about.trust.title")}</h3>
            <p className="mt-2 text-sm text-[var(--color-slate)]">{t("about.trust.body")}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
