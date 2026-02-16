import { redirect } from "next/navigation";
import { blogPosts } from "@/lib/blog-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Eski URL: /rehber/[slug] → /[categorySlug]/rehber/[slug] (topic silo) */
export default async function LegacyGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (post?.categorySlug) {
    redirect(`/${post.categorySlug}/rehber/${slug}`);
  }
  redirect("/rehber");
}
