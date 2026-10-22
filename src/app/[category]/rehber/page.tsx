import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getKnownCategoryName, getRelatedGuidesPaginated, getCategoryGuideCount } from "@/lib/content";
import { BreadcrumbBlock } from "@/components/breadcrumb";
import { BlogTeaserCard } from "@/components/blog-teaser-card";
import { siteConfig, defaultOgImage, toMetaDescription } from "@/lib/site";
import { CollectionPageSchema } from "@/components/schemas/CollectionPageSchema";

const PAGE_SIZE = 9;

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
};

export const revalidate = 3600;

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const { page: pageParam } = await searchParams;
  const category = await getCategoryBySlug(slug);
  const fallbackName = getKnownCategoryName(slug);
  const name = category?.name ?? fallbackName;
  if (!name) return { title: "Kategori bulunamadı" };
  const page = Math.max(1, parseInt(String(pageParam), 10) || 1);
  const title = `${name} Makaleleri ve Rehberleri${page > 1 ? ` (Sayfa ${page})` : ""}`;
  const description = toMetaDescription(
    `${name} alanındaki tüm rehber yazılarımız tek sayfada. Güncel mevzuat ve Yargıtay kararlarıyla hazırlanmış, sade dille anlatılan ${name.toLocaleLowerCase("tr")} makaleleri.`
  );
  const basePath = `${siteConfig.url}/${slug}/rehber`;
  const url = page > 1 ? `${basePath}?page=${page}` : basePath;
  const ogTitle = `${title} | ${siteConfig.name}`;
  const hasGuides = (await getCategoryGuideCount(slug)) > 0;
  return {
    title,
    description,
    openGraph: { title: ogTitle, description, url, images: [defaultOgImage] },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: [defaultOgImage.url] },
    alternates: { canonical: url },
    ...(!hasGuides && { robots: { index: false, follow: true } }),
  };
}

export default async function CategoryRehberListPage({ params, searchParams }: PageProps) {
  const { category: categorySlug } = await params;
  const { page: pageParam } = await searchParams;
  const category = await getCategoryBySlug(categorySlug);
  const fallbackName = getKnownCategoryName(categorySlug);
  const categoryName = category?.name ?? fallbackName;
  if (!categoryName) notFound();

  const page = Math.max(1, parseInt(String(pageParam), 10) || 1);
  const { guides, total } = await getRelatedGuidesPaginated(categorySlug, page, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const toShow =
    currentPage !== page
      ? (await getRelatedGuidesPaginated(categorySlug, currentPage, PAGE_SIZE)).guides
      : guides;

  const breadcrumbItems = [
    { label: "Anasayfa", href: "/" },
    { label: categoryName, href: `/${categorySlug}` },
    { label: "Rehberler" },
  ];

  const basePath = `/${categorySlug}/rehber`;

  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const listUrl = `${baseUrl}${basePath}`;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-10">
      <CollectionPageSchema
        name={`${categoryName} Rehberleri`}
        description={`${categoryName} alanındaki rehber yazıları.`}
        url={currentPage > 1 ? `${listUrl}?page=${currentPage}` : listUrl}
        items={toShow.map((p) => ({ name: p.title, url: `${listUrl}/${p.slug}` }))}
        breadcrumb={[
          { name: "Anasayfa", url: baseUrl },
          { name: categoryName, url: `${baseUrl}/${categorySlug}` },
          { name: "Rehberler", url: listUrl },
        ]}
      />
      <header className="space-y-2">
        <BreadcrumbBlock items={breadcrumbItems} />
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {categoryName} Rehberleri
        </h1>
        <p className="text-sm text-slate-600">
          <Link href={`/${categorySlug}`} className="text-primary hover:underline">
            ← {categoryName} sayfasına dön
          </Link>
        </p>
      </header>

      {toShow.length > 0 ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {toShow.map((post) => (
              <BlogTeaserCard
                key={post.slug}
                post={post}
                basePath={`/${categorySlug}/rehber`}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <nav
              className="flex flex-wrap items-center justify-center gap-2 pt-4"
              aria-label="Sayfa navigasyonu"
            >
              {currentPage > 1 ? (
                <Link
                  href={currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`}
                  className="rounded-lg border border-primary bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Önceki
                </Link>
              ) : (
                <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-400">
                  Önceki
                </span>
              )}
              <span className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
                  p === currentPage ? (
                    <span
                      key={p}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-medium text-white"
                      aria-current="page"
                    >
                      {p}
                    </span>
                  ) : (
                    <Link
                      key={p}
                      href={p === 1 ? basePath : `${basePath}?page=${p}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {p}
                    </Link>
                  )
                )}
              </span>
              {currentPage < totalPages ? (
                <Link
                  href={`${basePath}?page=${currentPage + 1}`}
                  className="rounded-lg border border-primary bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Sonraki
                </Link>
              ) : (
                <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-400">
                  Sonraki
                </span>
              )}
            </nav>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
          Bu kategoride henüz rehber yok.
        </div>
      )}
    </div>
  );
}
