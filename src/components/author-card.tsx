import Image from "next/image";
import Link from "next/link";
import type { Author } from "@/lib/authors";

type AuthorCardProps = {
  author: Author;
  /** Yazar sayfasına link ver. Yoksa sadece kart. */
  linkToProfile?: boolean;
};

/** Rehber detay vb. sayfalarda kullanılan yazar kartı: görsel, isim, bio (sosyal medya yok). */
export function AuthorCard({ author, linkToProfile = true }: AuthorCardProps) {
  const displayName = author.title ? `${author.title} ${author.name}` : author.name;
  const profileHref = `/yazar/${author.slug}`;

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-[6px] border border-slate-200 bg-slate-50/50 p-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-slate-200">
        {author.image ? (
          <Image
            src={author.image}
            alt={author.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xl font-semibold text-slate-500">
            {author.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-bold text-slate-900" style={{ fontSize: "22px" }}>
          {displayName}
        </p>
        <p className="text-slate-600" style={{ fontSize: "15px" }}>
          {author.bio}
        </p>
        {linkToProfile && (
          <p className="pt-1 text-right">
            <Link
              href={profileHref}
              className="text-sm font-medium text-primary hover:underline"
            >
              Yazar sayfasına git →
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
