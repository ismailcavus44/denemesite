import { getRotatingRelatedQuestions } from "@/lib/content";
import { QuestionCard } from "@/components/question-card";

type RelatedQuestionsProps = {
  questionId: string;
  categorySlug: string;
};

export async function RelatedQuestions({
  questionId,
  categorySlug,
}: RelatedQuestionsProps) {
  const items = await getRotatingRelatedQuestions(categorySlug, questionId);

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id="ilgili-sorular"
      className="scroll-mt-24 space-y-4"
      aria-labelledby="related-questions-heading"
    >
      <h2
        id="related-questions-heading"
        className="flex items-center gap-2 text-xl font-semibold text-slate-900"
      >
        <span className="h-5 w-1 rounded-full bg-slate-800" aria-hidden />
        Bu Konuda Sorulan Sorular
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <QuestionCard
            key={item.id}
            title={item.title}
            slug={item.slug}
            category={item.category}
            summaryText={item.ai_card_summary ?? null}
            categorySlug={categorySlug}
            compact
            titleHeading="h3"
          />
        ))}
      </div>
    </section>
  );
}
