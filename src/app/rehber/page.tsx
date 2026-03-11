import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { getKnownCategoryName } from "@/lib/content";
import { blogPosts, type BlogPost } from "@/lib/blog-data";
import { SearchBar } from "@/components/search-bar";
import { BreadcrumbBlock } from "@/components/breadcrumb";
import { BlogTeaserCard } from "@/components/blog-teaser-card";
import { siteConfig } from "@/lib/site";

const _title = "Rehber | YasalHaklarınız";
const _desc = "Miras, boşanma, iş hukuku ve icra konularında sade ve anlaşılır hukuki rehber yazıları. Editör onaylı bilgilendirme içerikleri.";
const _url = `${siteConfig.url}/rehber`;

export const metadata: Metadata = {
  title: { absolute: "Rehber | YasalHaklarınız" },
  description: _desc,
  openGraph: { title: _title, description: _desc, url: _url },
  twitter: { card: "summary_large_image", title: _title, description: _desc },
  alternates: { canonical: _url },
};

export const revalidate = 3600;

type GuidePageProps = {
  searchParams?: Promise<{ page?: string; q?: string }>;
};

/** Kartta kullanılacak ortak tip: statik blog veya Supabase makalesi */
type GuideListItem = Pick<BlogPost, "slug" | "title" | "summary" | "categorySlug" | "image" | "cardImage"> & {
  category: string;
  sortDate: string;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** Supabase'den yayındaki makaleleri çeker (kategorisi olanlar). */
async function getPublishedArticles(): Promise<GuideListItem[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("articles")
    .select("title, slug, category, meta_description, content, featured_image_url, updated_at")
    .eq("status", "published")
    .not("category", "is", null)
    .order("updated_at", { ascending: false });
  if (!data?.length) return [];
  return data.map((a) => {
    const category = (a as { category: string }).category;
    const metaDesc = (a as { meta_description?: string | null }).meta_description?.trim() || "";
    const contentText = (a as { content?: string | null }).content ? stripHtml((a as { content: string }).content) : "";
    const raw = metaDesc || contentText;
    const summary = raw.length > 160 ? `${raw.slice(0, 157)}...` : raw;
    return {
      slug: (a as { slug: string }).slug,
      title: (a as { title: string }).title,
      summary,
      category: getKnownCategoryName(category) ?? category,
      categorySlug: category,
      image: (a as { featured_image_url?: string | null }).featured_image_url ?? undefined,
      cardImage: (a as { featured_image_url?: string | null }).featured_image_url ?? undefined,
      sortDate: (a as { updated_at: string }).updated_at ?? new Date().toISOString(),
    };
  });
}

/** Statik blog listesini kart tipine çevirir. */
function blogPostsToGuideList(posts: BlogPost[]): GuideListItem[] {
  return posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary.length > 160 ? `${p.summary.slice(0, 157)}...` : p.summary,
    category: p.category,
    categorySlug: p.categorySlug,
    image: p.image,
    cardImage: p.cardImage ?? p.image,
    sortDate: p.date,
  }));
}

/** Arama için Türkçe karakterleri ASCII karşılıklarına çevirir (ş→s, ı→i vb.) */
function normalizeForSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i");
}

function filterByQuery(items: GuideListItem[], q: string): GuideListItem[] {
  const term = normalizeForSearch(q.trim());
  if (!term) return items;
  return items.filter((item) => {
    const title = normalizeForSearch(item.title);
    const summary = normalizeForSearch(item.summary);
    const category = normalizeForSearch(item.category);
    const slug = normalizeForSearch(item.slug);
    return title.includes(term) || summary.includes(term) || category.includes(term) || slug.includes(term);
  });
}

export default async function GuidePage({ searchParams }: GuidePageProps) {
  const params = await searchParams;
  const pageSize = 6;
  const query = (params?.q ?? "").trim();

  const [dbItems, staticItems] = await Promise.all([
    getPublishedArticles(),
    Promise.resolve(blogPostsToGuideList(blogPosts)),
  ]);
  const merged = [...dbItems, ...staticItems].sort(
    (a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime()
  );
  const filteredPosts = filterByQuery(merged, query);

  const currentPage = Math.max(1, Number(params?.page ?? "1") || 1);
  const totalItems = filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = (currentPage - 1) * pageSize;
  const visiblePosts = filteredPosts.slice(start, start + pageSize);

  return (
    <div className="space-y-8 px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-10">
      <section className="space-y-3">
        <BreadcrumbBlock
          items={[
            { label: "Anasayfa", href: "/" },
            { label: "Rehber" },
          ]}
        />
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Rehber</h1>
            <p className="text-sm text-muted-foreground">
              Hukuki konularda sade ve pratik anlatımlar.
            </p>
          </div>
          <div className="w-full md:w-[360px]">
            <SearchBar
              placeholder="Rehber içinde ara"
              size="sm"
              searchPath="/rehber"
              initialQuery={query}
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        {query && totalItems === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            &quot;{query}&quot; aramasıyla eşleşen rehber yazısı bulunamadı.
          </p>
        ) : totalItems === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            Henüz rehber yazısı eklenmemiş.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {visiblePosts.map((post, i) => (
              <BlogTeaserCard key={`${post.categorySlug}-${post.slug}-${start + i}`} post={post} useDetailImage />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            <span className="shrink-0">
              Sayfa {currentPage} / {totalPages}
            </span>
            <div className="flex shrink-0 items-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={
                    currentPage === 2
                      ? (query ? `/rehber?q=${encodeURIComponent(query)}` : "/rehber")
                      : `/rehber?page=${currentPage - 1}${query ? `&q=${encodeURIComponent(query)}` : ""}`
                  }
                  className="rounded-md border px-3 py-1 hover:border-foreground"
                >
                  Önceki
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={`/rehber?page=${currentPage + 1}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                  className="rounded-md border px-3 py-1 hover:border-foreground"
                >
                  Sonraki
                </Link>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
