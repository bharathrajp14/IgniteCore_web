import type { Metadata } from "next";
import Link from "next/link";
import { LeadMagnetForm } from "@/components/LeadMagnetForm";
import { NewsletterForm } from "@/components/NewsletterForm";
import { LEARNING_POSTS } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Learning Hub | AI Tips and Automation Guides for Businesses",
  description:
    "Read practical guides on AI automation, WhatsApp workflows, and business website strategy built for Indian SMB teams.",
};

export default function LearnPage() {
  return (
    <section className="section-shell">
      <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
        <p className="kicker">Learning Hub</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">Practical learning for business teams using AI</h1>
        <p className="mt-4 max-w-3xl text-[var(--color-slate)]">
          Clear, implementation-focused content for owners and operators who want better systems without technical overload.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {LEARNING_POSTS.map((post) => (
            <article key={post.slug} className="surface-card p-6">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-teal)]">{post.category}</p>
              <h2 className="mt-2 text-2xl">{post.title}</h2>
              <p className="mt-2 text-sm text-[var(--color-slate)]">{post.summary}</p>
              <Link href={`/learn/${post.slug}`} className="mt-4 inline-block rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-semibold hover:bg-[var(--color-cream)]">
                Read guide
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <NewsletterForm />
          <article className="surface-card p-6">
            <h2 className="text-2xl">Download proposal starter kit</h2>
            <p className="mt-2 text-sm text-[var(--color-slate)]">
              Get the IgniteCore starter PDF to understand implementation scope, typical pricing ranges, and rollout approach.
            </p>
            <LeadMagnetForm />
          </article>
        </div>
      </div>
    </section>
  );
}
