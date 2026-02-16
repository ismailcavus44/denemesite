import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { sendMail } from "@/lib/mail";
import { getOpenAIEmbedding } from "@/lib/ai/embedding";

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function generateUniqueSlug(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  baseSlug: string,
  currentId: string
): Promise<string> {
  const { data, error } = await supabase
    .from("questions")
    .select("id,slug")
    .like("slug", `${baseSlug}%`);

  if (error || !data?.length) {
    return baseSlug;
  }

  const others = data.filter((row) => row.id !== currentId);
  if (!others.length) {
    return baseSlug;
  }

  const takenSlugs = others.map((row) => row.slug as string);
  const hasExactBase = takenSlugs.includes(baseSlug);

  if (!hasExactBase) {
    // Aynı slug yoksa, benzer (base-2, base-3...) olsa bile baseSlug'u kullan
    return baseSlug;
  }

  const suffixes: number[] = [];
  const re = new RegExp(`^${escapeRegex(baseSlug)}-(\\d+)$`);

  for (const s of takenSlugs) {
    const match = s.match(re);
    if (match) {
      const n = parseInt(match[1], 10);
      if (!Number.isNaN(n)) {
        suffixes.push(n);
      }
    }
  }

  const maxSuffix = suffixes.length ? Math.max(...suffixes) : 1;
  return `${baseSlug}-${maxSuffix + 1}`;
}

type Params = {
  params: Promise<{ id: string }>;
};

type UpdatePayload = {
  status?: "pending" | "draft" | "published" | "rejected";
  title?: string;
  body?: string;
  slug?: string;
  category_id?: string | null;
  answer_text?: string;
  ai_title?: string | null;
  ai_answer_draft?: string | null;
  ai_main_concept?: string | null;
  ai_pillar_slug?: string | null;
  ai_pillar_url?: string | null;
  ai_card_summary?: string | null;
  seo_slug?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  ai_h1_summary?: string | null;
  ai_h1_enabled?: boolean;
  related_guide_url?: string | null;
  related_guide_label?: string | null;
};

