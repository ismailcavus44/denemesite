import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { sendMail } from "@/lib/mail";

type Params = { params: Promise<{ id: string } }>;

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
    .select("id,title,asker_email,status")
    .eq("id", id)
    .maybeSingle();

  if (currentErr || !current) {
    return NextResponse.json(
      { message: "Soru bulunamadı." },
      { status: 404 }
    );
  }

  const { data: similarRow, error: similarErr } = await supabase
    .from("questions")
    .select("id,title,slug,category:categories(slug)")
    .eq("id", similarId)
    .eq("status", "published")
    .maybeSingle();

  if (similarErr || !similarRow) {
    return NextResponse.json(
      { message: "Benzer soru bulunamadı veya yayında değil." },
      { status: 400 }
    );
  }

  const { data: answerRow } = await supabase
    .from("answers")
    .select("answer_text")
    .eq("question_id", similarId)
    .maybeSingle();

  const answerText = answerRow?.answer_text?.trim() ?? "";
  const catSlug = (similarRow.category as { slug?: string })?.slug ?? "sorular";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yasalhaklariniz.com";
  const similarUrl = `${siteUrl}/${catSlug}/soru/${similarRow.slug}`;

  const askerEmail = (current as { asker_email?: string | null }).asker_email?.trim();
  if (askerEmail) {
    try {
      await sendMail({
        to: askerEmail,
        subject: "Sorunuz hakkında — YasalHaklariniz",
        html: `
          <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
            <h2 style="margin:0 0 16px;font-size:20px;color:#111">Sorunuz hakkında</h2>
            <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#333">
              Sorunuz sistemimize daha önce benzer şekilde sorulduğundan, aşağıdaki yanıtı inceleyebilirsiniz.
            </p>
            <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#333">
              <strong>İlgili soru:</strong> ${similarRow.title}
            </p>
            <div style="margin:16px 0;padding:16px;background:#f5f5f5;border-radius:8px;font-size:14px;line-height:1.6;color:#333">
              ${answerText.replace(/\n/g, "<br />")}
            </div>
            <a href="${similarUrl}" style="display:inline-block;margin:16px 0;padding:10px 24px;background:#111;color:#fff;text-decoration:none;border-radius:6px;font-size:14px">
              Soru sayfasını aç
            </a>
            <hr style="margin:24px 0;border:none;border-top:1px solid #e5e5e5" />
            <p style="margin:0;font-size:12px;color:#999">
              Bu e-posta YasalHaklariniz tarafından gönderilmiştir.
            </p>
          </div>
        `,
      });
    } catch (err) {
      console.warn("[mail] Benzer cevap e-postası gönderilemedi:", err);
      return NextResponse.json(
        { message: "E-posta gönderilemedi." },
        { status: 500 }
      );
    }
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

  return NextResponse.json({
    ok: true,
    email_sent: !!askerEmail,
  });
}
