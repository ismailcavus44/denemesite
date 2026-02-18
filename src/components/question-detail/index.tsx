"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { QuestionHero } from "./QuestionHero";
import { QuestionBodyAccordion } from "./QuestionBodyAccordion";
import { AnswerCard, type GuideCta } from "./AnswerCard";
import { StickyCTA } from "./StickyCTA";
import { CategoryGuidesSidebar } from "./CategoryGuidesSidebar";
import { SimilarQuestionsSection } from "./SimilarQuestionsSection";
import { ReadingProgress } from "./ReadingProgress";

type Category = { name: string; slug: string };
type RelatedItem = {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  ai_card_summary?: string | null;
  category?: Category | null;
};
type CategoryGuideItem = { slug: string; title: string; categorySlug: string };

export type QuestionDetailProps = {
  title: string;
  body: string;
  category?: Category | null;
  answerText?: string | null;
  related: RelatedItem[];
  /** Sorunun kategorisindeki rehber yazıları (sidebar, en fazla 5). */
  categoryGuides?: CategoryGuideItem[];
  aiH1Summary?: string | null;
  aiH1Enabled?: boolean;
  publishedAt?: string | null;
  /** Topic silo: kategori slug (örn. miras-hukuku). Verilirse breadcrumb ve benzer soru linkleri buna göre. */
  categorySlug?: string | null;
  /** Cevap kartı sonunda gösterilecek rehber linki (panelden eklenir). */
  guideCta?: GuideCta | null;
};

function estimateReadingMinutes(body: string, answerText: string | null): number {
  const text = `${body} ${answerText ?? ""}`.replace(/\s+/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function QuestionDetail({
  title,
  body,
  category,
  answerText,
  related,
  categoryGuides = [],
  aiH1Summary,
  aiH1Enabled,
  publishedAt,
  categorySlug,
  guideCta,
}: QuestionDetailProps) {
  const useH1Summary = Boolean(aiH1Enabled && aiH1Summary?.trim());
  const displayTitle = useH1Summary ? aiH1Summary! : title;
  const readingMinutes = estimateReadingMinutes(body, answerText ?? null);
  const [showOriginal, setShowOriginal] = useState(true);

  const breadcrumbItems =
    categorySlug && category
      ? [
          { label: "Anasayfa", href: "/" as string },
          { label: category.name, href: `/${categorySlug}` as string },
          { label: "Soru" },
          { label: displayTitle },
        ]
      : undefined;

  return (
    <>
      <ReadingProgress />
      <div className="min-h-screen bg-white pb-24 lg:pb-12">
        <div className="mx-auto max-w-6xl px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <main className="space-y-8 lg:col-span-8">
              <QuestionHero
                title={displayTitle}
                category={category}
                publishedAt={publishedAt}
                readingMinutes={readingMinutes}
                breadcrumbItems={breadcrumbItems}
              />

              {body.trim() && (
                <section className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-5">
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowOriginal((v) => !v)}
                      className="flex items-center gap-2 text-sm font-semibold text-slate-800"
                    >
                      <span>Sorunun devamı</span>
                      {showOriginal ? (
                        <EyeOff className="size-4 text-slate-600" aria-hidden />
                      ) : (
                        <Eye className="size-4 text-slate-600" aria-hidden />
                      )}
                    </button>
                    {showOriginal && (
                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                        {body}
                      </p>
                    )}
                  </div>
                </section>
              )}

              <AnswerCard answerHtml={answerText ?? ""} guideCta={guideCta} />

              <SimilarQuestionsSection
                related={related}
                categorySlug={categorySlug ?? category?.slug ?? null}
                basePath={categorySlug ? `/${categorySlug}/soru` : undefined}
              />
            </main>

            <div className="hidden lg:block lg:col-span-4 overflow-visible">
              <aside className="flex flex-col gap-6 overflow-visible lg:pl-2">
                <StickyCTA />
                {categoryGuides.length > 0 && categorySlug && (
                  <CategoryGuidesSidebar
                    guides={categoryGuides.map((g) => ({
                      title: g.title,
                      href: `/${g.categorySlug}/rehber/${g.slug}`,
                      slug: g.slug,
                    }))}
                    currentSlug={null}
                    allGuidesUrl={`/${categorySlug}/rehber`}
                  />
                )}
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
