import Link from "next/link";
import type { TopLinkItem } from "@/lib/content";

type CategoryTopLinksProps = {
  categorySlug: string;
  links: TopLinkItem[];
};

function href(categorySlug: string, item: TopLinkItem): string {
  return item.type === "rehber"
    ? `/${categorySlug}/rehber/${item.slug}`
    : `/${categorySlug}/soru/${item.slug}`;
}

export function CategoryTopLinks({ categorySlug, links }: CategoryTopLinksProps) {
  if (links.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">
        Bu kategoride en çok aranan konular
      </h2>
      <div className="flex flex-wrap gap-2">
        {links.map((item) => (
          <Link
            key={`${item.type}-${item.slug}`}
            href={href(categorySlug, item)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:border-primary/30 hover:text-primary"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