export async function PATCH(request: Request, { params }: Params) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: admin.message },
      { status: admin.status }
    );
  }

  const { id } = await params;
  const body = (await request.json()) as UpdatePayload;
  const supabase = createSupabaseAdminClient();

  let normalizedSlug: string | undefined;
  if (body.slug && body.slug.trim()) {
    normalizedSlug = await generateUniqueSlug(supabase, body.slug.trim(), id);
  }

  const updatePayload: Record<string, unknown> = {};
  if (body.title) updatePayload.title = body.title;
  if (body.body) updatePayload.body = body.body;
  if (normalizedSlug) updatePayload.slug = normalizedSlug;
  if (body.category_id !== undefined) updatePayload.category_id = body.category_id;
  if (body.status) updatePayload.status = body.status;
  if (body.status === "published") {
    updatePayload.published_at = new Date().toISOString();
  }
  if (body.status && body.status !== "published") {
    updatePayload.published_at = null;
  }
  if (body.ai_title !== undefined) updatePayload.ai_title = body.ai_title;
  if (body.ai_answer_draft !== undefined) updatePayload.ai_answer_draft = body.ai_answer_draft;
  if (body.ai_main_concept !== undefined) updatePayload.ai_main_concept = body.ai_main_concept;
  if (body.ai_pillar_slug !== undefined) updatePayload.ai_pillar_slug = body.ai_pillar_slug;
  if (body.ai_pillar_url !== undefined) updatePayload.ai_pillar_url = body.ai_pillar_url;
  if (body.ai_card_summary !== undefined) updatePayload.ai_card_summary = body.ai_card_summary;
  if (normalizedSlug) {
    updatePayload.seo_slug = normalizedSlug;
  } else if (body.seo_slug !== undefined) {
    updatePayload.seo_slug = body.seo_slug;
  }
  if (body.seo_title !== undefined) updatePayload.seo_title = body.seo_title;
  if (body.seo_description !== undefined) updatePayload.seo_description = body.seo_description;
  if (body.ai_h1_summary !== undefined) updatePayload.ai_h1_summary = body.ai_h1_summary;
  if (body.ai_h1_enabled !== undefined) updatePayload.ai_h1_enabled = body.ai_h1_enabled;
  if (body.related_guide_url !== undefined) updatePayload.related_guide_url = body.related_guide_url?.trim() || null;
  if (body.related_guide_label !== undefined) updatePayload.related_guide_label = body.related_guide_label?.trim() || null;
  if (
    body.seo_slug !== undefined ||
    body.seo_title !== undefined ||
    body.seo_description !== undefined
  ) {
    updatePayload.seo_updated_at = new Date().toISOString();
  }
  if (
    body.ai_h1_summary !== undefined ||
    body.ai_h1_enabled !== undefined
  ) {
    updatePayload.ai_h1_updated_at = new Date().toISOString();
  }
  if (
    body.ai_title !== undefined ||
    body.ai_answer_draft !== undefined ||
    body.ai_main_concept !== undefined
  ) {
    updatePayload.ai_updated_at = new Date().toISOString();
  }
  if (Object.keys(updatePayload).length) {
    let { error: updateError } = await supabase
      .from("questions")
      .update(updatePayload)
      .eq("id", id);
    if (updateError?.message?.includes("seo_updated_at")) {
      delete (updatePayload as Record<string, unknown>).seo_updated_at;
      const retry = await supabase.from("questions").update(updatePayload).eq("id", id);
      updateError = retry.error;
    }
    if (updateError) {
      return NextResponse.json(
        { message: updateError.message },
        { status: 400 }
      );
    }
  }

  if (body.answer_text !== undefined) {
    const { error: answerError } = await supabase.from("answers").upsert(
      {
        question_id: id,
        answer_text: typeof body.answer_text === "string" ? body.answer_text : "",
        created_by: admin.userId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "question_id" }
    );

    if (answerError) {
      return NextResponse.json(
        { message: answerError.message },
        { status: 400 }
      );
    }
  }

  /* Yayınlandığında embedding üret (benzer soru tespiti için); hata olursa sessizce atla */
  if (body.status === "published") {
    try {
      const { data: row } = await supabase
        .from("questions")
        .select("title, body")
        .eq("id", id)
        .maybeSingle();
      if (row?.title != null && process.env.OPENAI_API_KEY) {
        const text = [row.title, row.body].filter(Boolean).join("\n");
        const embedding = await getOpenAIEmbedding(text);
        await supabase.rpc("set_question_embedding", {
          p_question_id: id,
          p_embedding: embedding,
        });
      }
    } catch (err) {
      console.warn("[embedding] Soru embedding güncellenemedi:", err);
    }
  }

  /* Soru yayınlandığında, soruda e-posta varsa cevaplandı bildirimi gönder */
  if (body.status === "published") {
    const { data: questionRow } = await supabase
      .from("questions")
      .select("asker_email,title,slug,category_id,category:categories(slug)")
      .eq("id", id)
      .maybeSingle();

    const toEmail = (questionRow as { asker_email?: string | null })?.asker_email?.trim();
    if (toEmail) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yasalhaklariniz.com";
      const cat = (questionRow as { category?: { slug: string } | Array<{ slug: string }> })?.category;
      const catSlug = (Array.isArray(cat) ? cat[0]?.slug : cat?.slug) ?? "sorular";
      const questionUrl = `${siteUrl}/${catSlug}/soru/${questionRow!.slug}`;

      try {
        await sendMail({
          to: toEmail,
          subject: "Sorunuz cevaplandı — YasalHaklariniz",
          html: `
            <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
              <h2 style="margin:0 0 16px;font-size:20px;color:#111">Sorunuz cevaplandı</h2>
              <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#333">
                <strong>"${questionRow!.title}"</strong> başlıklı sorunuz editör ekibi tarafından cevaplandı ve yayınlandı.
              </p>
              <a href="${questionUrl}" style="display:inline-block;margin:16px 0;padding:10px 24px;background:#111;color:#fff;text-decoration:none;border-radius:6px;font-size:14px">
                Cevabı Görüntüle
              </a>
              <hr style="margin:24px 0;border:none;border-top:1px solid #e5e5e5" />
              <p style="margin:0;font-size:12px;color:#999">
                Bu e-posta YasalHaklariniz tarafından gönderilmiştir.
              </p>
            </div>
          `,
        });
      } catch (err) {
        console.warn("[mail] Cevaplandı bildirimi gönderilemedi:", err);
      }
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: Params) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: admin.message },
      { status: admin.status }
    );
  }

  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("questions").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
