import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { QuestionCard } from "@/components/question-card";

export const metadata: Metadata = {
  title: "Sorular",
  description:
    "Editör incelemesinden geçmiş hukuki soru ve cevaplar. Miras, boşanma, iş hukuku ve icra konularında sade ve anlaşılır yanıtlar.",
};

type SearchParams = {
  q?: string;
  category?: string;
  page?: string;
};

const PAGE_SIZE = 10;

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const query = sp.q?.trim() ?? "";
  const categorySlug = sp.category ?? "";
  const page = Math.max(1, Number(sp.page ?? "1"));

  const supabase = createSupabaseServerClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id,name,slug")
    .order("name");

  let categoryId: string | null = null;
  if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();
    categoryId = category?.id ?? null;
  }

  let queryBuilder = supabase
    .from("questions")
    .select(
      "id,title,slug,created_at,ai_card_summary,category:categories(name,slug)",
      { count: "exact" }
    )
    .eq("status", "published");

  if (query) {
    queryBuilder = queryBuilder.or(
      `title.ilike.%${query}%,body.ilike.%${query}%`
    );
  }

  if (categoryId) {
    queryBuilder = queryBuilder.eq("category_id", categoryId);
  }

  queryBuilder = queryBuilder.order("created_at", { ascending: false });

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data: questions, count } = await queryBuilder.range(from, to);
  const totalPages = count ? Math.max(1, Math.ceil(count / PAGE_SIZE)) : 1;

  const buildPageLink = (pageNumber: number) => {
    const nextParams = new URLSearchParams();
    if (query) nextParams.set("q", query);
    if (categorySlug) nextParams.set("category", categorySlug);
    nextParams.set("page", String(pageNumber));
    return `/sorular?${nextParams.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Sorular</h1>
        <p className="text-sm text-muted-foreground">
          Yayınlanmış soru ve cevapları arayın, filtreleyin.
        </p>
      </div>

      <form className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-3">
        <input
          name="q"
          defaultValue={query}
          placeholder="Anahtar kelime"
          className="h-10 rounded-md border bg-background px-3 text-sm"
        />
        <select
          name="category"
          defaultValue={categorySlug}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">Tüm kategoriler</option>
          {(categories ?? []).map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <button className="h-10 rounded-md bg-foreground text-sm text-background">
          Filtrele
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {(questions ?? []).map((question) => (
          <QuestionCard
            key={question.id}
            title={question.title}
            slug={question.slug}
            category={question.category}
            createdAt={question.created_at}
            summaryText={(question as { ai_card_summary?: string | null }).ai_card_summary ?? null}
            categorySlug={(question as { category?: { slug: string } }).category?.slug ?? null}
          />
        ))}
        {!questions?.length && (
          <div className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
            Aradığınız kriterlere uygun soru bulunamadı.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Sayfa {page} / {totalPages}
        </span>
        <div className="flex gap-2">
          <Link
            href={buildPageLink(Math.max(1, page - 1))}
            className={`rounded-md border px-3 py-1 ${
              page === 1
                ? "pointer-events-none border-slate-200 opacity-50"
                : "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            Önceki
          </Link>
          <Link
            href={buildPageLink(Math.min(totalPages, page + 1))}
            className={`rounded-md border px-3 py-1 ${
              page >= totalPages
                ? "pointer-events-none border-slate-200 opacity-50"
                : "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            Sonraki
          </Link>
        </div>
      </div>
    </div>
  );
}
