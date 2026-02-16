import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Linkedin, Instagram } from "lucide-react";
import { getAuthorBySlug } from "@/lib/authors";
import { getGuidesByAuthor } from "@/lib/content";
import { BreadcrumbBlock } from "@/components/breadcrumb";
import { BlogTeaserCard } from "@/components/blog-teaser-card";
import { siteConfig } from "@/lib/site";

const PAGE_SIZE = 6;

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return { title: "Yazar bulunamadı" };
  const title = `${author.title ? `${author.title} ` : ""}${author.name} | ${siteConfig.name}`;
  const description = author.bio;
  const url = `${siteConfig.url}/yazar/${slug}`;
  return {
    title,
    description,
    openGraph: { title, description, url },
    alternates: { canonical: url },
  };
}

export default async function AuthorPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const allGuides = getGuidesByAuthor(slug);
  const totalPages = Math.max(1, Math.ceil(allGuides.length / PAGE_SIZE));
  const page = Math.max(1, parseInt(String(pageParam), 10) || 1);
  const currentPage = Math.min(page, totalPages);
  const from = (currentPage - 1) * PAGE_SIZE;
  const guides = allGuides.slice(from, from + PAGE_SIZE);
  const displayName = author.title ? `${author.title} ${author.name}` : author.name;

  const basePath = `/yazar/${slug}`;

  const breadcrumbItems = [
    { label: "Anasayfa", href: "/" },
    { label: displayName },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-10">
      {/* Yazar kartı (resim, isim, bio) tüm sayfalarda (page=1,2,...) sabit kalır */}
      <header>
        <BreadcrumbBlock items={breadcrumbItems} />
        <section className="flex flex-wrap items-center gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-slate-200">
            {author.image ? (
              <Image
                src={author.image}
                alt={author.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-500">
                {author.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <h1 className="font-bold text-slate-900" style={{ fontSize: "22px" }}>
              {displayName}
            </h1>
            <p className="text-slate-600" style={{ fontSize: "15px" }}>
              {author.bio}
            </p>
            {author.socials && (author.socials.linkedin || author.socials.instagram || author.socials.whatsapp) && (
              <div className="flex flex-wrap gap-3 pt-1">
                {author.socials.linkedin && (
                  <Link
                    href={author.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-slate-500 hover:text-primary"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </Link>
                )}
                {author.socials.instagram && (
                  <Link
                    href={author.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-slate-500 hover:text-primary"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </Link>
                )}
                {author.socials.whatsapp && (
                  <Link
                    href={author.socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-slate-500 hover:text-primary"
                    aria-label="WhatsApp"
                  >
                    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
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
                  key={post.slug}
                  post={post}
                  basePath={`/${post.categorySlug}/rehber`}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <nav
                className="mt-6 flex flex-wrap items-center justify-center gap-2 pt-4"
                aria-label="Sayfa navigasyonu"
              >
                {currentPage > 1 ? (
                  <Link
                    href={currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Önceki
                  </Link>
                ) : (
                  <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-400">
                    Önceki
                  </span>
                )}
                <span className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
                    p === currentPage ? (
                      <span
                        key={p}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-medium text-white"
                        aria-current="page"
                      >
                        {p}
                      </span>
                    ) : (
                      <Link
                        key={p}
                        href={p === 1 ? basePath : `${basePath}?page=${p}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        {p}
                      </Link>
                    )
                  )}
                </span>
                {currentPage < totalPages ? (
                  <Link
                    href={`${basePath}?page=${currentPage + 1}`}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Sonraki
                  </Link>
                ) : (
                  <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-400">
                    Sonraki
                  </span>
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
  );
}
