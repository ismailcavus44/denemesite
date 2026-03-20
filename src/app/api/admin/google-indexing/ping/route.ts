import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { notifyGoogleIndexing } from "@/lib/googleIndexing";

export async function POST(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Geçersiz JSON." }, { status: 400 });
  }

  const url = typeof body?.url === "string" ? body.url.trim() : "";
  if (!url) {
    return NextResponse.json({ message: "url gerekli." }, { status: 400 });
  }

  if (!url.startsWith("https://") || !url.includes("yasalhaklariniz.com")) {
    return NextResponse.json({ message: "Geçersiz URL alan adı." }, { status: 400 });
  }

  await notifyGoogleIndexing(url);
  return NextResponse.json({ ok: true });
}
