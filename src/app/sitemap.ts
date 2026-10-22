import type { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { siteConfig } from "@/lib/site";
import { blogPosts } from "@/lib/blog-data";
import { KNOWN_CATEGORY_SLUGS } from "@/lib/content";
import { authors as staticAuthors } from "@/lib/authors";

type SitemapEntry = MetadataRoute.Sitemap[number];

/** Yeni yazılar deploy beklemeden sitemap'e düşsün. */
export const revalidate = 3600;


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  // ——— Statik sayfalar ———
  const staticPages: SitemapEntry[] = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/rehber`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/hakkimizda`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/iletisim`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/kariyer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/kvkk`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/gizlilik-sozlesmesi`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/sorumluluk-reddi`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // ——— Kategoriler (topic silo: /[category], /[category]/rehber) ———
  const supabase = createSupabaseServerClient();
  const { data: categoriesFromDb } = await supabase
    .from("categories")
    .select("slug, updated_at");

  const categorySlugs =
    categoriesFromDb?.length ? categoriesFromDb : KNOWN_CATEGORY_SLUGS.map((slug) => ({ slug, updated_at: null as string | null }));

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

  // Rehberi olmayan kategoriler noindex olduğu için sitemap'e girmez.
  const categoriesWithGuides = new Set([
    ...blogPosts.map((p) => p.categorySlug),
    ...(articles ?? []).map((a) => (a as { category: string }).category),
  ]);
  const categoryEntries: SitemapEntry[] = categorySlugs
    .filter((cat) => categoriesWithGuides.has(cat.slug))
    .flatMap((cat) => {
      const lastMod = cat.updated_at ? new Date(cat.updated_at) : new Date();
      const slug = cat.slug;
      return [
        { url: `${base}/${slug}`, lastModified: lastMod, changeFrequency: "weekly" as const, priority: 0.9 },
        { url: `${base}/${slug}/rehber`, lastModified: lastMod, changeFrequency: "weekly" as const, priority: 0.8 },
      ];
    });

  // ——— Yazar profilleri (E-E-A-T) ———
  const { data: authorsFromDb } = await supabase.from("authors").select("slug");
  const authorSlugs = new Set([
    ...staticAuthors.map((a) => a.slug),
    ...((authorsFromDb ?? []) as { slug: string | null }[]).map((a) => a.slug).filter((s): s is string => !!s),
  ]);
  const authorEntries: SitemapEntry[] = [...authorSlugs].map((slug) => ({
    url: `${base}/yazar/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));


  return [...staticPages, ...categoryEntries, ...rehberEntries, ...authorEntries];
}
