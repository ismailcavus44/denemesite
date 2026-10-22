import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import {
  getCategoryBySlug,
  getKnownCategoryName,
  KNOWN_CATEGORY_SLUGS,
  getCategoryGuideCount,
} from "@/lib/content";
import type { CategoryRow } from "@/lib/content";
import { siteConfig, defaultOgImage, toMetaDescription } from "@/lib/site";
import { CategoryHubSchemas } from "@/components/schemas/CategoryHubSchemas";
import { CategoryHero } from "@/components/category/CategoryHero";
import { CategoryPillar } from "@/components/category/CategoryPillar";
import { CategoryPillarDemo } from "@/components/category/CategoryPillarDemo";
import { CategoryNavCards } from "@/components/category/CategoryNavCards";
import { CategorySidebar } from "@/components/category/CategorySidebar";
import { getStaticPillarMd } from "@/lib/category-pillars";

type PageProps = {
  params: Promise<{ category: string }>;
};

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  let category = await getCategoryBySlug(slug);
  const fallbackName = getKnownCategoryName(slug);
  if (!category && fallbackName) {
    category = { id: "", name: fallbackName, slug, intro: null, pillar_md: null, updated_at: null };
  }
  if (!category) {
    return { title: "Kategori bulunamadı" };
  }
  const title = category.meta_title?.trim() || `${category.name} Rehberi: Haklarınız ve Davalar`;
  const description = toMetaDescription(
    category.meta_description?.trim() ||
      `${category.name} hakkında avukatlar tarafından hazırlanan güncel rehber: haklarınız, dava süreçleri, süreler, masraflar ve sık sorulan sorular.`
  );
  const url = `${siteConfig.url}/${slug}`;
  const ogTitle = `${title} | ${siteConfig.name}`;
  const hasGuides = (await getCategoryGuideCount(slug)) > 0;
  return {
    title,
    description,
    openGraph: { title: ogTitle, description, url, images: [defaultOgImage] },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: [defaultOgImage.url] },
    alternates: { canonical: url },
    // Henüz rehberi olmayan kategoriler ince içerik sayılmasın diye indekslenmez.
    ...(!hasGuides && { robots: { index: false, follow: true } }),
  };
}

export async function generateStaticParams() {
  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase.from("categories").select("slug");
    if (data?.length) return data.map((c) => ({ category: c.slug }));
  } catch {
    // env veya DB yoksa bilinen slug'larla devam et
  }
  return KNOWN_CATEGORY_SLUGS.map((slug) => ({ category: slug }));
}

export default async function CategoryPillarPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  let category: CategoryRow | null = await getCategoryBySlug(categorySlug);
  const fallbackName = getKnownCategoryName(categorySlug);
  if (!category && fallbackName) {
    category = { id: "", name: fallbackName, slug: categorySlug, intro: null, pillar_md: null, updated_at: null };
  }
  if (!category) {
    notFound();
  }


  const breadcrumbItems = [
    { label: "Anasayfa", href: "/" },
    { label: category.name },
  ];

  const canonicalUrl = `${siteConfig.url.replace(/\/$/, "")}/${categorySlug}`;

  return (
    <>
      <CategoryHubSchemas
        categoryName={category.name}
        categoryUrl={canonicalUrl}
        description={category.intro}
      />
      <div className="min-h-screen bg-white px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="min-w-0 space-y-8">
              <CategoryHero
                categorySlug={categorySlug}
                categoryName={category.name}
                intro={category.intro ?? null}
                breadcrumbItems={breadcrumbItems}
              />

              <section>
                <h2 className="sr-only">Yönlendirme</h2>
                <CategoryNavCards categorySlug={categorySlug} />
              </section>

              <section>
                {(() => {
                  const pillarMd = getStaticPillarMd(categorySlug) ?? category.pillar_md ?? null;
                  return pillarMd ? (
                    <CategoryPillar pillarMd={pillarMd} />
                  ) : (
                    <CategoryPillarDemo categoryName={category.name} />
                  );
                })()}
              </section>
            </div>

            <div className="lg:pt-0">
              <CategorySidebar categoryName={category.name} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
