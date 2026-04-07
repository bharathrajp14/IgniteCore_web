import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { COURSE_BODY, COURSE_MODULES } from "@/lib/siteContent";

type CoursePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const module = COURSE_MODULES.find((item) => item.slug === slug);

  if (!module) {
    return {
      title: "Course not found | IgniteCore Courses",
      description: "The requested course lesson could not be found.",
    };
  }

  return {
    title: `${module.title} | IgniteCore Courses`,
    description: module.summary,
  };
}

export async function generateStaticParams() {
  return COURSE_MODULES.map((item) => ({ slug: item.slug }));
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const module = COURSE_MODULES.find((item) => item.slug === slug);

  if (!module) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: module.title,
    description: module.summary,
    dateModified: module.updatedAt,
    educationalLevel: "Beginner to intermediate SMB operator",
    teaches: module.keyword,
  };

  return (
    <section className="section-shell">
      <Script id={`course-schema-${module.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <article className="mx-auto w-full max-w-[900px] px-4 md:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-teal)]">
          Course lesson · {module.category} · {module.duration}
        </p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">{module.title}</h1>
        <p className="mt-3 text-sm text-[var(--color-slate)]">{module.summary}</p>

        <div className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white p-2">
          <iframe src={module.videoEmbed} title={`${module.title} video`} className="h-[420px] w-full rounded-lg" loading="lazy" />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="surface-card p-6">
            <h2 className="text-2xl">Lesson outcomes</h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--color-deep-navy)]">
              <li>Duration: {module.duration}</li>
              <li>Modules: {module.lessons} key points</li>
              {module.takeaways.map((takeaway) => (
                <li key={takeaway}>• {takeaway}</li>
              ))}
            </ul>
          </article>

          <article className="surface-card p-6">
            <h2 className="text-2xl">Next step</h2>
            <p className="mt-2 text-sm text-[var(--color-slate)]">
              Use the course with the implementation notes below, then book a free AI audit if you want help mapping it to your business.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/courses" className="rounded-md border border-[var(--color-border)] px-4 py-3 text-center text-sm font-semibold hover:bg-[var(--color-cream)]">
                Back to Courses
              </Link>
              <Link href="/contact" className="rounded-md bg-[var(--color-orange)] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[var(--color-ember)]">
                Get a Free AI Audit
              </Link>
            </div>
          </article>
        </div>

        <div className="mt-8 space-y-8">
          {COURSE_BODY.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-3xl">{section.heading}</h2>
              <p className="mt-3 text-base leading-8 text-[var(--color-slate)]">{section.text}</p>
            </section>
          ))}
        </div>

        <p className="mt-8 text-base leading-8 text-[var(--color-slate)]">{COURSE_BODY.conclusion}</p>
      </article>
    </section>
  );
}
