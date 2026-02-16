import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts, type BlogPost } from "@/lib/blog-data";
import { SearchBar } from "@/components/search-bar";
import { BreadcrumbBlock } from "@/components/breadcrumb";
import { BlogTeaserCard } from "@/components/blog-teaser-card";

export const metadata: Metadata = {
  title: "Rehber",
  description:
    "Miras, boşanma, iş hukuku ve icra konularında sade ve anlaşılır hukuki rehber yazıları. Editör onaylı bilgilendirme içerikleri.",
};

type GuidePageProps = {
  searchParams?: Promise<{ page?: string; q?: string }>;
};

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

function filterPostsByQuery(posts: BlogPost[], q: string): BlogPost[] {
  const term = normalizeForSearch(q.trim());
  if (!term) return posts;
  return posts.filter((post) => {
    const title = normalizeForSearch(post.title);
    const summary = normalizeForSearch(post.summary);
    const category = normalizeForSearch(post.category);
    const inTitle = title.includes(term);
    const inSummary = summary.includes(term);
    const inCategory = category.includes(term);
    const inContent = post.content.some((p) =>
      normalizeForSearch(p).includes(term),
    );
    return inTitle || inSummary || inCategory || inContent;
  });
}

export default async function GuidePage({ searchParams }: GuidePageProps) {
  const params = await searchParams;
  const pageSize = 6;
  const query = (params?.q ?? "").trim();
  const filteredPosts = filterPostsByQuery(blogPosts, query);
  const currentPage = Math.max(
    1,
    Number(params?.page ?? "1") || 1,
  );
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
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {visiblePosts.map((post) => (
              <BlogTeaserCard key={post.slug} post={post} />
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
