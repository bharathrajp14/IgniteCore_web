import type { Metadata } from "next";
import Link from "next/link";
import { CASE_STUDIES } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Case Studies: AI Automation Results for Indian SMBs",
  description:
    "See before/after business metrics from clinics, coaching institutes, and real estate teams using IgniteCore AI automation workflows.",
};

export default function ResultsPage() {
  return (
    <section className="section-shell">
      <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
        <h1 className="font-display text-4xl italic md:text-5xl">Case studies and outcomes</h1>
        <p className="mt-4 max-w-3xl text-[var(--color-slate)]">
          Real projects with clear before/after outcomes and testimonial snapshots.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {CASE_STUDIES.map((item) => (
            <article key={item.title} className="rounded-xl border border-[var(--color-border)] bg-white p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-slate)]">{item.industry}</p>
              <h2 className="mt-2 text-2xl">{item.title}</h2>
              <div className="mt-4 space-y-3 text-sm text-[var(--color-slate)]">
                <p><strong className="text-[var(--color-deep-navy)]">Problem:</strong> {item.problem}</p>
                <p><strong className="text-[var(--color-deep-navy)]">Solution:</strong> {item.solution}</p>
                <p><strong className="text-[var(--color-deep-navy)]">Result:</strong> {item.result}</p>
              </div>
              <p className="mt-4 text-sm text-[var(--color-deep-navy)]">"{item.quote}"</p>
              <p className="mt-2 text-xs text-[var(--color-slate)]">- {item.client}</p>
              <Link href="/contact" className="mt-4 inline-block rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-semibold hover:bg-[var(--color-cream)]">
                Discuss similar setup
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
