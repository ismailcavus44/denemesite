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
  meta_title?: string | null;
  meta_description?: string | null;
};

const KNOWN_CATEGORIES: Record<string, string> = {
  "is-hukuku": "İş Hukuku",
  "miras-hukuku": "Miras Hukuku",
  "ceza-hukuku": "Ceza Hukuku",
  "icra-hukuku": "İcra Hukuku",
  "gayrimenkul-hukuku": "Gayrimenkul Hukuku",
  "aile-hukuku": "Aile Hukuku",
  "diger": "Diğer",
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
      .select("id,name,slug,intro,pillar_md,updated_at,meta_title,meta_description")
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
    getRelatedGuides(categorySlug, limit),
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

export type RelatedQuestionItem = {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  ai_card_summary?: string | null;
  category?: { name: string; slug: string } | null;
};

const RELATED_POOL_SIZE = 8;
const RELATED_DISPLAY_LIMIT = 3;

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let state = seed;
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type RelatedQuestionRow = Omit<RelatedQuestionItem, "category"> & {
  category?: { name: string; slug: string } | { name: string; slug: string }[] | null;
};

function normalizeRelatedQuestion(row: RelatedQuestionRow): RelatedQuestionItem {
  const { category, ...rest } = row;
  return {
    ...rest,
    category: Array.isArray(category) ? (category[0] ?? null) : (category ?? null),
  };
}

/** Aynı kategorideki son sorulardan havuz oluşturup mevcut soruya göre dönüşümlü 1–3 ilgili soru seçer. */
export async function getRotatingRelatedQuestions(
  categorySlug: string,
  excludeQuestionId: string,
  options?: { poolSize?: number; limit?: number }
): Promise<RelatedQuestionItem[]> {
  const poolSize = options?.poolSize ?? RELATED_POOL_SIZE;
  const limit = options?.limit ?? RELATED_DISPLAY_LIMIT;
  const supabase = createSupabaseAdminClient();

  const { data } = await supabase
    .from("questions")
    .select(QUESTIONS_SELECT)
    .eq("status", "published")
    .eq("categories.slug", categorySlug)
    .neq("id", excludeQuestionId)
    .order("created_at", { ascending: false })
    .limit(poolSize);

  const pool = (data ?? []).map((row) =>
    normalizeRelatedQuestion(row as unknown as RelatedQuestionRow)
  );

  if (pool.length === 0) return [];

  const take = Math.min(limit, pool.length);
  return seededShuffle(pool, hashSeed(excludeQuestionId)).slice(0, take);
}

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

/** Liste/sidebar için rehber öğesi (statik + DB birleşik). */
export type GuideListItem = {
  slug: string;
  title: string;
  summary: string;
  categorySlug: string;
  image?: string;
  cardImage?: string;
};

/** DB'den yayındaki makaleleri kategori slug ile çeker (sıralama için created_at dahil). */
async function getArticlesByCategory(categorySlug: string): Promise<(GuideListItem & { _sortDate: string })[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("articles")
    .select("title, slug, meta_description, content, featured_image_url, created_at")
    .eq("category", categorySlug)
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (!data?.length) return [];
  return data.map((a) => {
    const row = a as { title: string; slug: string; meta_description?: string | null; content?: string | null; featured_image_url?: string | null; created_at: string };
    const metaDesc = row.meta_description?.trim() || "";
    const contentText = row.content ? row.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
    const raw = metaDesc || contentText;
    const summary = raw.length > 160 ? `${raw.slice(0, 157)}...` : raw;
    return {
      slug: row.slug,
      title: row.title,
      summary,
      categorySlug,
      image: row.featured_image_url ?? undefined,
      cardImage: row.featured_image_url ?? undefined,
      _sortDate: row.created_at,
    };
  });
}

/** Statik + DB rehberleri birleştirir, tarihe göre sıralar (yeni önce). Aynı slug varsa DB öncelikli. */
async function getMergedGuidesForCategory(categorySlug: string): Promise<(GuideListItem & { _sortDate: string })[]> {
  const staticPosts = blogPosts
    .filter((p) => p.categorySlug === categorySlug)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary.length > 160 ? `${p.summary.slice(0, 157)}...` : p.summary,
      categorySlug: p.categorySlug,
      image: p.image,
      cardImage: p.cardImage ?? p.image,
      _sortDate: p.date,
    }));
  const dbArticles = await getArticlesByCategory(categorySlug);
  const dbSlugs = new Set(dbArticles.map((a) => a.slug));
  const staticOnly = staticPosts.filter((p) => !dbSlugs.has(p.slug));
  const merged = [...staticOnly, ...dbArticles];
  merged.sort((a, b) => (b._sortDate < a._sortDate ? -1 : b._sortDate > a._sortDate ? 1 : 0));
  return merged;
}

/** Rehber (blog) yazıları kategori slug ile filtreler; statik + DB birleşik. */
export async function getRelatedGuides(
  categorySlug: string,
  limit: number,
  excludeSlug?: string
): Promise<GuideListItem[]> {
  const merged = await getMergedGuidesForCategory(categorySlug);
  const filtered = excludeSlug ? merged.filter((p) => p.slug !== excludeSlug) : merged;
  return filtered.slice(0, limit).map(({ _sortDate: _, ...rest }) => rest);
}

/** Rehber listesi sayfalama: statik + DB birleşik, sayfa başına pageSize adet. */
export async function getRelatedGuidesPaginated(
  categorySlug: string,
  page: number,
  pageSize: number
): Promise<{ guides: GuideListItem[]; total: number }> {
  const merged = await getMergedGuidesForCategory(categorySlug);
  const total = merged.length;
  const from = (page - 1) * pageSize;
  const guides = merged.slice(from, from + pageSize).map(({ _sortDate: _, ...rest }) => rest);
  return { guides, total };
}

/** Yazar slug ile eşleşen rehber yazıları. */
export function getGuidesByAuthor(authorSlug: string) {
  return blogPosts.filter((p) => p.authorSlug === authorSlug);
}
