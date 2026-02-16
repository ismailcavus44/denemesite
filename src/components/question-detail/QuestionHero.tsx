import { BreadcrumbBlock } from "@/components/breadcrumb";

type BreadcrumbItem = { label: string; href?: string };

type QuestionHeroProps = {
  title: string;
  category?: { name: string; slug: string } | null;
  publishedAt?: string | null;
  readingMinutes?: number;
  /** Topic silo: verilirse breadcrumb Anasayfa > Kategori > Soru > başlık */
  breadcrumbItems?: BreadcrumbItem[];
};

export function QuestionHero({
  title,
  publishedAt,
  readingMinutes = 4,
  breadcrumbItems,
}: QuestionHeroProps) {
  const defaultBreadcrumb: BreadcrumbItem[] = [
    { label: "Anasayfa", href: "/" },
    { label: "Sorular", href: "/sorular" },
    { label: title },
  ];
  const items = breadcrumbItems ?? defaultBreadcrumb;

  return (
    <section className="space-y-3">
      <BreadcrumbBlock items={items} />

      <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl">
        {title}
      </h1>
    </section>
  );
}
