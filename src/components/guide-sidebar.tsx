import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/lib/blog-data";

type GuideSidebarProps = {
  category: string;
  dateLabel: string;
  readTime: string;
};

export function GuideSidebar({ category, dateLabel, readTime }: GuideSidebarProps) {
  const popular = blogPosts.slice(0, 4);

  return (
    <aside className="space-y-4 text-sm">
      {/* Yazar kartı */}
      <div className="space-y-3 rounded-[4px] border bg-background p-4 text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-muted" />
        <div className="space-y-1">
          <p className="text-[16px] font-semibold">YasalHaklariniz</p>
          <p className="text-[14px] text-muted-foreground">
            Hukuki sorular için sade, anlaşılır ve yoruma açık olmayan bilgilendirme
            içerikleri hazırlayan editör ekibi.
          </p>
        </div>
        <div className="flex justify-center gap-2 pt-1 text-[14px]">
          <Link
            href="/soru-sor"
            className="inline-flex h-8 items-center justify-center rounded-[4px] bg-primary px-3 text-primary-foreground"
          >
            Soru Sor
          </Link>
          <Link
            href="/hakkimizda"
            className="inline-flex h-8 items-center justify-center rounded-[4px] bg-[#D85A5A] px-3 text-white"
          >
            Hakkımızda
          </Link>
        </div>
      </div>

      {/* Mevcut yazı bilgisi */}
      <div className="space-y-3 rounded-[4px] border bg-muted/40 p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary">{category}</Badge>
          <span>{dateLabel}</span>
          <span>{readTime}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Bu yazı genel bilgilendirme içindir; kendi durumun için profesyonel destek alman
          gerekebilir.
        </p>
      </div>

      {/* En çok okunan rehberler */}
      <div className="space-y-3 p-1">
        <h2 className="text-sm font-semibold">En Çok Okunan Rehberler</h2>
        <ul className="space-y-3 text-muted-foreground">
          {popular.map((post) => (
            <li key={post.slug} className="flex items-center gap-2">
              <div className="flex h-full flex-col items-center justify-center">
                <span className="h-6 w-px bg-muted-foreground/30" />
                <span className="mt-0 h-2 w-2 rounded-full bg-primary" />
              </div>
              <Link
                href={`/rehber/${post.slug}`}
                className="cursor-pointer text-[16px] underline-offset-4 hover:underline"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

