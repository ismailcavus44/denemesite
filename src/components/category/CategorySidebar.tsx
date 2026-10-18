import Link from "next/link";
import { Button } from "@/components/ui/button";

type CategorySidebarProps = {
  categoryName: string;
};

export function CategorySidebar({ categoryName }: CategorySidebarProps) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-[6px] border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-bold text-slate-900">
          Daha fazlasını okuyun
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {categoryName} ve diğer hukuk alanlarındaki tüm rehber yazılarımıza
          göz atabilirsiniz.
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <Button asChild size="default" className="w-full bg-slate-800">
            <Link href="/rehber">Tüm rehberler</Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
