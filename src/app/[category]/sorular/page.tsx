import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getKnownCategoryName, ensureCategoryExists, getRelatedQuestionsPaginated } from "@/lib/content";
import { BreadcrumbBlock } from "@/components/breadcrumb";
import { QuestionCard } from "@/components/question-card";
import { siteConfig } from "@/lib/site";

const PAGE_SIZE = 9;

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
};

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  const fallbackName = getKnownCategoryName(slug);
  const name = category?.name ?? fallbackName;
  if (!name) return { title: "Kategori bulunamadı" };
  const title = `${name} Soruları`;
  const description = `${name} kategorisinde editör incelemesinden geçmiş, cevaplanmış hukuki sorular. Sade ve anlaşılır yanıtlar.`;
  const url = `${siteConfig.url}/${slug}/sorular`;
  return {
    title,
    description: description.slice(0, 160),
    openGraph: { title: `YasalHaklarınız | ${title}`, description, url },
    alternates: { canonical: url },
  };
}

export default async function CategorySorularListPage({ params, searchParams }: PageProps) {
  const { category: categorySlug } = await params;
  const { page: pageParam } = await searchParams;
  await ensureCategoryExists(categorySlug);
  const category = await getCategoryBySlug(categorySlug);
  const fallbackName = getKnownCategoryName(categorySlug);
  const categoryName = category?.name ?? fallbackName;
  if (!categoryName) notFound();

  const page = Math.max(1, parseInt(String(pageParam), 10) || 1);
  const { questions, total } = await getRelatedQuestionsPaginated(categorySlug, page, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const toShow =
    currentPage !== page
      ? (await getRelatedQuestionsPaginated(categorySlug, currentPage, PAGE_SIZE)).questions
      : questions;

  const breadcrumbItems = [
    { label: "Anasayfa", href: "/" },
    { label: categoryName, href: `/${categorySlug}` },
    { label: "Sorular" },
  ];

  const basePath = `/${categorySlug}/sorular`;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-10">
      <header className="space-y-2">
        <BreadcrumbBlock items={breadcrumbItems} />
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {categoryName} Soruları
        </h1>
        <p className="text-sm text-slate-600">
          <Link href={`/${categorySlug}`} className="text-primary hover:underline">
            ← {categoryName} sayfasına dön
          </Link>
        </p>
      </header>

      {toShow.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {toShow.map((q) => (
              <QuestionCard
                key={q.id}
                title={q.title}
                slug={q.slug}
                category={q.category}
                createdAt={q.created_at}
                summaryText={(q as { ai_card_summary?: string | null }).ai_card_summary ?? null}
                categorySlug={categorySlug}
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
          Bu kategoride henüz yayınlanmış soru yok.
        </div>
      )}
    </div>
  );
}
