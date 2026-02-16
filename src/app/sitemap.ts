import type { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createSupabaseServerClient();
  const { data: questions } = await supabase
    .from("questions")
    .select("slug,created_at")
    .eq("status", "published");

  const { data: categories } = await supabase
    .from("categories")
    .select("slug");

  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/sorular`, lastModified: new Date() },
    { url: `${base}/soru-sor`, lastModified: new Date() },
    { url: `${base}/sorumluluk-reddi`, lastModified: new Date() },
    { url: `${base}/kvkk`, lastModified: new Date() },
    { url: `${base}/gizlilik-sozlesmesi`, lastModified: new Date() },
  ];

  const questionRoutes =
    questions?.map((question) => ({
      url: `${base}/soru/${question.slug}`,
      lastModified: question.created_at
        ? new Date(question.created_at)
        : new Date(),
    })) ?? [];

  const categoryRoutes =
    categories?.map((category) => ({
      url: `${base}/kategori/${category.slug}`,
      lastModified: new Date(),
    })) ?? [];

  return [...staticRoutes, ...questionRoutes, ...categoryRoutes];
}
