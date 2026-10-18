import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Author } from "@/lib/authors";
import { formatAuthorDisplayName, formatBarRegistrationLine, resolveAuthorEeat } from "@/lib/author-profile";
import { formatTurkishLongDate } from "@/lib/format-date";

export type LatestArticleItem = {
  slug: string;
  title: string;
  categorySlug: string;
  categoryName: string;
  date: string | null;
};

export type CategoryCardItem = {
  slug: string;
  name: string;
  count: number;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-xl font-semibold">
      <span className="h-5 w-1 rounded-full bg-primary" />
      {children}
    </h2>
  );
}

/** Ana sayfa: en yeni rehber yazıları (başlık, kategori, tarih). */
export function LatestArticles({ items }: { items: LatestArticleItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="space-y-4">
      <SectionTitle>Son Yazılar</SectionTitle>
      <ul className="grid gap-x-8 md:grid-cols-2">
        {items.map((a) => (
          <li key={`${a.categorySlug}-${a.slug}`} className="border-b border-slate-200/70">
            <Link
              href={`/${a.categorySlug}/rehber/${a.slug}`}
              className="group flex flex-col gap-1 py-4"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-primary">
                {a.categoryName}
                {a.date && <span className="ml-2 font-normal normal-case tracking-normal text-muted-foreground">· {formatTurkishLongDate(a.date)}</span>}
              </span>
              <span className="text-[16px] font-semibold text-foreground group-hover:underline">
                {a.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Ana sayfa: yazı bulunan hukuk alanları. */
export function CategoryCards({ items }: { items: CategoryCardItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="space-y-4">
      <SectionTitle>Hukuk Alanları</SectionTitle>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((c) => (
          <Link
            key={c.slug}
            href={`/${c.slug}`}
            className="group flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-primary/40"
          >
            <span className="text-[16px] font-semibold text-foreground">{c.name}</span>
            <span className="flex items-center justify-between text-sm text-muted-foreground">
              {c.count} yazı
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Ana sayfa: yazıları hazırlayan avukat (iletişim linki yok, sadece profil). */
export function AuthorIntro({ author }: { author: Author }) {
  const eeat = resolveAuthorEeat(author.slug, null, author);
  const displayName = formatAuthorDisplayName(author.name, eeat.title);
  const barLine = formatBarRegistrationLine(eeat.barName, eeat.barRegistration);

  return (
    <section className="space-y-4">
      <SectionTitle>Yazılarımızı Kim Hazırlıyor?</SectionTitle>
      <div className="flex flex-col items-center gap-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-center sm:flex-row sm:items-start sm:text-left">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-slate-200">
          {author.image && (
            <Image src={author.image} alt={displayName} fill className="object-cover" sizes="96px" />
          )}
        </div>
        <div className="space-y-2">
          <div>
            <p className="text-lg font-bold text-slate-900">{displayName}</p>
            {barLine && <p className="text-sm text-slate-500">{barLine}</p>}
          </div>
          <p className="text-[15px] leading-relaxed text-slate-600">{author.bio}</p>
          <Link
            href={`/yazar/${author.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Yazarın tüm yazıları
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
