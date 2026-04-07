import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, CASE_STUDIES, HOME_PAIN_POINTS, SERVICE_TIERS } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "AI Automation for Indian Businesses | IgniteCore Solutions - Coimbatore",
  description:
    "Save 15 hours/week using AI. IgniteCore Solutions sets up WhatsApp automation, lead tracking, and business workflows for Indian SMBs.",
};

const steps = ["Free Audit", "We Build It", "You Save Time"];

export default function HomePage() {
  return (
    <>
      <section className="hex-bg bg-[var(--color-dark)] text-white">
        <div className="section-shell mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">IgniteCore Solutions</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl italic leading-tight md:text-6xl">
            Save 15 hours/week using AI. We set it up for you.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-200 md:text-lg">
            Practical automation for clinics, coaching institutes, CA firms, real estate teams, and Instagram-first sellers.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={BRAND.calendly}
              target="_blank"
              rel="noreferrer"
              className="min-h-11 rounded-md bg-[var(--color-orange)] px-6 py-3 text-center font-semibold text-white hover:bg-[var(--color-ember)] sm:w-auto"
            >
              Get a free AI audit
            </a>
            <Link href="/learn" className="min-h-11 rounded-md border border-white/30 px-6 py-3 text-center font-medium text-white hover:bg-white/10">
              Explore free AI tutorials
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <h2 className="font-display text-3xl italic md:text-4xl">Why SMB owners call us first</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {HOME_PAIN_POINTS.map((point) => (
              <article key={point.title} className="rounded-xl border border-[var(--color-border)] bg-white p-5">
                <p className="font-mono text-xs text-[var(--color-teal)]">[ pain-point ]</p>
                <h3 className="mt-2 text-xl">{point.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-slate)]">{point.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell bg-white">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <h2 className="font-display text-3xl italic md:text-4xl">How it works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-xl border border-[var(--color-border)] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-slate)]">Step {index + 1}</p>
                <p className="mt-2 text-xl font-semibold text-[var(--color-deep-navy)]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <h2 className="font-display text-3xl italic md:text-4xl">Services snapshot</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {SERVICE_TIERS.map((tier) => (
              <article key={tier.name} className="rounded-xl border border-[var(--color-border)] bg-white p-5">
                <h3 className="text-2xl">{tier.name}</h3>
                <p className="mt-2 text-lg font-semibold text-[var(--color-orange)]">{tier.price}</p>
                <p className="mt-2 text-sm text-[var(--color-slate)]">{tier.bestFor}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell bg-white">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <h2 className="font-display text-3xl italic md:text-4xl">Social proof and case previews</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {CASE_STUDIES.map((item) => (
              <article key={item.title} className="rounded-xl border border-[var(--color-border)] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-slate)]">{item.industry}</p>
                <h3 className="mt-2 text-xl">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-slate)]">{item.result}</p>
                <p className="mt-3 text-sm text-[var(--color-deep-navy)]">"{item.quote}"</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
