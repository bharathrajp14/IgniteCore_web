import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound, redirect } from "next/navigation";
import { COURSE_BODY, COURSE_MODULES, PUBLIC_COURSES } from "@/lib/siteContent";

const LEGACY_COURSE_SLUGS: Record<string, string> = {
  "whatsapp-automation-playbook-india": "whatsapp-automation-playbook",
  "business-websites-that-convert-in-india": "business-websites-that-convert",
};

type CoursePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSlug = LEGACY_COURSE_SLUGS[slug] ?? slug;
  const courseModule = COURSE_MODULES.find((item) => item.slug === resolvedSlug);

  if (!courseModule) {
    return {
      title: "Course not found | IgniteCore Courses",
      description: "The requested course lesson could not be found.",
    };
  }

  return {
    title: `${courseModule.title} | IgniteCore Courses`,
    description: courseModule.summary,
  };
}

export async function generateStaticParams() {
  return COURSE_MODULES.map((item) => ({ slug: item.slug }));
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const resolvedSlug = LEGACY_COURSE_SLUGS[slug] ?? slug;

  if (resolvedSlug !== slug) {
    redirect(`/courses/${resolvedSlug}`);
  }

  const courseModule = COURSE_MODULES.find((item) => item.slug === resolvedSlug);

  if (!courseModule) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: courseModule.title,
    description: courseModule.summary,
    dateModified: courseModule.updatedAt,
    educationalLevel: "Beginner to intermediate SMB operator",
    teaches: courseModule.keyword,
  };

  return (
    <section className="section-shell">
      <Script id={`course-schema-${courseModule.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <article className="mx-auto w-full max-w-[900px] px-4 md:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-teal)]">
          Course lesson · {courseModule.category} · {courseModule.duration}
        </p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">{courseModule.title}</h1>
        <p className="mt-3 text-sm text-[var(--color-slate)]">{courseModule.summary}</p>

        <div className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white p-2">
          <iframe src={courseModule.videoEmbed} title={`${courseModule.title} video`} className="h-[420px] w-full rounded-lg" loading="lazy" />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="surface-card p-6">
            <h2 className="text-2xl">Lesson outcomes</h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--color-deep-navy)]">
              <li>Duration: {courseModule.duration}</li>
              <li>Modules: {courseModule.lessons} key points</li>
              {courseModule.takeaways.map((takeaway) => (
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
              <a href={courseModule.downloadPath} download className="rounded-md border border-[var(--color-border)] px-4 py-3 text-center text-sm font-semibold hover:bg-[var(--color-cream)]">
                Download lesson notes
              </a>
              <a href={courseModule.publicResource} target="_blank" rel="noreferrer" className="rounded-md border border-[var(--color-border)] px-4 py-3 text-center text-sm font-semibold hover:bg-[var(--color-cream)]">
                Open related public course
              </a>
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

        <div className="mt-10">
          <p className="kicker">Related public courses</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {PUBLIC_COURSES.slice(0, 2).map((course) => (
              <a key={course.title} href={course.url} target="_blank" rel="noreferrer" className="surface-card p-5 transition hover:bg-[var(--color-cream)]">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-teal)]">{course.provider}</p>
                <h3 className="mt-2 text-xl">{course.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-slate)]">{course.focus}</p>
              </a>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
