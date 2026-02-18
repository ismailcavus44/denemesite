import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { getRelatedQuestions, getRelatedGuides } from "@/lib/content";
import { QuestionDetail } from "@/components/question-detail";
import { siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("questions")
    .select("title,body,seo_title,seo_description,published_at,category_id,category:categories(slug)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  const cat = (data as { category?: { slug: string } | Array<{ slug: string }> }).category;
  const catSlug = Array.isArray(cat) ? cat[0]?.slug : cat?.slug;
  if (!data || catSlug !== categorySlug) {
    return { title: "Soru bulunamadı" };
  }

  const title =
    (data as { seo_title?: string | null }).seo_title?.trim() || data.title;
  const description =
    (data as { seo_description?: string | null }).seo_description?.trim() ||
    data.body.slice(0, 160);
  const url = `${siteConfig.url}/${categorySlug}/soru/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: (data as { published_at?: string | null }).published_at ?? undefined,
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: url },
  };
}

/** Yanlış/yaygın slug varyantları → doğru slug (kategori bazında) */
const SLUG_REDIRECTS: Record<string, Record<string, string>> = {};

export default async function CategoryQuestionPage({ params }: PageProps) {
  const { category: categorySlug, slug } = await params;
  const supabase = createSupabaseAdminClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id,name,slug")
    .eq("slug", categorySlug)
    .maybeSingle();
  if (!category) {
    notFound();
  }

  const redirectsForCategory = SLUG_REDIRECTS[categorySlug];
  if (redirectsForCategory?.[slug]) {
    redirect(`/${categorySlug}/soru/${redirectsForCategory[slug]}`);
  }

  const { data: question } = await supabase
    .from("questions")
    .select(
      `id,title,body,slug,created_at,published_at,category_id,ai_h1_summary,ai_h1_enabled,
      related_guide_url,related_guide_label,
      category:categories(name,slug),
      answer:answers(answer_text)`
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  const qCat = question?.category as { slug?: string } | Array<{ slug?: string }> | undefined;
  const qCatSlug = Array.isArray(qCat) ? qCat[0]?.slug : qCat?.slug;
  if (!question || qCatSlug !== categorySlug) {
    notFound();
  }

  const [related, categoryGuides] = await Promise.all([
    getRelatedQuestions(categorySlug, 6, question.id),
    getRelatedGuides(categorySlug, 5),
  ]);

  const answer = Array.isArray(question.answer) ? question.answer[0] : question.answer;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: question.title,
      text: question.body,
      answerCount: answer ? 1 : 0,
      dateCreated: question.created_at,
      acceptedAnswer: answer
        ? {
            "@type": "Answer",
            text: answer.answer_text,
            dateCreated: question.published_at ?? question.created_at,
          }
        : undefined,
    },
  };

  return (
    <>
      <QuestionDetail
        title={question.title}
        body={question.body}
        category={Array.isArray(question.category) ? (question.category[0] ?? null) : question.category}
        answerText={answer?.answer_text ?? null}
        related={related.map((q) => ({
          ...q,
          category: Array.isArray(q.category) ? (q.category[0] ?? null) : q.category,
        }))}
        categoryGuides={categoryGuides.map((g) => ({ slug: g.slug, title: g.title, categorySlug: g.categorySlug }))}
        aiH1Summary={(question as { ai_h1_summary?: string | null }).ai_h1_summary ?? null}
        aiH1Enabled={(question as { ai_h1_enabled?: boolean | null }).ai_h1_enabled === true}
        publishedAt={(question as { published_at?: string | null }).published_at ?? null}
        categorySlug={categorySlug}
        guideCta={
          (() => {
            const q = question as { related_guide_url?: string | null; related_guide_label?: string | null };
            return q.related_guide_url?.trim() && q.related_guide_label?.trim()
              ? { href: q.related_guide_url.trim(), label: q.related_guide_label.trim() }
              : null;
          })()
        }
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
