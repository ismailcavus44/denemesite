import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import type { AuthorInsert } from "@/types/author";

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

  const { name, slug, bio, photo_url, linkedin_url, instagram_url, whatsapp_url } = body as Record<string, unknown>;
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ message: "İsim gerekli." }, { status: 400 });
  }
  if (typeof slug !== "string" || !slug.trim()) {
    return NextResponse.json({ message: "Slug gerekli." }, { status: 400 });
  }

  const row: AuthorInsert = {
    name: name.trim(),
    slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
    bio: typeof bio === "string" ? bio.trim() || null : null,
    photo_url: typeof photo_url === "string" ? photo_url || null : null,
    linkedin_url: typeof linkedin_url === "string" ? linkedin_url.trim() || null : null,
    instagram_url: typeof instagram_url === "string" ? instagram_url.trim() || null : null,
    whatsapp_url: typeof whatsapp_url === "string" ? whatsapp_url.trim() || null : null,
  };

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("authors").insert(row).select("id").single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ message: "Bu slug zaten kullanılıyor." }, { status: 409 });
    }
    return NextResponse.json(
      { message: error.message ?? "Kayıt oluşturulamadı." },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: data.id });
}
