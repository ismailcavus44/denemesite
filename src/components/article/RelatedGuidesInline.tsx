import Link from "next/link";

type RelatedGuidesInlineProps = {
  guides: { title: string; href: string }[];
  allGuidesUrl: string;
  categoryName: string;
};

/** Yazı sonu ilgili rehberler: kenar çubuğu mobilde gizli olduğu için iç linkler burada da verilir. */
export function RelatedGuidesInline({ guides, allGuidesUrl, categoryName }: RelatedGuidesInlineProps) {
  if (guides.length === 0) return null;
  return (
    <nav aria-labelledby="ilgili-rehberler" className="rounded-[6px] border border-slate-200 bg-white p-5 md:hidden">
      <h2 id="ilgili-rehberler" className="flex items-center gap-2 text-base font-bold text-slate-900">
        <span className="h-5 w-1 shrink-0 rounded-full bg-slate-800" aria-hidden />
        İlgili Rehberler
      </h2>
      <ul className="mt-3 divide-y divide-slate-100">
        {guides.map((g) => (
          <li key={g.href}>
            <Link href={g.href} className="block py-3 text-[14px] font-medium text-slate-800 hover:text-primary">
              {g.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link href={allGuidesUrl} className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
        Tüm {categoryName} rehberleri →
      </Link>
    </nav>
  );
}
