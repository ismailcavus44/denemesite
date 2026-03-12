import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { slugify } from "@/lib/slugify";
import { formatPhoneNumber } from "@/lib/utils";
import { getClientIp } from "@/lib/getClientIp";

const MAX_QUESTIONS_PER_HOUR = 1;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { body: questionBody, category_id: categoryId, phone: askerPhone, consent_accepted, whatsapp_consent } = body as {
      body?: string;
      category_id?: string;
      phone?: string;
      consent_accepted?: boolean;
      whatsapp_consent?: boolean;
    };

    if (!questionBody?.trim() || !categoryId) {
      return NextResponse.json(
        { error: "Kategori ve soru metni gerekli." },
        { status: 400 }
      );
    }

    if (consent_accepted !== true) {
      return NextResponse.json(
        { error: "KVKK ve Sorumluluk Reddi metnini kabul etmeniz gerekmektedir." },
        { status: 400 }
      );
    }

    const phoneToSave = formatPhoneNumber(typeof askerPhone === "string" ? askerPhone : "");
    if (phoneToSave && whatsapp_consent !== true) {
      return NextResponse.json(
        { error: "Telefon numarası girdiğinizde WhatsApp bildirimi ve veri aktarımı için açık rıza onayını işaretlemeniz gerekmektedir." },
        { status: 400 }
      );
    }

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

    await supabase.from("consent_log").insert({
      ip_address: ip,
      consent_at: new Date().toISOString(),
      consent_status: true,
      phone: phoneToSave || null,
      form_type: "soru_sor",
      whatsapp_consent: phoneToSave ? true : null,
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
