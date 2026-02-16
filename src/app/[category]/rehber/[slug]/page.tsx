import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog-data";
import { getAuthorBySlug } from "@/lib/authors";
import { getCategoryBySlug, getKnownCategoryName, getRelatedQuestions, getRelatedGuides } from "@/lib/content";
import { BreadcrumbBlock } from "@/components/breadcrumb";
import { CategoryGuidesSidebar } from "@/components/question-detail/CategoryGuidesSidebar";
import { StickyCTA } from "@/components/question-detail/StickyCTA";
import { GuideToc } from "@/components/guide-toc";
import { QuestionCard } from "@/components/question-card";
import { siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  const fallbackName = getKnownCategoryName(categorySlug);
  const post = blogPosts.find((p) => p.slug === slug);
  const categoryOk = category ?? fallbackName;

  if (!post || post.categorySlug !== categorySlug || !categoryOk) {
    return { title: "Rehber bulunamadı" };
  }

  const title = `${post.title} | ${siteConfig.name}`;
  const description =
    post.summary.length > 160 ? `${post.summary.slice(0, 157)}...` : post.summary;
  const url = `${siteConfig.url}/${categorySlug}/rehber/${slug}`;

  return {
    title,
    description,
    openGraph: { title, description, url },
    alternates: { canonical: url },
  };
}

export default async function CategoryGuidePage({ params }: PageProps) {
  const { category: categorySlug, slug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  const fallbackName = getKnownCategoryName(categorySlug);
  const post = blogPosts.find((p) => p.slug === slug);
  const categoryName = category?.name ?? fallbackName;

  if (!post || post.categorySlug !== categorySlug || !categoryName) {
    notFound();
  }

  const [relatedQuestions, categoryGuides] = await Promise.all([
    getRelatedQuestions(categorySlug, 5),
    getRelatedGuides(categorySlug, 5, slug),
  ]);
  const author = post.authorSlug ? getAuthorBySlug(post.authorSlug) : undefined;

  const tocItems =
    post.slug === "kira-sorunlarinda-ilk-adimlar"
      ? [
          {
            id: "kira-ilk-adimlar",
            label: "Kira sorunlarında ilk adımlar",
            level: "h2" as const,
          },
          {
            id: "kira-belgeler-kayitlar",
            label: "Belgeleri ve kayıtları hazırlama",
            level: "h3" as const,
          },
          {
            id: "kira-profesyonel-destek",
            label: "Profesyonel destek alma",
            level: "h3" as const,
          },
        ]
      : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
  };

  return (
    <>
      <div className="mx-auto max-w-6xl space-y-6 px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-10">
        <BreadcrumbBlock
          items={[
            { label: "Anasayfa", href: "/" },
            { label: categoryName, href: `/${categorySlug}` },
            { label: "Rehber" },
            { label: post.title },
          ]}
        />

        <div className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <article className="space-y-6">
            <header className="space-y-3">
              <h1 className="text-3xl font-semibold text-slate-900">
                {post.title}
              </h1>
            </header>

            {post.image && (
              <div className="overflow-hidden rounded-2xl bg-muted">
                <img
                  src={post.image}
                  alt={post.title}
                  width={1074}
                  height={240}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}

            {author && (
              <div className="flex items-center gap-2">
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-200">
                  {author.image ? (
                    <Image
                      src={author.image}
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
                      {author.name.charAt(0)}
                    </span>
                  )}
                </div>
                <Link
                  href={`/yazar/${author.slug}`}
                  className="text-sm font-medium text-slate-900 hover:underline"
                >
                  {author.title ? `${author.title} ${author.name}` : author.name}
                </Link>
              </div>
            )}

            <GuideToc items={tocItems} />

            <div id="rehber-icerik" className="space-y-4 text-[16px] leading-7 text-slate-700">
              {post.slug === "kira-sorunlarinda-ilk-adimlar" ? (
                <>
                  <h2 id="kira-ilk-adimlar" className="text-[22px] font-semibold">
                    Kira sorunlarında ilk adımlar
                  </h2>
                  <p>{post.content[0]}</p>
                  <h3 id="kira-belgeler-kayitlar" className="text-[19px] font-semibold">
                    Belgeleri ve kayıtları hazırlama
                  </h3>
                  <p>{post.content[1]}</p>
                  <h3 id="kira-profesyonel-destek" className="text-[19px] font-semibold">
                    Profesyonel destek alma
                  </h3>
                  <p>{post.content[2]}</p>
                </>
              ) : (
                post.content.map((paragraph, index) => (
                  <p key={`${post.slug}-${index}`}>{paragraph}</p>
                ))
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
              Bu içerik genel bilgilendirme amaçlıdır; somut durumlar için
              profesyonel destek almanız önerilir.
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                href={`/${categorySlug}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Kategoriye dön
              </Link>
              <Link
                href="/soru-sor"
                className="inline-flex h-10 items-center justify-center rounded-md bg-slate-800 px-4 text-sm text-white"
              >
                Soru Sor
              </Link>
            </div>
          </article>

          <div className="flex flex-col gap-6 overflow-visible">
            <StickyCTA />
            {categoryGuides.length > 0 && (
              <CategoryGuidesSidebar
                guides={categoryGuides.map((g) => ({
                  title: g.title,
                  href: `/${g.categorySlug}/rehber/${g.slug}`,
                  slug: g.slug,
                }))}
                currentSlug={slug}
                allGuidesUrl={`/${categorySlug}/rehber`}
              />
            )}
          </div>
        </div>

        {relatedQuestions.length > 0 && (
          <section className="mt-12 space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
              <span className="h-5 w-1 rounded-full bg-slate-800" />
              Bu Konuda Sorulan Sorular
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedQuestions.map((q) => (
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
            <Link
              href={`/${categorySlug}`}
              className="text-sm font-medium text-slate-700 underline"
            >
              Kategori sayfasına git
            </Link>
          </section>
        )}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
