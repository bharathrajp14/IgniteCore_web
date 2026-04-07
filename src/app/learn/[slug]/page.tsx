import { redirect } from "next/navigation";

type LearnSlugRedirectProps = {
  params: Promise<{ slug: string }>;
};

export default async function LearningDetailPage({ params }: LearnSlugRedirectProps) {
  const { slug } = await params;
  redirect(`/courses/${slug}`);
}
