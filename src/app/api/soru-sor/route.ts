import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { slugify } from "@/lib/slugify";
import { formatPhoneNumber } from "@/lib/utils";
import { getClientIp } from "@/lib/getClientIp";

const MAX_QUESTIONS_PER_HOUR = 1;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      body: questionBody,
      category_id: categoryId,
      consent_accepted,
      wants_contact: wantsContactRaw,
      contact_full_name: contactFullNameRaw,
      contact_phone: contactPhoneRaw,
      whatsapp_consent,
    } = body as {
      body?: string;
      category_id?: string;
      consent_accepted?: boolean;
      wants_contact?: boolean;
      contact_full_name?: string;
      contact_phone?: string;
      whatsapp_consent?: boolean;
    };

    const wantsContact = wantsContactRaw === true;

    if (!questionBody?.trim() || !categoryId) {
      return NextResponse.json(
        { error: "Kategori ve soru metni gerekli." },
        { status: 400 }
      );
    }

    const MIN_BODY_LENGTH = 100;
    if (questionBody.trim().length < MIN_BODY_LENGTH) {
      return NextResponse.json(
        { error: `Soru metni en az ${MIN_BODY_LENGTH} karakter olmalıdır.` },
        { status: 400 }
      );
    }

    if (consent_accepted !== true) {
      return NextResponse.json(
        { error: "KVKK ve Sorumluluk Reddi metnini kabul etmeniz gerekmektedir." },
        { status: 400 }
      );
    }

    const contactName =
      typeof contactFullNameRaw === "string" ? contactFullNameRaw.trim() : "";
    const phoneToSave = wantsContact
      ? formatPhoneNumber(typeof contactPhoneRaw === "string" ? contactPhoneRaw : "")
      : null;

    if (wantsContact) {
      if (contactName.length < 2) {
        return NextResponse.json(
          { error: "İletişim için isim soyisim en az 2 karakter olmalıdır." },
          { status: 400 }
        );
      }
      if (!phoneToSave) {
        return NextResponse.json(
          { error: "Geçerli bir telefon numarası girin." },
          { status: 400 }
        );
      }
      if (whatsapp_consent !== true) {
        return NextResponse.json(
          {
            error:
              "İletişim talebi için numaranızın işlenmesine ilişkin onayı işaretlemeniz gerekmektedir.",
          },
          { status: 400 }
        );
      }
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

    const { data: insertedQuestion, error: insertError } = await supabase
      .from("questions")
      .insert({
        title: titlePlaceholder,
        body: questionBody.trim(),
        slug,
        category_id: categoryId,
        wants_contact: wantsContact,
        contact_full_name: wantsContact ? contactName : null,
        phone_number: wantsContact ? phoneToSave : null,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Question insert error:", insertError);
      return NextResponse.json(
        { error: "Soru kaydedilemedi, lütfen daha sonra tekrar deneyin." },
        { status: 500 }
      );
    }

    if (wantsContact && phoneToSave && insertedQuestion?.id) {
      const preview = questionBody.trim().slice(0, 2000);
      const { error: cmError } = await supabase.from("contact_messages").insert({
        full_name: contactName,
        phone: phoneToSave,
        message: `Soru Sor — iletişim talebi\n\n${preview}`,
        whatsapp_consent: true,
        question_id: insertedQuestion.id,
      });
      if (cmError) {
        console.error("contact_messages insert (soru-sor) error:", cmError);
      }
    }

    await supabase.from("question_submission_log").insert({
      ip_address: ip,
      submitted_at: new Date().toISOString(),
    });

    await supabase.from("consent_log").insert({
      ip_address: ip,
      consent_at: new Date().toISOString(),
      consent_status: true,
      phone: wantsContact ? phoneToSave : null,
      form_type: "soru_sor",
      whatsapp_consent: wantsContact ? true : null,
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
