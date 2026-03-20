import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { notifyGoogleIndexing } from "@/lib/googleIndexing";
import { siteConfig } from "@/lib/site";
import type { ArticleUpdate } from "@/types/article";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "ID gerekli." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Geçersiz JSON." }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const row: ArticleUpdate = {};

  if (typeof b.title === "string") row.title = b.title.trim();
  if (typeof b.slug === "string") row.slug = b.slug.trim().toLowerCase().replace(/\s+/g, "-");
  if (b.category !== undefined)
    row.category = typeof b.category === "string" && b.category.trim() ? b.category.trim() : null;
  if (b.author_id !== undefined)
    row.author_id = typeof b.author_id === "string" && b.author_id.trim() ? b.author_id.trim() : null;
  if (typeof b.content === "string") row.content = b.content;
  if (b.meta_title !== undefined)
    row.meta_title = typeof b.meta_title === "string" ? b.meta_title.trim() || null : null;
  if (b.meta_description !== undefined)
    row.meta_description =
      typeof b.meta_description === "string" ? b.meta_description.trim() || null : null;
  if (b.featured_image_url !== undefined)
    row.featured_image_url =
      typeof b.featured_image_url === "string" ? b.featured_image_url || null : null;
  if (b.featured_image_alt !== undefined)
    row.featured_image_alt =
      typeof b.featured_image_alt === "string" ? b.featured_image_alt.trim() || null : null;
  if (b.faq !== undefined) row.faq = Array.isArray(b.faq) ? b.faq : [];
  if (b.status === "published" || b.status === "draft") row.status = b.status;

  if (Object.keys(row).length === 0) {
    return NextResponse.json({ message: "Güncellenecek alan yok." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  const { data: existing } = await supabase
    .from("articles")
    .select("slug,category,status")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("articles").update(row).eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ message: "Bu slug zaten kullanılıyor." }, { status: 409 });
    }
    return NextResponse.json(
      { message: error.message ?? "Güncellenemedi." },
      { status: 500 }
    );
  }

  const finalStatus = row.status ?? existing?.status;
  const finalSlug = row.slug ?? existing?.slug;
  const finalCategory = row.category ?? existing?.category;
  if (finalStatus === "published" && finalSlug && finalCategory) {
    revalidatePath(`/${finalCategory}/rehber/${finalSlug}`);
    revalidatePath(`/${finalCategory}/rehber`);
    revalidatePath("/rehber");
    if (existing?.slug && existing.slug !== finalSlug) {
      revalidatePath(`/${finalCategory}/rehber/${existing.slug}`);
    }
    const fullUrl = `${siteConfig.url.replace(/\/$/, "")}/${finalCategory}/rehber/${finalSlug}`;
    notifyGoogleIndexing(fullUrl).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminFromRequest(_request);
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "ID gerekli." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { message: error.message ?? "Silinemedi." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
