import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { blogPosts } from "@/lib/blog-data";
import { generateCategoryPillar } from "@/lib/ai/generateCategoryPillar";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  intro?: string | null;
  pillar_md?: string | null;
  updated_at?: string | null;
};

const KNOWN_CATEGORIES: Record<string, string> = {
  "is-hukuku": "İş Hukuku",
  "miras-hukuku": "Miras Hukuku",
  "ceza-hukuku": "Ceza Hukuku",
  "icra-hukuku": "İcra Hukuku",
  "gayrimenkul-hukuku": "Gayrimenkul Hukuku",
  "aile-hukuku": "Aile Hukuku",
  "diger": "Diğer",
  "hukuk-rehberi": "Hukuk Rehberi",
};

export const KNOWN_CATEGORY_SLUGS = Object.keys(KNOWN_CATEGORIES);

/** Bilinen slug için isim döner (DB yokken de sayfa açılsın). */
export function getKnownCategoryName(slug: string): string | null {
  return KNOWN_CATEGORIES[slug] ?? null;
}

/** Bilinen slug DB'de yoksa ekler (404 önlemek için). */
export async function ensureCategoryExists(slug: string): Promise<void> {
  const name = KNOWN_CATEGORIES[slug];
  if (!name) return;
  try {
    const supabase = createSupabaseAdminClient();
    await supabase.from("categories").upsert({ slug, name }, { onConflict: "slug" });
  } catch {
    // DB erişim hatası; sayfa fallback ile açılır
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<CategoryRow | null> {
  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("categories")
      .select("id,name,slug,intro,pillar_md,updated_at")
      .eq("slug", slug)
      .maybeSingle();
    return data as CategoryRow | null;
  } catch {
    return null;
  }
}

export type TopLinkItem = { type: "rehber" | "soru"; slug: string; title: string };

/** En çok görüntülenen sorular + rehberlerden 6–10 internal link (kategori pillar sayfası). */
export async function getTopLinksForCategory(
  categorySlug: string,
  limit = 10
): Promise<TopLinkItem[]> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return [];

  const [questions, guides] = await Promise.all([
    getRelatedQuestions(categorySlug, limit),
    Promise.resolve(getRelatedGuides(categorySlug, limit)),
  ]);

  const fromQuestions: TopLinkItem[] = (questions ?? []).map((q) => ({
    type: "soru" as const,
    slug: q.slug,
    title: q.title,
  }));
  const fromGuides: TopLinkItem[] = guides.map((g) => ({
    type: "rehber" as const,
    slug: g.slug,
    title: g.title,
  }));

  const merged = [...fromQuestions, ...fromGuides].slice(0, limit);
  return merged;
}

/** Kategori pillar metni yoksa AI ile üretir ve DB'ye yazar. Hata durumunda sessizce atlar. */
export async function ensureCategoryPillar(categorySlug: string): Promise<void> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category?.id || category.pillar_md) return;

  try {
    const { intro, pillar_md } = await generateCategoryPillar(category.name, category.slug);
    const supabase = createSupabaseAdminClient();
    await supabase
      .from("categories")
      .update({ intro, pillar_md, updated_at: new Date().toISOString() })
      .eq("id", category.id);
  } catch {
    // API key yok veya AI hatası; sayfa intro/pillar olmadan render edilebilir
  }
}

export async function getRelatedQuestions(
  categorySlug: string,
  limit: number,
  excludeQuestionId?: string
) {
  const supabase = createSupabaseAdminClient();
  // Kategori slug üzerinden join ile soruları al (kategori satırı yoksa da çalışır)
  let q = supabase
    .from("questions")
    .select("id,title,slug,created_at,views,ai_card_summary,category:categories!inner(name,slug)")
    .eq("status", "published")
    .eq("categories.slug", categorySlug)
    .order("views", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (excludeQuestionId) {
    q = q.neq("id", excludeQuestionId);
  }

  const { data } = await q;
  return data ?? [];
}

const QUESTIONS_SELECT =
  "id,title,slug,created_at,views,ai_card_summary,category:categories!inner(name,slug)";

/** Kategori soruları sayfalı (liste sayfası için). */
export async function getRelatedQuestionsPaginated(
  categorySlug: string,
  page: number,
  pageSize: number
): Promise<{ questions: Awaited<ReturnType<typeof getRelatedQuestions>>; total: number }> {
  const supabase = createSupabaseAdminClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count } = await supabase
    .from("questions")
    .select(QUESTIONS_SELECT, { count: "exact" })
    .eq("status", "published")
    .eq("categories.slug", categorySlug)
    .order("views", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  const total = count ?? 0;
  return { questions: (data ?? []) as Awaited<ReturnType<typeof getRelatedQuestions>>, total };
}

/** Rehber (blog) yazıları kategori slug ile filtreler. categorySlug blog-data'daki categorySlug ile eşleşir. */
export function getRelatedGuides(
  categorySlug: string,
  limit: number,
  excludeSlug?: string
) {
  const withSlug = blogPosts.filter((p) => p.categorySlug === categorySlug);
  const filtered = excludeSlug
    ? withSlug.filter((p) => p.slug !== excludeSlug)
    : withSlug;
  return filtered.slice(0, limit);
}

/** Rehber listesi sayfalama: sayfa başına pageSize adet, toplam ile birlikte. */
export function getRelatedGuidesPaginated(
  categorySlug: string,
  page: number,
  pageSize: number
): { guides: ReturnType<typeof getRelatedGuides>; total: number } {
  const withSlug = blogPosts.filter((p) => p.categorySlug === categorySlug);
  const total = withSlug.length;
  const from = (page - 1) * pageSize;
  const guides = withSlug.slice(from, from + pageSize);
  return { guides, total };
}

/** Yazar slug ile eşleşen rehber yazıları. */
export function getGuidesByAuthor(authorSlug: string) {
  return blogPosts.filter((p) => p.authorSlug === authorSlug);
}
