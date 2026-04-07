import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { LEARNING_BODY, LEARNING_POSTS } from "@/lib/siteContent";

type LearningPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: LearningPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = LEARNING_POSTS.find((item) => item.slug === slug);

  if (!post) {
    return {
      title: "Guide not found | IgniteCore Learning Hub",
      description: "The requested guide could not be found.",
    };
  }

  return {
    title: `${post.title} | IgniteCore Learning Hub`,
    description: post.summary,
  };
}

export async function generateStaticParams() {
  return LEARNING_POSTS.map((item) => ({ slug: item.slug }));
}

export default async function LearningDetailPage({ params }: LearningPageProps) {
  const { slug } = await params;
  const post = LEARNING_POSTS.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    dateModified: post.updatedAt,
    articleSection: "Learning Hub",
    keywords: [post.keyword],
  };

  return (
    <section className="section-shell">
      <Script id={`article-schema-${post.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <article className="mx-auto w-full max-w-[900px] px-4 md:px-6">
        <p className="font-mono text-xs text-[var(--color-teal)]">keyword: {post.keyword}</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">{post.title}</h1>
        <p className="mt-3 text-sm text-[var(--color-slate)]">Last updated: {post.updatedAt}</p>

        <div className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white p-2">
          <iframe src={post.loomEmbed} title={`${post.title} video`} className="h-[420px] w-full rounded-lg" loading="lazy" />
        </div>

        <p className="mt-8 text-base leading-8 text-[var(--color-slate)]">{LEARNING_BODY.intro}</p>

        <div className="mt-8 space-y-8">
          {LEARNING_BODY.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-3xl">{section.heading}</h2>
              <p className="mt-3 text-base leading-8 text-[var(--color-slate)]">{section.text}</p>
            </section>
          ))}
        </div>

        <p className="mt-8 text-base leading-8 text-[var(--color-slate)]">{LEARNING_BODY.conclusion}</p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/services" className="rounded-md bg-[var(--color-orange)] px-5 py-3 text-center font-semibold text-white hover:bg-[var(--color-ember)]">
            Explore services
          </Link>
          <Link href="/contact" className="rounded-md border border-[var(--color-border)] px-5 py-3 text-center font-semibold hover:bg-white">
            Get a Free AI Audit
          </Link>
        </div>
      </article>
    </section>
  );
}
