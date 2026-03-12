import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { addHeadingIdsAndGetToc } from "@/lib/articleHtml";
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
import { sanitizeHtml } from "@/lib/sanitize";
import { BreadcrumbListSchema } from "@/components/schemas/BreadcrumbListSchema";
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
          <h2 key={key} id={item?.id} className="mt-8 text-[24px] font-semibold text-slate-900 scroll-mt-6">
            {block.v}
          </h2>
        );
      }
      case "h3": {
        const item = tocItems[tocIndex++];
        return (
          <h3 key={key} id={item?.id} className="mt-6 text-[20px] font-semibold text-slate-900 scroll-mt-6">
            {block.v}
          </h3>
        );
      }
      case "p":
        return (
          <p key={key} className="text-[14px] leading-7 text-black">
            {renderWithBold(block.v, key)}
          </p>
        );
      case "ul":
        return (
          <ul key={key} className="list-inside list-disc space-y-2 pl-1 text-[14px]">
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

type AuthorRow = { id: string; name: string; slug: string; photo_url: string | null };
type FaqItem = { question: string; answer: string };

type ArticleWithAuthor = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  faq: FaqItem[] | null;
  created_at: string;
  author_id: string | null;
  authors: AuthorRow | null;
};

/** Supabase: slug + category ile yayındaki makale + yazar (server-side). */
async function getArticleByCategoryAndSlug(category: string, slug: string): Promise<ArticleWithAuthor | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id,title,slug,category,content,meta_title,meta_description,featured_image_url,featured_image_alt,faq,created_at,author_id,authors(id,name,slug,photo_url)")
    .eq("slug", slug)
    .eq("category", category)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  const row = data as Record<string, unknown>;
  const authors = row.authors as AuthorRow | null;
  return {
    ...row,
    authors: authors ?? null,
  } as ArticleWithAuthor;
}

/** Tüm rehber sayfaları: statik blog + DB makaleleri için params. */
export function generateStaticParams() {
  return blogPosts.map((p) => ({ category: p.categorySlug, slug: p.slug }));
}

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const dbArticle = await getArticleByCategoryAndSlug(categorySlug, slug);
  if (dbArticle) {
    const title = dbArticle.meta_title?.trim() || dbArticle.title;
    const rawDesc = dbArticle.meta_description?.trim();
    const description = rawDesc ? `${rawDesc} | YasalHaklarınız` : undefined;
    const url = `${siteConfig.url}/${categorySlug}/rehber/${slug}`;
    const images = dbArticle.featured_image_url
      ? [{ url: dbArticle.featured_image_url, width: 1200, height: 630, alt: dbArticle.featured_image_alt ?? title }]
      : undefined;
    return {
      title: { absolute: title },
      description,
      openGraph: { title, description, url, images },
      twitter: { card: "summary_large_image" as const, title, description, images: images ? [images[0].url] : undefined },
      alternates: { canonical: url },
    };
  }
  const post = blogPosts.find((p) => p.slug === slug && p.categorySlug === categorySlug);
  if (!post) return { title: "Rehber bulunamadı" };
  const title = post.seoTitle ?? `${post.title} | ${siteConfig.name}`;
  const description = post.seoDescription ?? (post.summary.length > 160 ? `${post.summary.slice(0, 157)}...` : post.summary);
  const url = `${siteConfig.url}/${categorySlug}/rehber/${slug}`;
  return { title: { absolute: title }, description, openGraph: { title, description, url }, twitter: { card: "summary_large_image", title, description }, alternates: { canonical: url } };
}

