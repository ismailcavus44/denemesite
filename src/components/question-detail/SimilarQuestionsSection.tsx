import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/question-card";

type RelatedItem = {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  ai_card_summary?: string | null;
  category?: { name: string; slug: string } | null;
};

type SimilarQuestionsSectionProps = {
  related: RelatedItem[];
  categorySlug?: string | null;
  /** Topic silo: soru link base, örn. /miras-hukuku/soru. Verilmezse /soru. */
  basePath?: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function SimilarQuestionsSection({
  related,
  categorySlug,
  basePath = "/soru",
}: SimilarQuestionsSectionProps) {
  const categoryHubHref = categorySlug ? `/${categorySlug}` : undefined;
  const items = related.slice(0, 3);

  return (
    <section id="benzer-sorular" className="scroll-mt-24 space-y-3">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
        <span className="h-5 w-1 rounded-full bg-slate-800" />
        Benzer Sorular
      </h2>
      <p className="text-sm text-slate-600">
        Aradığın cevap burada olabilir.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <QuestionCard
            key={item.id}
            title={item.title}
            slug={item.slug}
            category={item.category}
            createdAt={item.created_at}
            summaryText={item.ai_card_summary ?? null}
            categorySlug={categorySlug ?? item.category?.slug ?? undefined}
            compact
          />
        ))}
      </div>

      {!related.length && (
        <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
          Benzer soru bulunamadı.
        </div>
      )}

      {categoryHubHref && (
        <div className="mt-4 flex justify-center">
          <Button asChild variant="default" size="default">
            <Link href={categoryHubHref}>
              Tümünü Gör
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}
