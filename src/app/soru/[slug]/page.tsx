import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

/** Eski URL: /soru/[slug] → /[category]/soru/[slug] (topic silo) */
export default async function LegacyQuestionPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("questions")
    .select("category:categories(slug)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  const cat = (data as { category?: { slug: string } | Array<{ slug: string }> })?.category;
  const categorySlug = Array.isArray(cat) ? cat[0]?.slug : cat?.slug;
  if (categorySlug) {
    redirect(`/${categorySlug}/soru/${slug}`);
  }
  redirect("/sorular");
}
