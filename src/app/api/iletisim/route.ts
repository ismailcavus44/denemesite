import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { formatPhoneNumber } from "@/lib/utils";
import { getClientIp } from "@/lib/getClientIp";

const MAX_CONTACT_PER_HOUR = 5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      phone: rawPhone,
      message,
      consent_accepted,
      whatsapp_consent,
    } = body as {
      fullName?: string;
      phone?: string;
      message?: string;
      consent_accepted?: boolean;
      whatsapp_consent?: boolean;
    };

    const name = typeof fullName === "string" ? fullName.trim() : "";
    const msg = typeof message === "string" ? message.trim() : "";

    if (name.length < 2) {
      return NextResponse.json(
        { error: "İsim soyisim en az 2 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const phoneToSave = formatPhoneNumber(typeof rawPhone === "string" ? rawPhone : "");
    if (!phoneToSave) {
      return NextResponse.json(
        { error: "Geçerli bir telefon numarası girin." },
        { status: 400 }
      );
    }

    if (msg.length < 10) {
      return NextResponse.json(
        { error: "Mesaj en az 10 karakter olmalıdır." },
        { status: 400 }
      );
    }

    if (consent_accepted !== true) {
      return NextResponse.json(
        { error: "KVKK ve Sorumluluk Reddi metnini kabul etmeniz gerekmektedir." },
        { status: 400 }
      );
    }

    if (whatsapp_consent !== true) {
      return NextResponse.json(
        {
          error:
            "Telefon numarası girdiğinizde WhatsApp bildirimi ve veri aktarımı için açık rıza onayını işaretlemeniz gerekmektedir.",
        },
        { status: 400 }
      );
    }

    const ip = getClientIp(request);
    const supabase = createSupabaseAdminClient();

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("contact_submission_log")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("submitted_at", oneHourAgo);

    if (countError) {
      console.error("İletişim rate limit count error:", countError);
      return NextResponse.json(
        { error: "Limit kontrolü yapılamadı." },
        { status: 500 }
      );
    }

    if ((count ?? 0) >= MAX_CONTACT_PER_HOUR) {
      return NextResponse.json(
        {
          error:
            "Çok sık gönderim yaptınız. Lütfen bir süre sonra tekrar deneyin.",
        },
        { status: 429 }
      );
    }

    const { error: insertError } = await supabase.from("contact_messages").insert({
      full_name: name,
      phone: phoneToSave,
      message: msg,
      whatsapp_consent: true,
    });

    if (insertError) {
      console.error("contact_messages insert error:", insertError);
      return NextResponse.json(
        { error: "Mesaj kaydedilemedi, lütfen daha sonra tekrar deneyin." },
        { status: 500 }
      );
    }

    await supabase.from("contact_submission_log").insert({
      ip_address: ip,
      submitted_at: new Date().toISOString(),
    });

    await supabase.from("consent_log").insert({
      ip_address: ip,
      consent_at: new Date().toISOString(),
      consent_status: true,
      phone: phoneToSave,
      form_type: "iletisim",
      whatsapp_consent: true,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("iletisim API error:", e);
    return NextResponse.json({ error: "Beklenmeyen hata." }, { status: 500 });
  }
}
