import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { sendMail } from "@/lib/mail";

/** Abone listesi (admin). ?category=slug ile kategori bazlı filtre. */
export async function GET(request: Request) {
  const adminCheck = await requireAdminFromRequest(request);
  if (!adminCheck.ok) {
    return NextResponse.json(
      { message: adminCheck.message },
      { status: adminCheck.status }
    );
  }

  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category")?.trim() || null;

  const supabase = createSupabaseAdminClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id,name,slug")
    .order("name");

  let query = supabase
    .from("email_subscribers")
    .select("id,email,source,created_at")
    .order("created_at", { ascending: false });

  if (categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();
    if (cat?.id) {
      const { data: subIds } = await supabase
        .from("email_subscriber_categories")
        .select("subscriber_id")
        .eq("category_id", cat.id);
      const ids = (subIds ?? []).map((r) => (r as { subscriber_id: string }).subscriber_id);
      if (ids.length > 0) {
        query = query.in("id", ids);
      } else {
        query = query.eq("id", "00000000-0000-0000-0000-000000000000");
      }
    }
  }

  const { data: subscribers, error } = await query;

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }

  const list = (subscribers ?? []) as { id: string; email: string; source: string | null; created_at: string }[];
  return NextResponse.json({
    count: list.length,
    subscribers: list,
    categories: (categories ?? []) as { id: string; name: string; slug: string }[],
  });
}

/** Toplu mail gönder (admin). Body: { subject, html }. */
export async function POST(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: admin.message },
      { status: admin.status }
    );
  }

  let body: { subject?: string; html?: string; recipientIds?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Geçersiz JSON." },
      { status: 400 }
    );
  }

  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const html = typeof body.html === "string" ? body.html.trim() : "";
  if (!subject || !html) {
    return NextResponse.json(
      { message: "subject ve html gerekli." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();
  let query = supabase.from("email_subscribers").select("email");
  const ids = Array.isArray(body.recipientIds) ? body.recipientIds.filter((id) => typeof id === "string") : [];
  if (ids.length > 0) {
    query = query.in("id", ids);
  }
  const { data: rows, error } = await query;

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }

  const emails = (rows ?? [])
    .map((r) => (r as { email?: string }).email)
    .filter((e): e is string => typeof e === "string" && e.includes("@"));

  let sent = 0;
  let failed = 0;
  for (const to of emails) {
    try {
      await sendMail({ to, subject, html });
      sent++;
    } catch {
      failed++;
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  return NextResponse.json({ sent, failed, total: emails.length });
}
