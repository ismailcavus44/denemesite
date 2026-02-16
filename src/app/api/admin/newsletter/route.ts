import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { sendMail } from "@/lib/mail";

/** Abone sayısı (admin). */
export async function GET(request: Request) {
  const adminCheck = await requireAdminFromRequest(request);
  if (!adminCheck.ok) {
    return NextResponse.json(
      { message: adminCheck.message },
      { status: adminCheck.status }
    );
  }

  const supabase = createSupabaseAdminClient();
  const { count, error } = await supabase
    .from("email_subscribers")
    .select("*", { count: "exact", head: true });

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ count: count ?? 0 });
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

  let body: { subject?: string; html?: string };
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
  const { data: rows, error } = await supabase
    .from("email_subscribers")
    .select("email");

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
