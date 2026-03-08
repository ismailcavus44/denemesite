import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import type { ArticleInsert } from "@/types/article";

export async function POST(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Geçersiz JSON." }, { status: 400 });
  }

  const {
    title,
    slug,
    category,
    author_id,
    content,
    meta_title,
    meta_description,
    featured_image_url,
    featured_image_alt,
    faq,
    status,
  } = body as Record<string, unknown>;

  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ message: "Başlık gerekli." }, { status: 400 });
  }
  if (typeof slug !== "string" || !slug.trim()) {
    return NextResponse.json({ message: "Slug gerekli." }, { status: 400 });
  }

  const categoryVal = typeof category === "string" && category.trim() ? category.trim() : null;

  const authorIdVal =
    typeof author_id === "string" && author_id.trim() ? author_id.trim() : null;

  const row: ArticleInsert = {
    title: title.trim(),
    slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
    category: categoryVal,
    author_id: authorIdVal,
    content: typeof content === "string" ? content : "",
    meta_title: typeof meta_title === "string" ? meta_title.trim() || null : null,
    meta_description:
      typeof meta_description === "string" ? meta_description.trim() || null : null,
    featured_image_url:
      typeof featured_image_url === "string" ? featured_image_url || null : null,
    featured_image_alt:
      typeof featured_image_alt === "string" ? featured_image_alt.trim() || null : null,
    faq: Array.isArray(faq) ? faq : [],
    status:
      status === "published" || status === "draft" ? status : "draft",
  };

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("articles").insert(row).select("id").single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ message: "Bu slug zaten kullanılıyor." }, { status: 409 });
    }
    return NextResponse.json(
      { message: error.message ?? "Kayıt oluşturulamadı." },
      { status: 500 }
    );
  }

  if (row.status === "published" && categoryVal) {
    revalidatePath(`/${categoryVal}/rehber/${row.slug}`);
    revalidatePath(`/${categoryVal}/rehber`);
    revalidatePath("/rehber");
  }

  return NextResponse.json({ id: data.id });
}
