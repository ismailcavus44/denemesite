import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Eski URL: /kategori/[slug] → /[slug] (topic silo hub) */
export default async function LegacyCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/${slug}`);
}
