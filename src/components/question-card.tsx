import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type QuestionCardProps = {
  title: string;
  slug: string;
  category?: { name: string; slug: string } | null;
  /** Tarih artık kartlarda gösterilmiyor; API uyumluluğu için bırakıldı */
  createdAt?: string | null;
  /** Anasayfada gösterilen kısa özet (sadece anasayfada dolu, sorular sayfasında yok) */
  summaryText?: string | null;
  /** Topic silo: /[categorySlug]/soru/[slug]. Verilmezse eski /soru/[slug] kullanılır. */
  categorySlug?: string | null;
  /** Küçük boyut (örn. Benzer Sorular bölümü) */
  compact?: boolean;
};

export function QuestionCard({
  title,
  slug,
  category,
  createdAt,
  summaryText,
  categorySlug,
  compact,
}: QuestionCardProps) {
  const questionHref = categorySlug ? `/${categorySlug}/soru/${slug}` : `/soru/${slug}`;
  const categoryHref = category?.slug ? `/${category.slug}` : undefined;

  return (
    <Card className={`flex h-full flex-col border shadow-none transition hover:border-foreground/20 ${compact ? "rounded-[6px] gap-2 py-3" : "rounded-[4px]"}`}>
      <CardHeader className={compact ? "space-y-1.5 px-3 py-0" : "space-y-3"}>
        {(category && categoryHref) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className={compact ? "text-[10px] px-1.5 py-0" : ""}>
              <Link href={categoryHref}>{category.name}</Link>
            </Badge>
          </div>
        )}
        <Link href={questionHref} className={`break-words font-semibold ${compact ? "text-sm" : "text-base sm:text-lg"}`}>
          {title}
        </Link>
        {summaryText && (
          <p className={compact ? "text-xs text-muted-foreground line-clamp-2" : "text-sm text-muted-foreground"}>{summaryText}</p>
        )}
      </CardHeader>
      <CardContent className={`mt-auto flex items-center justify-end pt-0 ${compact ? "px-3 pb-0" : ""}`}>
        <Link
          href={questionHref}
          className={compact ? "text-xs text-muted-foreground hover:text-foreground" : "text-sm text-muted-foreground hover:text-foreground"}
        >
          Devamını oku →
        </Link>
      </CardContent>
    </Card>
  );
}
