import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";

const ALLOWED_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const MAX_BASVURU_PER_HOUR = 2;

function getClientIp(request: NextRequest): string {
  const vercel = request.headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const supabase = createSupabaseAdminClient();
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("basvuru_log")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("submitted_at", oneHourAgo);

    if (countError) {
      console.error("[basvuru] Rate limit kontrolü hatası:", countError);
      return NextResponse.json(
        { error: "Başvuru alınamıyor. Lütfen daha sonra deneyin." },
        { status: 500 }
      );
    }
    if ((count ?? 0) >= MAX_BASVURU_PER_HOUR) {
      return NextResponse.json(
        { error: "Kısa süre içinde çok fazla başvuru gönderildi. Lütfen 1 saat sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const type = formData.get("type") as string | null;
    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string | null;
    const phone = formData.get("phone") as string | null;
    const cv = formData.get("cv") as File | null;

    const kvkk = formData.get("kvkk") === "on";

    if (!type || !name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: "Ad soyad, e-posta ve telefon zorunludur." },
        { status: 400 }
      );
    }

    if (!kvkk) {
      return NextResponse.json(
        { error: "KVKK aydınlatma metnini kabul etmeniz gerekmektedir." },
        { status: 400 }
      );
    }

    if (type !== "yazar" && type !== "editor") {
      return NextResponse.json({ error: "Geçersiz başvuru türü." }, { status: 400 });
    }

    if (!cv || cv.size === 0) {
      return NextResponse.json(
        { error: "CV dosyası (Word) yüklenmesi zorunludur." },
        { status: 400 }
      );
    }

    const ext = cv.name.toLowerCase().slice(-5);
    if (ext !== ".docx" && cv.type !== ALLOWED_MIME) {
      return NextResponse.json(
        { error: "CV yalnızca Word (.docx) formatında olmalıdır." },
        { status: 400 }
      );
    }

    await supabase.from("basvuru_log").insert({
      ip_address: ip,
      submitted_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[basvuru] Hata:", err);
    return NextResponse.json(
      { error: "Başvuru gönderilemedi. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}

