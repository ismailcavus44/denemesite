import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";
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

function safeAttachmentFilename(name: string | null): string {
  if (!name?.trim()) return "basvuru.docx";
  const base = name.replace(/^.*[/\\]/, "").trim();
  const safe = base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  return safe.endsWith(".docx") ? safe : safe ? `${safe}.docx` : "basvuru.docx";
}

export async function POST(request: NextRequest) {
  try {
    const basvuruEmail = process.env.BASVURU_EMAIL?.trim();
    if (!basvuruEmail) {
      console.error("[basvuru] BASVURU_EMAIL ortam değişkeni tanımlı değil.");
      return NextResponse.json(
        { error: "Başvuru alınamıyor. Lütfen daha sonra deneyin." },
        { status: 503 }
      );
    }

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

    const buffer = Buffer.from(await cv.arrayBuffer());
    const subject =
      type === "yazar"
        ? "Gönüllü Yazar Başvurusu"
        : "Gönüllü Editör Başvurusu";

    const html = `
      <p><strong>Başvuru türü:</strong> ${type === "yazar" ? "Yazar" : "Editör"}</p>
      <p><strong>Ad Soyad:</strong> ${escapeHtml(name.trim())}</p>
      <p><strong>E-posta:</strong> ${escapeHtml(email.trim())}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(phone.trim())}</p>
      <p>CV dosyası ektedir.</p>
    `;

    await sendMail({
      to: basvuruEmail,
      subject,
      html,
      attachments: [{ filename: safeAttachmentFilename(cv.name), content: buffer }],
    });

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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
