import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Linkedin, Instagram } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { getAuthorBySlug } from "@/lib/authors";
import { getGuidesByAuthor } from "@/lib/content";
import { BreadcrumbBlock } from "@/components/breadcrumb";
import { BlogTeaserCard } from "@/components/blog-teaser-card";
import { siteConfig } from "@/lib/site";
import type { BlogPost } from "@/lib/blog-data";
import {
  formatAuthorDisplayName,
  formatBarRegistrationLine,
  resolveAuthorEeat,
  type AuthorEeatFields,
} from "@/lib/author-profile";
import { AuthorPersonSchema } from "@/components/schemas/AuthorPersonSchema";
import { VerifiedBadge } from "@/components/verified-badge";

const PAGE_SIZE = 6;

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export const revalidate = 3600;

/** Supabase'den slug ile yazar çeker. */
async function getAuthorFromDb(slug: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("authors")
    .select(
      "id,name,slug,bio,photo_url,title,bar_name,bar_registration,sameas_links,linkedin_url,instagram_url,whatsapp_url"
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return data as AuthorEeatFields & {
    id: string;
    name: string;
    slug: string;
    bio: string | null;
    photo_url: string | null;
  };
}

/** Bu yazarın yayındaki makalelerini Supabase'den çeker. */
async function getArticlesByAuthorId(authorId: string): Promise<BlogPost[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("articles")
    .select("title, slug, category, meta_description, featured_image_url, updated_at")
    .eq("author_id", authorId)
    .eq("status", "published")
    .not("category", "is", null)
    .order("updated_at", { ascending: false });
  if (!data?.length) return [];
  return data.map((a) => {
    const row = a as { title: string; slug: string; category: string; meta_description?: string | null; featured_image_url?: string | null };
    const summary = row.meta_description?.trim() || "";
    return {
      slug: row.slug,
      title: row.title,
      summary: summary.length > 160 ? `${summary.slice(0, 157)}...` : summary,
      category: row.category,
      categorySlug: row.category,
      date: (a as { updated_at?: string }).updated_at ?? "",
      readTime: "",
      image: row.featured_image_url ?? undefined,
      cardImage: row.featured_image_url ?? undefined,
      content: [],
    };
  }) as BlogPost[];
}

const META_SITE_NAME = "Yasal Haklarınız";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbAuthor = await getAuthorFromDb(slug);
  if (dbAuthor) {
    const title = `${dbAuthor.name} | ${META_SITE_NAME}`;
    const description = dbAuthor.bio ?? undefined;
    const url = `${siteConfig.url}/yazar/${slug}`;
    return { title: { absolute: title }, description, openGraph: { title, description, url }, twitter: { card: "summary_large_image", title, description }, alternates: { canonical: url } };
  }
  const author = getAuthorBySlug(slug);
  if (!author) return { title: { absolute: "Yazar bulunamadı" } };
  const displayName = (author.title ? `${author.title} ` : "") + author.name;
  const title = `${displayName} | ${META_SITE_NAME}`;
  const description = author.bio;
  const url = `${siteConfig.url}/yazar/${slug}`;
  return { title: { absolute: title }, description, openGraph: { title, description, url }, twitter: { card: "summary_large_image", title, description }, alternates: { canonical: url } };
}

