import type { Metadata } from "next";
import Script from "next/script";
import { BRAND } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "About IgniteCore Solutions | Bharath from Coimbatore",
  description:
    "Meet Bharath, founder of IgniteCore Solutions, helping Indian SMB owners adopt practical AI automation with clear outcomes.",
};

export default function AboutPage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: BRAND.founder,
    jobTitle: "Founder, IgniteCore Solutions",
    alumniOf: "PSNA College",
    sameAs: [BRAND.github, BRAND.linkedin],
  };

  return (
    <section className="section-shell">
      <Script id="person-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
        <h1 className="font-display text-4xl italic md:text-5xl">About IgniteCore Solutions</h1>
        <p className="mt-6 max-w-3xl text-[var(--color-slate)]">
          I am Bharath, a final-year CS student from PSNA College, Coimbatore. I started IgniteCore to solve one practical
          problem: Indian SMB owners spend too much time in manual operations and too little time in growth decisions.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="text-2xl">Founder story</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-slate)]">
              During projects and internships, I noticed local businesses were using WhatsApp and spreadsheets for mission-critical
              sales and support work. Most were not lacking ambition, they were lacking simple systems. IgniteCore was built to
              bridge that gap with affordable automation and clear implementation support.
            </p>
          </article>

          <article className="rounded-xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="text-2xl">Mission</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-slate)]">{BRAND.tagline}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-slate)]">{BRAND.mission}</p>
          </article>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { title: "Simplicity", body: "Plain-language workflows, not technical confusion." },
            { title: "Results", body: "Every automation maps to a measurable business metric." },
            { title: "Trust", body: "Transparent pricing, clear scope, and no hidden surprises." },
          ].map((value) => (
            <article key={value.title} className="rounded-xl border border-[var(--color-border)] bg-white p-5">
              <h3 className="text-xl">{value.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-slate)]">{value.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="text-2xl">Profiles and project highlights</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a href={BRAND.github} target="_blank" rel="noreferrer" className="rounded-md border border-[var(--color-border)] px-4 py-3 text-sm font-medium hover:bg-[var(--color-cream)]">
              View GitHub profile
            </a>
            <a href={BRAND.linkedin} target="_blank" rel="noreferrer" className="rounded-md border border-[var(--color-border)] px-4 py-3 text-sm font-medium hover:bg-[var(--color-cream)]">
              View LinkedIn profile
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
