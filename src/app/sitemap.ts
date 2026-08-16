import type { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { siteConfig } from "@/lib/site";
import { blogPosts } from "@/lib/blog-data";
import { KNOWN_CATEGORY_SLUGS } from "@/lib/content";

type SitemapEntry = MetadataRoute.Sitemap[number];

function latestDate(...values: (string | null | undefined)[]): Date {
  const times = values
    .filter((v): v is string => typeof v === "string" && v.length > 0)
    .map((v) => new Date(v).getTime())
    .filter((t) => Number.isFinite(t));
  return times.length ? new Date(Math.max(...times)) : new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  // ——— Statik sayfalar ———
  const staticPages: SitemapEntry[] = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/sorular`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/soru-sor`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/rehber`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/hakkimizda`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/iletisim`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/kariyer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/kvkk`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/gizlilik-sozlesmesi`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/sorumluluk-reddi`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // ——— Kategoriler (topic silo: /[category], /[category]/rehber, /[category]/sorular) ———
  const supabase = createSupabaseServerClient();
  const { data: categoriesFromDb } = await supabase
    .from("categories")
    .select("slug, updated_at");

  const categorySlugs =
    categoriesFromDb?.length ? categoriesFromDb : KNOWN_CATEGORY_SLUGS.map((slug) => ({ slug, updated_at: null as string | null }));

  const categoryEntries: SitemapEntry[] = categorySlugs.flatMap((cat) => {
    const lastMod = cat.updated_at ? new Date(cat.updated_at) : new Date();
    const slug = cat.slug;
    return [
      { url: `${base}/${slug}`, lastModified: lastMod, changeFrequency: "weekly" as const, priority: 0.9 },
      { url: `${base}/${slug}/rehber`, lastModified: lastMod, changeFrequency: "weekly" as const, priority: 0.8 },
      { url: `${base}/${slug}/sorular`, lastModified: lastMod, changeFrequency: "weekly" as const, priority: 0.8 },
    ];
  });

  // ——— Rehber: statik blog + DB makaleleri /[category]/rehber/[slug] ———
  const rehberStatic: SitemapEntry[] = blogPosts.map((post) => ({
    url: `${base}/${post.categorySlug}/rehber/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, category, updated_at")
    .eq("status", "published")
    .not("category", "is", null);
  const rehberDb: SitemapEntry[] = (articles ?? []).map((a) => ({
    url: `${base}/${(a as { category: string }).category}/rehber/${(a as { slug: string }).slug}`,
    lastModified: (a as { updated_at?: string }).updated_at ? new Date((a as { updated_at: string }).updated_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const rehberEntries = [...rehberStatic, ...rehberDb];

  // ——— Sorular: /[category]/soru/[slug] (canonical) ———
  const { data: questions } = await supabase
    .from("questions")
    .select(
      "slug, published_at, seo_updated_at, category:categories(slug), answer:answers(updated_at)"
    )
    .eq("status", "published");

  const questionEntries: SitemapEntry[] = (questions ?? [])
    .filter((q) => {
      const cat = (q as { category?: { slug: string } | { slug: string }[] }).category;
      const slug = Array.isArray(cat) ? cat[0]?.slug : cat?.slug;
      return !!slug;
    })
    .map((q) => {
      const row = q as {
        slug: string;
        published_at: string | null;
        seo_updated_at?: string | null;
        category: { slug: string } | { slug: string }[];
        answer?: { updated_at?: string } | { updated_at?: string }[] | null;
      };
      const cat = row.category;
      const categorySlug = Array.isArray(cat) ? cat[0]?.slug : cat?.slug;
      const answer = Array.isArray(row.answer) ? row.answer[0] : row.answer;
      return {
        url: `${base}/${categorySlug}/soru/${row.slug}`,
        lastModified: latestDate(
          answer?.updated_at,
          row.seo_updated_at,
          row.published_at
        ),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    });

  return [...staticPages, ...categoryEntries, ...rehberEntries, ...questionEntries];
}
