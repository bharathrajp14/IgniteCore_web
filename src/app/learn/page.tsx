import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { LeadMagnetForm } from "@/components/LeadMagnetForm";
import { TUTORIALS } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Learning Hub: Free AI Tutorials for Indian SMB Owners",
  description:
    "Explore practical tutorials on WhatsApp automation, ChatGPT workflows, and SMB-focused AI use cases built for Indian business owners.",
};

export default function LearnPage() {
  return (
    <section className="section-shell">
      <div className="mx-auto w-full max-w-[1100px] space-y-8 px-4 md:px-6">
        <header>
          <h1 className="font-display text-4xl italic md:text-5xl">Learning Hub</h1>
          <p className="mt-4 max-w-3xl text-[var(--color-slate)]">
            Free tutorials for Indian business owners who want practical AI workflows without technical overload.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {TUTORIALS.map((tutorial) => (
            <article key={tutorial.slug} className="rounded-xl border border-[var(--color-border)] bg-white p-5">
              <p className="font-mono text-xs text-[var(--color-teal)]">keyword: {tutorial.keyword}</p>
              <h2 className="mt-2 text-2xl">{tutorial.title}</h2>
              <p className="mt-2 text-sm text-[var(--color-slate)]">{tutorial.summary}</p>
              <Link href={`/learn/${tutorial.slug}`} className="mt-4 inline-block rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-cream)]">
                Open tutorial
              </Link>
            </article>
          ))}
        </div>

        <NewsletterForm />

        <article className="rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="text-2xl">Lead magnet</h2>
          <p className="mt-2 text-sm text-[var(--color-slate)]">
            Download "The Indian Business Owner&apos;s AI Starter Kit" after email verification.
          </p>
          <LeadMagnetForm />
        </article>
      </div>
    </section>
  );
}
