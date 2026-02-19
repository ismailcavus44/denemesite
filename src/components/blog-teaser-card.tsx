import Link from "next/link";
import type { BlogPost } from "@/lib/blog-data";

type BlogTeaserCardProps = {
  post: BlogPost;
  /** Topic silo base path, örn. /miras-hukuku/rehber. Verilmezse /rehber/[slug]. */
  basePath?: string;
  /** true = rehber listesinde, asıl (detay) görsel kullanılır. false = anasayfa, kart görseli (cardImage) kullanılır. */
  useDetailImage?: boolean;
};

export function BlogTeaserCard({ post, basePath, useDetailImage }: BlogTeaserCardProps) {
  const href = basePath ? `${basePath}/${post.slug}` : `/${post.categorySlug}/rehber/${post.slug}`;
  const imageSrc = useDetailImage ? post.image : (post.cardImage ?? post.image);
  const teaser =
    post.summary.length > 150
      ? `${post.summary.slice(0, 147)}...`
      : post.summary;

  return (
    <Link
      href={href}
      className="group relative cursor-pointer rounded-xl bg-card p-4"
    >
      {/* Hover overlay – karttan biraz daha büyük, %25 civarı taşma efekti */}
      <span className="pointer-events-none absolute inset-0 -m-3 rounded-2xl bg-primary/5 opacity-0 transition group-hover:opacity-100" />

      <div
        className={`relative w-full overflow-hidden rounded-[6px] bg-muted ${
          useDetailImage ? "h-[180px]" : "h-[106px]"
        }`}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Görsel
          </div>
        )}
      </div>
      <div className="relative mt-4 space-y-2">
        <h3 className="break-words text-lg font-semibold leading-snug transition-colors group-hover:text-primary sm:text-[22px]">
          {post.title}
        </h3>
        <div className="space-y-2 text-[16px] text-muted-foreground">
          <p>{teaser}</p>
          <span className="block h-1 w-10 rounded-full bg-primary" />
        </div>
      </div>
    </Link>
  );
}
