import type { Metadata } from "next";
import Link from "next/link";
import {
  BRAND,
  CASE_STUDIES,
  HOME_PROBLEMS,
  HOW_IT_WORKS,
  PROJECTS,
  SERVICES,
  TRUST_STRIP,
} from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "IgniteCore Solutions | AI Automation and Business Websites in India",
  description:
    "We build AI automation systems, modern websites, and digital tools that help businesses save time and grow faster.",
};

export default function HomePage() {
  return (
    <>
      <section className="hex-bg bg-[var(--color-dark)] text-white">
        <div className="section-shell mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <p className="kicker text-slate-300">IgniteCore Solutions</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight md:text-6xl">
            We build AI automation systems, modern websites, and digital tools that help businesses save time and grow faster.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-200 md:text-lg">
            Built for Indian SMBs that need clear systems, reliable execution, and better conversion outcomes.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="min-h-11 rounded-md bg-[var(--color-orange)] px-6 py-3 text-center font-semibold text-white hover:bg-[var(--color-ember)]"
            >
              Get a Free AI Audit
            </Link>
            <Link
              href="/portfolio"
              className="min-h-11 rounded-md border border-white/30 px-6 py-3 text-center font-medium text-white hover:bg-white/10"
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-white">
        <div className="mx-auto grid w-full max-w-[1100px] gap-2 px-4 py-5 md:grid-cols-4 md:px-6">
          {TRUST_STRIP.map((item) => (
            <p key={item} className="text-center text-xs font-mono uppercase tracking-[0.16em] text-[var(--color-slate)]">
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <p className="kicker">Problems We Solve</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">Where growth usually gets blocked</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {HOME_PROBLEMS.map((problem) => (
              <article key={problem.title} className="surface-card p-6">
                <h3 className="text-2xl">{problem.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-slate)]">{problem.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell bg-white">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <p className="kicker">Services Overview</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">What IgniteCore builds for business teams</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {SERVICES.slice(0, 6).map((service) => (
              <article key={service.name} className="surface-card p-6">
                <h3 className="text-2xl">{service.name}</h3>
                <p className="mt-2 text-sm text-[var(--color-slate)]">{service.description}</p>
                <p className="mt-3 text-sm text-[var(--color-deep-navy)]">
                  <strong>For:</strong> {service.audience}
                </p>
                <p className="mt-1 text-sm text-[var(--color-deep-navy)]">
                  <strong>Outcome:</strong> {service.outcome}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/services" className="rounded-md border border-[var(--color-border)] px-5 py-3 text-sm font-semibold hover:bg-[var(--color-cream)]">
              See all services
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <p className="kicker">How It Works</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">Simple process. Real delivery.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <article key={item.step} className="surface-card p-6">
                <p className="font-mono text-xs tracking-[0.18em] text-[var(--color-teal)]">STEP {item.step}</p>
                <h3 className="mt-2 text-2xl">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-slate)]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell bg-white">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <p className="kicker">Featured Projects</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">Execution you can evaluate quickly</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {PROJECTS.slice(0, 4).map((project) => (
              <article key={project.name} className="surface-card p-6">
                <h3 className="text-2xl">{project.name}</h3>
                <p className="mt-2 text-sm text-[var(--color-slate)]">{project.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="rounded-md bg-[var(--color-cream)] px-2 py-1 font-mono text-xs text-[var(--color-deep-navy)]">
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <p className="kicker">Results</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">Business impact over vanity metrics</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {CASE_STUDIES.map((study) => (
              <article key={study.title} className="surface-card p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-slate)]">{study.industry}</p>
                <h3 className="mt-2 text-2xl">{study.title}</h3>
                <p className="mt-3 text-sm text-[var(--color-slate)]">{study.beforeAfter}</p>
                <p className="mt-3 text-sm font-medium text-[var(--color-deep-navy)]">{study.impact}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell bg-[var(--color-dark)] text-white">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <h2 className="font-display text-3xl md:text-5xl">Tell us your current workflow. We will show what to fix first.</h2>
          <p className="mt-4 max-w-2xl text-sm text-slate-300 md:text-base">
            Start with one practical system that moves your business forward. Reach out at {BRAND.email} or WhatsApp +91 {BRAND.phone}.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="rounded-md bg-[var(--color-orange)] px-6 py-3 text-center font-semibold text-white hover:bg-[var(--color-ember)]">
              Get a Free AI Audit
            </Link>
            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-white/30 px-6 py-3 text-center font-semibold text-white hover:bg-white/10"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
