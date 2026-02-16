import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog-data";

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  const dateLabel = new Date(post.date).toLocaleDateString("tr-TR");

  return (
    <Card className="transition hover:border-foreground/20">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{dateLabel}</span>
          <span>{post.readTime}</span>
        </div>
        <Link href={`/rehber/${post.slug}`} className="text-lg font-semibold">
          {post.title}
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{post.summary}</p>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{post.category}</Badge>
          <Link
            href={`/rehber/${post.slug}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Devamını oku →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