export default async function CategoryGuidePage({ params }: PageProps) {
  const { category: categorySlug, slug } = await params;
  const [dbArticle, categoryRow] = await Promise.all([
    getArticleByCategoryAndSlug(categorySlug, slug),
    getCategoryBySlug(categorySlug),
  ]);
  const categoryName = categoryRow?.name ?? getKnownCategoryName(categorySlug) ?? categorySlug;

  if (dbArticle) {
    const baseUrl = siteConfig.url.replace(/\/$/, "");
    const articleUrl = `${baseUrl}/${categorySlug}/rehber/${slug}`;
    const { html: rawHtml, tocItems } = addHeadingIdsAndGetToc(dbArticle.content);
    const contentWithIds = sanitizeHtml(rawHtml);
    const categoryGuides = await getRelatedGuides(categorySlug, 5, slug);

    return (
      <>
        <BreadcrumbListSchema
          items={[
            { name: "Anasayfa", url: baseUrl },
            { name: categoryName, url: `${baseUrl}/${categorySlug}` },
            { name: "Rehber", url: `${baseUrl}/${categorySlug}/rehber` },
            { name: dbArticle.title, url: articleUrl },
          ]}
        />
        <div className="mx-auto max-w-6xl space-y-6 px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-10">
          <BreadcrumbBlock
            items={[
              { label: "Anasayfa", href: "/" },
              { label: categoryName, href: `/${categorySlug}` },
              { label: "Rehber", href: `/${categorySlug}/rehber` },
              { label: dbArticle.title },
            ]}
          />
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,2fr)_300px]">
            <article className="space-y-6">
              <header className="space-y-3">
                <h1 className="text-3xl font-semibold text-slate-900">{dbArticle.title}</h1>
              </header>
              {dbArticle.featured_image_url && (
                <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-[8px] bg-muted">
                  <Image
                    src={dbArticle.featured_image_url}
                    alt={dbArticle.featured_image_alt ?? dbArticle.title}
                    fill
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 1152px) 100vw, 1152px"
                    className="object-cover"
                  />
                </div>
              )}
              {(dbArticle.authors || categoryName) && (
                <div className="flex flex-wrap items-center gap-1">
                  {dbArticle.authors && (
                    <>
                      <Link
                        href={`/yazar/${dbArticle.authors.slug}`}
                        className="flex items-center gap-2 rounded-full pr-1 transition hover:underline underline-offset-2"
                      >
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-200">
                          {dbArticle.authors.photo_url ? (
                            <Image
                              src={dbArticle.authors.photo_url}
                              alt={dbArticle.authors.name}
                              fill
                              className="object-cover"
                              sizes="36px"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
                              {dbArticle.authors.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium text-slate-900">{dbArticle.authors.name}</span>
                      </Link>
                      {categoryName && <span className="text-slate-400"> | </span>}
                    </>
                  )}
                  {categoryName && (
                    <Link href={`/${categorySlug}`} className="text-sm font-medium text-slate-900 hover:underline underline-offset-2">
                      {categoryName}
                    </Link>
                  )}
                </div>
              )}
              {tocItems.length > 0 && <GuideToc items={tocItems} />}
              <aside className="md:hidden rounded-[8px] border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Sorunuz mu var?</p>
                <p className="mt-0.5 text-xs text-slate-600 leading-snug">
                  Uzman ekibimize iletin; yayınlanan cevaplardan faydalanın.
                </p>
                <Link
                  href="/soru-sor"
                  className="mt-3 flex w-full items-center justify-center rounded-[8px] bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-900"
                >
                  Soru sor
                </Link>
              </aside>
              <div
                id="rehber-icerik"
                className="rehber-icerik space-y-4 text-[14px] text-black text-justify"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />
              {dbArticle.faq && dbArticle.faq.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-[24px] font-semibold text-slate-900">Sık Sorulan Sorular</h2>
                  <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
                    {(dbArticle.faq as FaqItem[]).map((item, idx) => (
                      <details key={idx} className="group">
                        <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left [&::-webkit-details-marker]:hidden">
                          <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
                          <span className="shrink-0 text-slate-400 transition-transform group-open:rotate-180">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </span>
                        </summary>
                        <div className="px-5 pb-4">
                          <p className="text-[14px] leading-7 text-black">{item.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </article>
            <div className="hidden md:flex flex-col gap-6 overflow-visible">
              <StickyCTA />
              {categoryGuides.length > 0 && (
                <CategoryGuidesSidebar
                  guides={categoryGuides.map((g) => ({ title: g.title, href: `/${g.categorySlug}/rehber/${g.slug}`, slug: g.slug }))}
                  currentSlug={slug}
                  allGuidesUrl={`/${categorySlug}/rehber`}
                />
              )}
            </div>
          </div>
        </div>
        <ArticleSchema
          headline={dbArticle.title}
          description={
            dbArticle.meta_description?.trim()
              ? `${dbArticle.meta_description.trim()} | YasalHaklarınız`
              : dbArticle.title
          }
          datePublished={dbArticle.created_at?.slice(0, 10) ?? ""}
          url={articleUrl}
          image={dbArticle.featured_image_url?.startsWith("http") ? dbArticle.featured_image_url : undefined}
        />
        {dbArticle.faq && dbArticle.faq.length > 0 && (
          <FAQSchema items={(dbArticle.faq as FaqItem[]).map((f) => ({ question: f.question, answer: f.answer }))} />
        )}
      </>
    );
  }

  const post = blogPosts.find((p) => p.slug === slug && p.categorySlug === categorySlug);
  if (!post || !categoryName) {
    notFound();
  }

  const [relatedQuestions, categoryGuides] = await Promise.all([
    getRelatedQuestions(categorySlug, 2),
    getRelatedGuides(categorySlug, 5, slug),
  ]);
  const author = post.authorSlug ? getAuthorBySlug(post.authorSlug) : undefined;

  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const articleUrl = `${baseUrl}/${categorySlug}/rehber/${slug}`;
  const tocItems = post.contentBlocks ? getTocFromContentBlocks(post.contentBlocks) : [];

  return (
    <>
      <BreadcrumbListSchema
        items={[
          { name: "Anasayfa", url: baseUrl },
          { name: categoryName, url: `${baseUrl}/${categorySlug}` },
          { name: "Rehber", url: `${baseUrl}/${categorySlug}/rehber` },
          { name: post.title, url: articleUrl },
        ]}
      />
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
              <h1 className="text-3xl font-semibold text-slate-900">{post.title}</h1>
            </header>

            {post.image && (
              <div className="relative overflow-hidden rounded-[8px] bg-muted aspect-[1200/630] w-full">
                <Image
                  src={post.image}
                  alt={post.imageAlt ?? `${post.title} avukata sor`}
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
                        <Image src={author.image} alt={author.name} fill className="object-cover" sizes="36px" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
                          {author.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <Link href={`/yazar/${author.slug}`} className="text-sm font-medium text-slate-900 hover:underline">
                      {author.title ? `${author.title} ${author.name}` : author.name}
                    </Link>
                  </div>
                  <span className="text-slate-400">|</span>
                </>
              )}
              <Link href={`/${categorySlug}`} className="text-sm font-medium text-slate-900 hover:underline">
                {categoryName}
              </Link>
            </div>

            {tocItems.length > 0 && <GuideToc items={tocItems} />}

            <aside className="md:hidden rounded-[8px] border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Sorunuz mu var?</p>
              <p className="mt-0.5 text-xs text-slate-600 leading-snug">
                Uzman ekibimize iletin; yayınlanan cevaplardan faydalanın.
              </p>
              <Link
                href="/soru-sor"
                className="mt-3 flex w-full items-center justify-center rounded-[8px] bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-900"
              >
                Soru sor
              </Link>
            </aside>

            <div id="rehber-icerik" className="rehber-icerik space-y-4 text-[14px] text-black text-justify">
              {post.contentBlocks
                ? renderContentBlocks(post.contentBlocks, post.slug, tocItems)
                : post.content.map((paragraph, index) => (
                    <p key={`${post.slug}-${index}`} className="text-[14px] text-black text-justify">{paragraph}</p>
                  ))}
            </div>

            {post.faq && post.faq.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-[19px] font-bold text-slate-900">Sık Sorulan Sorular</h3>
                <Accordion type="single" collapsible className="w-full">
                  {post.faq.map((item, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left text-[15px] font-bold text-slate-900">{item.question}</AccordionTrigger>
                      <AccordionContent className="text-[14px] leading-7 text-black">{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}
          </article>

          <div className="hidden md:flex flex-col gap-6 overflow-visible">
            <StickyCTA />
            {categoryGuides.length > 0 && (
              <CategoryGuidesSidebar
                guides={categoryGuides.map((g) => ({ title: g.title, href: `/${g.categorySlug}/rehber/${g.slug}`, slug: g.slug }))}
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
        image={post.image ? `${baseUrl}${post.image}` : undefined}
        author={
          author
            ? { name: author.title ? `${author.title} ${author.name}` : author.name, url: `${baseUrl}/yazar/${author.slug}` }
            : undefined
        }
      />
      {post.faq && post.faq.length > 0 && <FAQSchema items={post.faq} />}
    </>
  );
}