export default async function AuthorPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

  const [dbAuthor, staticAuthor] = await Promise.all([
    getAuthorFromDb(slug),
    Promise.resolve(getAuthorBySlug(slug)),
  ]);

  const author = dbAuthor ?? staticAuthor;
  if (!author) notFound();

  const isDbAuthor = !!dbAuthor;
  const eeat = resolveAuthorEeat(
    slug,
    isDbAuthor ? dbAuthor : null,
    staticAuthor ?? null
  );
  const displayName = isDbAuthor
    ? formatAuthorDisplayName(dbAuthor.name, eeat.title)
    : formatAuthorDisplayName(
        staticAuthor!.name,
        staticAuthor!.title ?? eeat.title
      );
  const barLine = formatBarRegistrationLine(eeat.barName, eeat.barRegistration);
  const bio = isDbAuthor ? (dbAuthor.bio ?? "") : staticAuthor!.bio;
  const photoUrl = isDbAuthor ? dbAuthor.photo_url : staticAuthor!.image;
  const authorPageUrl = `${siteConfig.url.replace(/\/$/, "")}/yazar/${slug}`;
  const socials = isDbAuthor
    ? (dbAuthor.linkedin_url || dbAuthor.instagram_url || dbAuthor.whatsapp_url
        ? { linkedin: dbAuthor.linkedin_url ?? undefined, instagram: dbAuthor.instagram_url ?? undefined, whatsapp: dbAuthor.whatsapp_url ?? undefined }
        : undefined)
    : staticAuthor!.socials;

  let allGuides: BlogPost[];
  if (isDbAuthor) {
    const dbArticles = await getArticlesByAuthorId(dbAuthor.id);
    const staticGuides = getGuidesByAuthor(slug);
    const seen = new Set<string>();
    const merged: BlogPost[] = [];
    for (const a of dbArticles) {
      const k = `${a.categorySlug}-${a.slug}`;
      if (!seen.has(k)) {
        seen.add(k);
        merged.push(a);
      }
    }
    for (const a of staticGuides) {
      const k = `${a.categorySlug}-${a.slug}`;
      if (!seen.has(k)) {
        seen.add(k);
        merged.push(a);
      }
    }
    allGuides = merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else {
    allGuides = getGuidesByAuthor(slug);
  }

  const totalPages = Math.max(1, Math.ceil(allGuides.length / PAGE_SIZE));
  const page = Math.max(1, parseInt(String(pageParam), 10) || 1);
  const currentPage = Math.min(page, totalPages);
  const from = (currentPage - 1) * PAGE_SIZE;
  const guides = allGuides.slice(from, from + PAGE_SIZE);
  const basePath = `/yazar/${slug}`;

  const breadcrumbItems = [
    { label: "Anasayfa", href: "/" },
    { label: displayName },
  ];

  return (
    <>
      <AuthorPersonSchema
        name={displayName}
        url={authorPageUrl}
        jobTitle={eeat.title}
        sameAs={eeat.sameAs.length > 0 ? eeat.sameAs : undefined}
      />
      <div className="mx-auto max-w-6xl space-y-8 px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-10">
      <header>
        <BreadcrumbBlock items={breadcrumbItems} />
        <section className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-slate-200 sm:h-28 sm:w-28">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={displayName}
                fill
                className="object-cover"
                sizes="96px"
                unoptimized={photoUrl.startsWith(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-500">
                {displayName.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
            <h1 className="inline-flex items-center justify-center gap-1.5 font-bold text-slate-900 sm:justify-start" style={{ fontSize: "22px" }}>
              {displayName}
              <VerifiedBadge size={22} className="shrink-0" />
            </h1>
            {barLine ? (
              <p className="text-sm font-medium text-slate-700">{barLine}</p>
            ) : null}
            <p className="text-slate-600" style={{ fontSize: "15px" }}>
              {bio}
            </p>
            {socials && (socials.linkedin || socials.instagram) && (
              <div className="flex flex-wrap justify-center gap-3 pt-1 sm:justify-start">
                {socials.linkedin && (
                  <Link href={socials.linkedin} target="_blank" rel="noopener noreferrer nofollow" className="text-slate-500 hover:text-primary" aria-label="LinkedIn">
                    <Linkedin size={20} />
                  </Link>
                )}
                {socials.instagram && (
                  <Link href={socials.instagram} target="_blank" rel="noopener noreferrer nofollow" className="text-slate-500 hover:text-primary" aria-label="Instagram">
                    <Instagram size={20} />
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      </header>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Yazarın Makaleleri</h2>
        {allGuides.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((post) => (
                <BlogTeaserCard
                  key={`${post.categorySlug}-${post.slug}`}
                  post={post}
                  basePath={`/${post.categorySlug}/rehber`}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="mt-6 flex flex-wrap items-center justify-center gap-2 pt-4" aria-label="Sayfa navigasyonu">
                {currentPage > 1 ? (
                  <Link href={currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Önceki
                  </Link>
                ) : (
                  <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-400">Önceki</span>
                )}
                <span className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
                    p === currentPage ? (
                      <span key={p} className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-medium text-white" aria-current="page">
                        {p}
                      </span>
                    ) : (
                      <Link key={p} href={p === 1 ? basePath : `${basePath}?page=${p}`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        {p}
                      </Link>
                    )
                  )}
                </span>
                {currentPage < totalPages ? (
                  <Link href={`${basePath}?page=${currentPage + 1}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Sonraki
                  </Link>
                ) : (
                  <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-400">Sonraki</span>
                )}
              </nav>
            )}
          </>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
            Bu yazara ait rehber yazısı bulunmuyor.
          </p>
        )}
      </section>
    </div>
    </>
  );
}
