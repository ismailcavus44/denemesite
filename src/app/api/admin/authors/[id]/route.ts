import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import type { AuthorUpdate } from "@/types/author";

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
  const row: AuthorUpdate = {};
  if (typeof b.name === "string") row.name = b.name.trim();
  if (typeof b.slug === "string") row.slug = b.slug.trim().toLowerCase().replace(/\s+/g, "-");
  if (b.bio !== undefined) row.bio = typeof b.bio === "string" ? b.bio.trim() || null : null;
  if (b.photo_url !== undefined) row.photo_url = typeof b.photo_url === "string" ? b.photo_url || null : null;
  if (b.linkedin_url !== undefined) row.linkedin_url = typeof b.linkedin_url === "string" ? b.linkedin_url.trim() || null : null;
  if (b.instagram_url !== undefined) row.instagram_url = typeof b.instagram_url === "string" ? b.instagram_url.trim() || null : null;
  if (b.whatsapp_url !== undefined) row.whatsapp_url = typeof b.whatsapp_url === "string" ? b.whatsapp_url.trim() || null : null;

  if (Object.keys(row).length === 0) {
    return NextResponse.json({ message: "Güncellenecek alan yok." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("authors").update(row).eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ message: "Bu slug zaten kullanılıyor." }, { status: 409 });
    }
    return NextResponse.json(
      { message: error.message ?? "Güncellenemedi." },
      { status: 500 }
    );
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
  const { error } = await supabase.from("authors").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { message: error.message ?? "Yazar silinemedi." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
