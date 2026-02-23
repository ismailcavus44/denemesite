import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { blogPosts } from "@/lib/blog-data";
import { contentBlocksToHtml } from "@/lib/contentBlocksToHtml";

/** İlk 2 statik rehberi (blog-data) Supabase articles tablosuna tek seferlik ekler. */
export async function POST(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  const supabase = createSupabaseAdminClient();
  const toInsert = blogPosts.slice(0, 2).map((post) => {
    const content = post.contentBlocks
      ? contentBlocksToHtml(post.contentBlocks)
      : (post.content && post.content[0]) || "";
    return {
      title: post.title,
      slug: post.slug,
      category: post.categorySlug,
      content,
      meta_title: post.seoTitle ?? post.title,
      meta_description: post.seoDescription ?? post.summary?.slice(0, 160) ?? null,
      featured_image_url: null,
      featured_image_alt: null,
      status: "published" as const,
    };
  });

  const { error } = await supabase.from("articles").upsert(toInsert, {
    onConflict: "category,slug",
    ignoreDuplicates: false,
  });

  if (error) {
    return NextResponse.json(
      { message: error.message ?? "Makaleler eklenirken hata oluştu." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: `${toInsert.length} makale eklendi/güncellendi.`,
    slugs: toInsert.map((r) => r.slug),
  });
}
