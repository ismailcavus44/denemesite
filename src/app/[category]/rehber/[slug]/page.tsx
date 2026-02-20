import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, type ContentBlock } from "@/lib/blog-data";
import { getAuthorBySlug } from "@/lib/authors";
import { getCategoryBySlug, getKnownCategoryName, getRelatedQuestions, getRelatedGuides } from "@/lib/content";
import { BreadcrumbBlock } from "@/components/breadcrumb";
import { QuestionCard } from "@/components/question-card";
import { siteConfig } from "@/lib/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArticleSchema } from "@/components/schemas/ArticleSchema";
import { FAQSchema } from "@/components/schemas/FAQSchema";
import { GuideToc } from "@/components/guide-toc";

const StickyCTA = dynamic(
  () => import("@/components/question-detail/StickyCTA").then((m) => ({ default: m.StickyCTA })),
  { ssr: true }
);

const CategoryGuidesSidebar = dynamic(
  () =>
    import("@/components/question-detail/CategoryGuidesSidebar").then((m) => ({
      default: m.CategoryGuidesSidebar,
    })),
  { ssr: true }
);

/** Başlık metninden id üretir (Türkçe uyumlu, benzersiz). */
function slugifyForId(text: string): string {
  const t = text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return t || "baslik";
}

type TocItem = { id: string; label: string; level: "h2" | "h3" };

function getTocFromContentBlocks(blocks: ContentBlock[]): TocItem[] {
  const items: TocItem[] = [];
  const used = new Set<string>();
  for (const b of blocks) {
    if (b.t !== "h2" && b.t !== "h3") continue;
    let id = slugifyForId(b.v);
    if (used.has(id)) {
      let n = 2;
      while (used.has(`${id}-${n}`)) n++;
      id = `${id}-${n}`;
    }
    used.add(id);
    items.push({ id, label: b.v, level: b.t });
  }
  return items;
}

/** Metinde *...* arası bold; React node döndürür. */
function renderWithBold(text: string, keyPrefix: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(1, -1)}</strong>;
    }
    return part;
  });
}

function renderContentBlocks(blocks: ContentBlock[], slug: string, tocItems: TocItem[]) {
  let tocIndex = 0;
  return blocks.map((block, idx) => {
    const key = `${slug}-${idx}`;
    switch (block.t) {
      case "h2": {
        const item = tocItems[tocIndex++];
        return (
          <h2 key={key} id={item?.id} className="mt-8 text-[26px] font-semibold text-slate-900 scroll-mt-6">
            {block.v}
          </h2>
        );
      }
      case "h3": {
        const item = tocItems[tocIndex++];
        return (
          <h3 key={key} id={item?.id} className="mt-6 text-[22px] font-semibold text-slate-900 scroll-mt-6">
            {block.v}
          </h3>
        );
      }
      case "p":
        return (
          <p key={key} className="leading-7">
            {renderWithBold(block.v, key)}
          </p>
        );
      case "ul":
        return (
          <ul key={key} className="list-inside list-disc space-y-2 pl-1">
            {block.v.map((item, i) => (
              <li key={`${key}-${i}`}>{renderWithBold(item, `${key}-${i}`)}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  });
}

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

  const title = post.seoTitle ?? `${post.title} | ${siteConfig.name}`;
  const description =
    post.seoDescription ?? (post.summary.length > 160 ? `${post.summary.slice(0, 157)}...` : post.summary);
  const url = `${siteConfig.url}/${categorySlug}/rehber/${slug}`;

  return {
    title: { absolute: title },
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
    getRelatedQuestions(categorySlug, 2),
    getRelatedGuides(categorySlug, 5, slug),
  ]);
  const author = post.authorSlug ? getAuthorBySlug(post.authorSlug) : undefined;

  const articleUrl = `${siteConfig.url}/${categorySlug}/rehber/${slug}`;
  const tocItems = post.contentBlocks ? getTocFromContentBlocks(post.contentBlocks) : [];

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

        <div className="grid gap-10 grid-cols-1 md:grid-cols-[minmax(0,2fr)_300px]">
          <article className="space-y-6">
            <header className="space-y-3">
              <h1 className="text-3xl font-semibold text-slate-900">
                {post.title}
              </h1>
            </header>

            {post.image && (
              <div className="relative overflow-hidden rounded-[8px] bg-muted aspect-[1200/630] w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={1200}
                  height={630}
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1152px) 100vw, 1152px"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {author && (
                <>
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
                  <span className="text-slate-400">|</span>
                </>
              )}
              <Link
                href={`/${categorySlug}`}
                className="text-sm font-medium text-slate-900 hover:underline"
              >
                {categoryName}
              </Link>
            </div>

            {tocItems.length > 0 && <GuideToc items={tocItems} />}

            <div id="rehber-icerik" className="space-y-4 text-[16px] text-slate-700 text-justify">
              {post.contentBlocks
                ? renderContentBlocks(post.contentBlocks, post.slug, tocItems)
                : post.content.map((paragraph, index) => (
                    <p key={`${post.slug}-${index}`} className="text-justify">{paragraph}</p>
                  ))}
            </div>

            {post.faq && post.faq.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-[19px] font-bold text-slate-900">
                  Sık Sorulan Sorular
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {post.faq.map((item, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left text-[15px] font-bold text-slate-900">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-[15px] leading-7 text-slate-600">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

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

          <div className="hidden md:flex flex-col gap-6 overflow-visible">
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
            <div className="grid gap-3 sm:grid-cols-2 max-w-2xl">
              {relatedQuestions.map((q) => (
                <QuestionCard
                  key={q.id}
                  title={q.title}
                  slug={q.slug}
                  category={Array.isArray(q.category) ? (q.category[0] ?? null) : q.category}
                  createdAt={q.created_at}
                  summaryText={(q as { ai_card_summary?: string | null }).ai_card_summary ?? null}
                  categorySlug={categorySlug}
                  compact
                />
              ))}
            </div>
            <Link
              href={`/${categorySlug}/sorular`}
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-background px-4 text-sm font-medium text-slate-700 hover:bg-muted"
            >
              Devamını gör
            </Link>
          </section>
        )}
      </div>
      <ArticleSchema
        headline={post.title}
        description={post.summary.length > 160 ? `${post.summary.slice(0, 157)}...` : post.summary}
        datePublished={post.date}
        url={articleUrl}
        image={post.image ? `${siteConfig.url}${post.image}` : undefined}
      />
      {post.faq && post.faq.length > 0 && (
        <FAQSchema items={post.faq} />
      )}
    </>
  );
}
