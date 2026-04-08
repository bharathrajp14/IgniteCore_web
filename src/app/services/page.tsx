import type { Metadata } from "next";
import Link from "next/link";
import { SERVICE_FAQS, SERVICES } from "@/lib/siteContent";
import { FaqAccordion } from "@/components/FaqAccordion";
import { translate } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18nServer";

export const metadata: Metadata = {
  title: "Services | IgniteCore AI Automation and Web Solutions",
  description:
    "Explore IgniteCore services including AI automation, business websites, web apps, WhatsApp automation, dashboards, and ongoing support.",
};

export default async function ServicesPage() {
  const language = await getServerLanguage();
  const t = (key: string) => translate(language, key);

  return (
    <section className="section-shell">
      <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
        <p className="kicker">{t("services.kicker")}</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">{t("services.title")}</h1>
        <p className="mt-4 max-w-3xl text-[var(--color-slate)]">
          {t("services.intro")}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {SERVICES.map((service) => (
            <article key={service.name} className="surface-card p-6">
              <h2 className="text-2xl">{service.name}</h2>
              <p className="mt-2 text-sm text-[var(--color-slate)]">{service.description}</p>
              <p className="mt-3 text-sm text-[var(--color-deep-navy)]"><strong>{t("services.whoFor")}</strong> {service.audience}</p>
              <p className="mt-1 text-sm text-[var(--color-deep-navy)]"><strong>{t("services.outcome")}</strong> {service.outcome}</p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-orange)]">{service.startingPrice}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <article className="surface-card p-6">
            <h2 className="text-2xl">{t("services.engagement.title")}</h2>
            <ol className="mt-4 space-y-2 text-sm text-[var(--color-slate)]">
              <li>{t("services.engagement.1")}</li>
              <li>{t("services.engagement.2")}</li>
              <li>{t("services.engagement.3")}</li>
            </ol>
            <div className="mt-6">
              <Link href="/contact" className="rounded-md bg-[var(--color-orange)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--color-ember)]">
                {t("services.auditCta")}
              </Link>
            </div>
          </article>
          <article className="surface-card p-6">
            <h2 className="text-2xl">{t("services.faq.title")}</h2>
            <div className="mt-4">
              <FaqAccordion items={SERVICE_FAQS} />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
