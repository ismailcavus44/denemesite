import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

/** Sayfa içinde sabit konum için: aynı alt boşluk (mb-6). Breadcrumb + alt margin tek blok. */
const BREADCRUMB_BLOCK_MB = "mb-6";

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
              {!isLast ? <span>/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Breadcrumb'ı sayfa başında tutarlı konumda kullanmak için: aynı alt boşluk. Tüm breadcrumb sayfalarında bu wrapper kullanılır. */
export function BreadcrumbBlock({ items }: BreadcrumbProps) {
  return (
    <div className={BREADCRUMB_BLOCK_MB}>
      <Breadcrumb items={items} />
    </div>
  );
}
