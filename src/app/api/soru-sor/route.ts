import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { slugify } from "@/lib/slugify";
import { formatPhoneNumber } from "@/lib/utils";

const MAX_QUESTIONS_PER_HOUR = 1;

/** Proxy/CDN tarafından set edilen header'lar kullanılır; platform güvenilir olduğu sürece client IP spoofing yapamaz. */
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
    const body = await request.json();
    const { body: questionBody, category_id: categoryId, phone: askerPhone } = body as {
      body?: string;
      category_id?: string;
      phone?: string;
    };

    if (!questionBody?.trim() || !categoryId) {
      return NextResponse.json(
        { error: "Kategori ve soru metni gerekli." },
        { status: 400 }
      );
    }

    const phoneToSave = formatPhoneNumber(typeof askerPhone === "string" ? askerPhone : "");

    const ip = getClientIp(request);
    const supabase = createSupabaseAdminClient();

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("question_submission_log")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("submitted_at", oneHourAgo);

    if (countError) {
      console.error("Rate limit count error:", countError);
      return NextResponse.json(
        { error: "Limit kontrolü yapılamadı." },
        { status: 500 }
      );
    }

    if ((count ?? 0) >= MAX_QUESTIONS_PER_HOUR) {
      return NextResponse.json(
        {
          error:
            "Sistemimizin daha sağlıklı çalışabilmesi için 1 saat içinde en fazla 1 soru sorabilirsiniz.",
        },
        { status: 429 }
      );
    }

    const titlePlaceholder = questionBody.trim().slice(0, 200);
    const slugBase = slugify(titlePlaceholder) || "soru";
    const slugSuffix = Math.random().toString(36).slice(2, 8);
    const slug = `${slugBase}-${slugSuffix}`;

    const { error: insertError } = await supabase.from("questions").insert({
      title: titlePlaceholder,
      body: questionBody.trim(),
      slug,
      category_id: categoryId,
      ...(phoneToSave ? { phone_number: phoneToSave } : {}),
    });

    if (insertError) {
    console.error("Question insert error:", insertError);
    return NextResponse.json(
      { error: "Soru kaydedilemedi, lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
    }

    await supabase.from("question_submission_log").insert({
      ip_address: ip,
      submitted_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("soru-sor API error:", e);
    return NextResponse.json(
      { error: "Beklenmeyen hata." },
      { status: 500 }
    );
  }
}
