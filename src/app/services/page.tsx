import type { Metadata } from "next";
import Script from "next/script";
import { CalendlyInline } from "@/components/CalendlyInline";
import { FaqAccordion } from "@/components/FaqAccordion";
import { BRAND, FAQS, RETAINER, SERVICE_TIERS } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "AI Services Pricing for Indian SMBs | IgniteCore Coimbatore",
  description:
    "See IgniteCore service tiers, pricing, FAQ, and monthly retainer options for AI automation in Coimbatore and across India.",
};

export default function ServicesPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <section className="section-shell">
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mx-auto w-full max-w-[1100px] space-y-10 px-4 md:px-6">
        <div>
          <h1 className="font-display text-4xl italic md:text-5xl">Services and pricing</h1>
          <p className="mt-4 max-w-3xl text-[var(--color-slate)]">
            Choose the package that matches your current stage. Every plan includes implementation, not vague consulting.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--color-cream)] text-[var(--color-deep-navy)]">
              <tr>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Pricing</th>
                <th className="px-4 py-3">Best for</th>
                <th className="px-4 py-3">Feature highlights</th>
              </tr>
            </thead>
            <tbody>
              {SERVICE_TIERS.map((tier) => (
                <tr key={tier.name} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-4 font-semibold">{tier.name}</td>
                  <td className="px-4 py-4 text-[var(--color-orange)]">{tier.price}</td>
                  <td className="px-4 py-4 text-[var(--color-slate)]">{tier.bestFor}</td>
                  <td className="px-4 py-4 text-[var(--color-slate)]">{tier.features.join(", ")}</td>
                </tr>
              ))}
              <tr className="border-t border-[var(--color-border)]">
                <td className="px-4 py-4 font-semibold">{RETAINER.name}</td>
                <td className="px-4 py-4 text-[var(--color-orange)]">{RETAINER.price}</td>
                <td className="px-4 py-4 text-[var(--color-slate)]">Businesses needing ongoing optimization</td>
                <td className="px-4 py-4 text-[var(--color-slate)]">{RETAINER.features.join(", ")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <article className="rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="text-2xl">What we do not do</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--color-slate)]">
            <li>No vague consulting decks without implementation ownership.</li>
            <li>No hidden platform fees after onboarding.</li>
            <li>No over-engineering for small teams with simple needs.</li>
          </ul>
        </article>

        <div>
          <h2 className="mb-4 text-2xl">Frequently asked questions</h2>
          <FaqAccordion items={FAQS} />
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="text-2xl">Book your free audit</h2>
          <p className="mt-2 text-sm text-[var(--color-slate)]">See where AI can save time in your current business workflow.</p>
          <div className="mt-4">
            <CalendlyInline url={BRAND.calendly} title="Book free AI audit on services page" />
          </div>
        </div>
      </div>
    </section>
  );
}
