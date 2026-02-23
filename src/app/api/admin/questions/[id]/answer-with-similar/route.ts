import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: admin.message },
      { status: admin.status }
    );
  }

  const { id } = await params;
  let body: { similar_question_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "similar_question_id gerekli." },
      { status: 400 }
    );
  }

  const similarId = body.similar_question_id?.trim();
  if (!similarId) {
    return NextResponse.json(
      { message: "similar_question_id gerekli." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();

  const { data: current, error: currentErr } = await supabase
    .from("questions")
    .select("id,status")
    .eq("id", id)
    .maybeSingle();

  if (currentErr || !current) {
    return NextResponse.json(
      { message: "Soru bulunamadı." },
      { status: 404 }
    );
  }

  const { error: similarErr } = await supabase
    .from("questions")
    .select("id")
    .eq("id", similarId)
    .eq("status", "published")
    .maybeSingle();

  if (similarErr) {
    return NextResponse.json(
      { message: "Benzer soru bulunamadı veya yayında değil." },
      { status: 400 }
    );
  }

  const { error: updateErr } = await supabase
    .from("questions")
    .update({ status: "rejected" })
    .eq("id", id);

  if (updateErr) {
    return NextResponse.json(
      { message: updateErr.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
