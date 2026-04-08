import type { Metadata } from "next";
import { ContactLeadForm } from "@/components/ContactLeadForm";
import { PaymentMethodForm } from "@/components/PaymentMethodForm";
import { translate } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18nServer";
import { BRAND } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Contact IgniteCore Solutions | Get a Free AI Audit",
  description:
    "Tell us what you need. IgniteCore replies within 24 hours on working days for AI automation and web solution enquiries.",
};

export default async function ContactPage() {
  const language = await getServerLanguage();
  const t = (key: string) => translate(language, key);

  return (
    <section className="section-shell">
      <div className="mx-auto grid w-full max-w-[1100px] gap-6 px-4 md:grid-cols-[1.2fr_1fr] md:px-6">
        <div>
          <p className="kicker">{t("contact.kicker")}</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">{t("contact.title")}</h1>
          <p className="mt-4 text-[var(--color-slate)]">
            {t("contact.intro")}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a href={`mailto:${BRAND.email}`} className="surface-card p-4 text-sm font-medium hover:bg-white">
              {t("contact.email")} {BRAND.email}
            </a>
            <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noreferrer" className="surface-card p-4 text-sm font-medium hover:bg-white">
              {t("contact.whatsapp")} +91 {BRAND.phone}
            </a>
          </div>

          <div className="mt-6">
            <ContactLeadForm />
          </div>

          <div className="mt-6">
            <details className="rounded-xl border border-[var(--color-border)] bg-white p-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--color-deep-navy)]">
                {t("contact.payment.summary")}
              </summary>
              <p className="mt-2 text-xs text-[var(--color-slate)]">
                {t("contact.payment.optional")}
              </p>
              <div className="mt-4">
                <PaymentMethodForm />
              </div>
            </details>
          </div>
        </div>

        <aside className="surface-card h-fit p-6">
          <h2 className="text-2xl">{t("contact.direct.title")}</h2>
          <p className="mt-2 text-sm text-[var(--color-slate)]">{t("contact.direct.desc")}</p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--color-deep-navy)]">
            <li><strong>{t("contact.company")}</strong> {BRAND.company}</li>
            <li><strong>{t("contact.domain")}</strong> {BRAND.domain}</li>
            <li><strong>{t("contact.email")}</strong> {BRAND.email}</li>
            <li><strong>{t("contact.phone")}</strong> +91 {BRAND.phone}</li>
          </ul>

          <div className="mt-6 space-y-3">
            <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noreferrer" className="block rounded-md bg-[var(--color-teal)] px-4 py-3 text-center text-sm font-semibold text-white">
              {t("contact.startWhatsApp")}
            </a>
            <a href={`mailto:${BRAND.email}`} className="block rounded-md border border-[var(--color-border)] px-4 py-3 text-center text-sm font-semibold hover:bg-[var(--color-cream)]">
              {t("contact.sendEmail")}
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
