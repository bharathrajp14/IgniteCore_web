import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TUTORIALS, TUTORIAL_BODY } from "@/lib/siteContent";

type TutorialPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: TutorialPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = TUTORIALS.find((item) => item.slug === slug);

  if (!tutorial) {
    return {
      title: "Tutorial not found | IgniteCore Learning Hub",
      description: "The requested tutorial was not found.",
    };
  }

  return {
    title: `${tutorial.title} | IgniteCore Learning Hub`,
    description: tutorial.summary,
  };
}

export async function generateStaticParams() {
  return TUTORIALS.map((item) => ({ slug: item.slug }));
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { slug } = await params;
  const tutorial = TUTORIALS.find((item) => item.slug === slug);

  if (!tutorial) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: tutorial.title,
    dateModified: tutorial.updatedAt,
    articleSection: "Learning Hub",
    keywords: [tutorial.keyword],
  };

  return (
    <section className="section-shell">
      <Script id={`article-schema-${tutorial.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <article className="mx-auto w-full max-w-[900px] px-4 md:px-6">
        <p className="font-mono text-xs text-[var(--color-teal)]">target keyword: {tutorial.keyword}</p>
        <h1 className="mt-3 font-display text-4xl italic md:text-5xl">{tutorial.title}</h1>
        <p className="mt-3 text-sm text-[var(--color-slate)]">Last updated: {tutorial.updatedAt}</p>

        <div className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white p-2">
          <iframe src={tutorial.loomEmbed} title={`${tutorial.title} video`} className="h-[420px] w-full rounded-lg" loading="lazy" />
        </div>

        <p className="mt-8 text-base leading-8 text-[var(--color-slate)]">{TUTORIAL_BODY.intro}</p>

        <div className="mt-8 space-y-8">
          {TUTORIAL_BODY.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-3xl">{section.heading}</h2>
              <p className="mt-3 text-base leading-8 text-[var(--color-slate)]">{section.text}</p>
              <p className="mt-3 text-base leading-8 text-[var(--color-slate)]">{section.text}</p>
            </section>
          ))}
        </div>

        <p className="mt-8 text-base leading-8 text-[var(--color-slate)]">{TUTORIAL_BODY.conclusion}</p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/services" className="rounded-md bg-[var(--color-orange)] px-5 py-3 text-center font-semibold text-white hover:bg-[var(--color-ember)]">
            View services
          </Link>
          <Link href="/contact" className="rounded-md border border-[var(--color-border)] px-5 py-3 text-center font-semibold hover:bg-white">
            Contact IgniteCore
          </Link>
        </div>
      </article>
    </section>
  );
}
