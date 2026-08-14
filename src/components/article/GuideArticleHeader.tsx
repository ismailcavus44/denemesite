"use client";

import Image from "next/image";
import Link from "next/link";
import { ArticleShare } from "@/components/article/ArticleShare";
import { GooglePreferredSource } from "@/components/article/GooglePreferredSource";
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
};

export function GuideArticleHeader({ title, date, author }: GuideArticleHeaderProps) {
  const formatted = formatTurkishLongDate(date);
  const displayName = author
    ? formatAuthorDisplayName(author.name, author.title)
    : undefined;

  return (
    <header>
      <h1 className="text-center text-3xl font-semibold text-slate-900">{title}</h1>
      <div className="mt-6 border-b-[0.5px] border-slate-300 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {author ? (
              <div className="flex min-w-0 items-center gap-3">
                <Link href={`/yazar/${author.slug}`} className="flex min-w-0 items-center gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-slate-200 ring-[0.5px] ring-slate-300">
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
                  </div>
                  <span className="inline-flex min-w-0 items-center gap-1 text-sm text-slate-900">
                    <span className="truncate">{displayName}</span>
                    <VerifiedBadge size={14} className="shrink-0" />
                  </span>
                </Link>
                {formatted ? (
                  <p className="min-w-0 text-sm">
                    <span className="text-slate-500"> | </span>
                    <time className="text-slate-500" dateTime={date}>
                      {formatted}
                    </time>
                  </p>
                ) : null}
              </div>
            ) : formatted ? (
              <p className="text-sm text-slate-500">
                <time dateTime={date}>{formatted}</time>
              </p>
            ) : null}
          </div>
          <ArticleShare />
        </div>
        <GooglePreferredSource />
      </div>
    </header>
  );
}
