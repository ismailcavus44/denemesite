import Link from "next/link";
import { BreadcrumbBlock } from "@/components/breadcrumb";

type CategoryHeroProps = {
  categorySlug: string;
  categoryName: string;
  intro: string | null;
  breadcrumbItems: { label: string; href?: string }[];
};

export function CategoryHero({
  categorySlug,
  categoryName,
  intro,
  breadcrumbItems,
}: CategoryHeroProps) {
  return (
    <header className="flex flex-col items-center text-center">
      <div className="w-full max-w-[592px] space-y-3 text-left">
        <BreadcrumbBlock items={breadcrumbItems} />
        <h1 className="text-[24px] font-bold leading-tight text-slate-900">
          {categoryName}
        </h1>
        {intro && (
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            {intro}
          </p>
        )}
      </div>
    </header>
  );
}
