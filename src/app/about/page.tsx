import type { Metadata } from "next";
import Script from "next/script";
import { BRAND } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "About IgniteCore Solutions | Practical AI and Web Systems",
  description:
    "Learn the vision behind IgniteCore Solutions and how we help growth-focused businesses adopt practical AI automation and modern digital systems.",
};

export default function AboutPage() {
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
        <p className="kicker">About</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">Building practical systems for real business growth</h1>
        <p className="mt-5 max-w-3xl text-[var(--color-slate)]">
          IgniteCore Solutions exists to close the gap between business ambition and daily execution. Many teams know they need automation and a stronger digital presence, but they do not need complexity. They need clear systems that work.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="surface-card p-6">
            <h2 className="text-2xl">Founder vision</h2>
            <p className="mt-3 text-sm text-[var(--color-slate)]">
              Bharath started IgniteCore to help business owners spend less time on repetitive coordination and more time on strategic growth. The focus is practical delivery, transparent communication, and measurable outcomes.
            </p>
          </article>
          <article className="surface-card p-6">
            <h2 className="text-2xl">Why we exist</h2>
            <p className="mt-3 text-sm text-[var(--color-slate)]">{BRAND.mission}</p>
            <p className="mt-3 text-sm text-[var(--color-slate)]">{BRAND.vision}</p>
          </article>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="surface-card p-5">
            <h3 className="text-xl">Clarity first</h3>
            <p className="mt-2 text-sm text-[var(--color-slate)]">No jargon-heavy consulting. Every project is explained in plain business language.</p>
          </article>
          <article className="surface-card p-5">
            <h3 className="text-xl">Execution over promises</h3>
            <p className="mt-2 text-sm text-[var(--color-slate)]">We prioritize deliverables, timelines, and measurable change over slides and buzzwords.</p>
          </article>
          <article className="surface-card p-5">
            <h3 className="text-xl">Trust-driven partnerships</h3>
            <p className="mt-2 text-sm text-[var(--color-slate)]">Transparent scope, practical pricing, and long-term support for growing teams.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
