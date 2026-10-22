import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { revalidatePath } from "next/cache";
import { ensureCategoryExists, ensureCategoryPillar, KNOWN_CATEGORY_SLUGS } from "@/lib/content";

export async function GET(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }
  // Bilinen kategoriler DB'de yoksa burada eklenir (eskiden her sayfa açılışında yapılıyordu).
  await Promise.all(KNOWN_CATEGORY_SLUGS.map((slug) => ensureCategoryExists(slug)));
  const supabase = createSupabaseAdminClient();
  const result = await supabase
    .from("categories")
    .select("id,name,slug,meta_title,meta_description")
    .order("name");
  const { error } = result;
  let { data } = result;
  if (error) {
    const { data: fallback, error: err2 } = await supabase
      .from("categories")
      .select("id,name,slug")
      .order("name");
    if (err2) return NextResponse.json({ message: error.message }, { status: 500 });
    data = (fallback ?? []).map((r) => ({ ...r, meta_title: null, meta_description: null }));
  }
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: admin.message },
      { status: admin.status }
    );
  }

  const body = (await request.json()) as {
    name?: string;
    slug?: string;
    meta_title?: string | null;
    meta_description?: string | null;
  };
  if (!body.name || !body.slug) {
    return NextResponse.json(
      { message: "Eksik alan." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("categories").insert({
    name: body.name,
    slug: body.slug,
    meta_title: typeof body.meta_title === "string" ? body.meta_title.trim() || null : null,
    meta_description: typeof body.meta_description === "string" ? body.meta_description.trim() || null : null,
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: admin.message },
      { status: admin.status }
    );
  }

  const body = (await request.json()) as {
    id?: string;
    name?: string;
    slug?: string;
    meta_title?: string | null;
    meta_description?: string | null;
  };

  if (!body.id || !body.name || !body.slug) {
    return NextResponse.json(
      { message: "Eksik alan." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();
  const update: Record<string, unknown> = {
    name: body.name,
    slug: body.slug,
    meta_title: typeof body.meta_title === "string" ? body.meta_title.trim() || null : null,
    meta_description: typeof body.meta_description === "string" ? body.meta_description.trim() || null : null,
  };
  const { error } = await supabase.from("categories").update(update).eq("id", body.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  // Pillar metni yoksa AI ile üretimi admin kaydında yapılır (ziyaretçi isteğinde değil).
  await ensureCategoryPillar(body.slug);
  revalidatePath(`/${body.slug}`);
  revalidatePath(`/${body.slug}/rehber`);

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: admin.message },
      { status: admin.status }
    );
  }

  const body = (await request.json()) as { id?: string };
  if (!body.id) {
    return NextResponse.json(
      { message: "Eksik alan." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", body.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
