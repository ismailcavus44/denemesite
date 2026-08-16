"use client";

import Image from "next/image";
import Link from "next/link";
import { VerifiedBadge } from "@/components/verified-badge";
import { formatAuthorDisplayName } from "@/lib/author-profile";
import { formatTurkishLongDate } from "@/lib/format-date";

export type GuideArticleAuthor = {
  name: string;
  slug: string;
  photoUrl?: string | null;
  title?: string | null;
};

type GuideArticleHeaderProps = {
  title: string;
  date: string;
  author?: GuideArticleAuthor | null;
  categoryName?: string | null;
  categoryHref?: string | null;
};

export function GuideArticleHeader({
  title,
  date,
  author,
  categoryName,
  categoryHref,
}: GuideArticleHeaderProps) {
  const formatted = formatTurkishLongDate(date);
  const displayName = author
    ? formatAuthorDisplayName(author.name, author.title)
    : undefined;
  const categoryLabel = categoryName?.trim() || null;
  const categoryLink = categoryHref?.trim() || null;

  return (
    <header>
      <h1 className="text-center text-3xl font-semibold text-slate-900">{title}</h1>
      <div className="mt-6 border-b-[0.5px] border-slate-300 pb-4">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {author ? (
              <>
                <Link
                  href={`/yazar/${author.slug}`}
                  className="relative size-10 shrink-0 overflow-hidden rounded-full bg-slate-200 ring-[0.5px] ring-slate-300"
                >
                  {author.photoUrl ? (
                    <Image
                      src={author.photoUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-medium text-slate-500">
                      {author.name.charAt(0)}
                    </span>
                  )}
                </Link>
                <Link
                  href={`/yazar/${author.slug}`}
                  className="inline-flex min-w-0 items-center gap-1 text-sm text-slate-900"
                >
                  <span>{displayName}</span>
                  <VerifiedBadge size={14} className="shrink-0" />
                </Link>
              </>
            ) : null}
          </div>
          {formatted || categoryLabel ? (
            <p className="min-w-0 text-right text-sm text-slate-500">
              {formatted ? (
                <time dateTime={date}>{formatted}</time>
              ) : null}
              {formatted && categoryLabel ? (
                <span aria-hidden> | </span>
              ) : null}
              {categoryLabel ? (
                categoryLink ? (
                  <Link
                    href={categoryLink}
                    className="text-slate-500 no-underline hover:text-slate-900 hover:underline"
                  >
                    {categoryLabel}
                  </Link>
                ) : (
                  <span>{categoryLabel}</span>
                )
              ) : null}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
