import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { authors as staticAuthors } from "@/lib/authors";

/** Statik 2 yazarı (lib/authors) Supabase authors tablosuna tek seferlik ekler. */
export async function POST(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  const toInsert = staticAuthors.map((a) => ({
    name: a.name,
    slug: a.slug,
    bio: a.bio,
    photo_url: a.image ?? null,
  }));

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("authors").upsert(toInsert, {
    onConflict: "slug",
    ignoreDuplicates: false,
  });

  if (error) {
    return NextResponse.json(
      { message: error.message ?? "Yazarlar eklenirken hata oluştu." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: `${toInsert.length} yazar eklendi/güncellendi.`,
    slugs: toInsert.map((r) => r.slug),
  });
}
