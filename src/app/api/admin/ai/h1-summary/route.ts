import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { callOpenAI, type OpenAIMessage } from "@/lib/ai/callOpenAI";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";

const H1_SYSTEM = `Sen Türkiye'nin en büyük hukuki danışmanlık platformu olan 'Yasalhaklarınız'ın Baş SEO Uzmanı ve Kıdemli Avukatısın. Sana vatandaşlar tarafından yazılmış, genellikle imla hataları içeren, sokak ağzıyla ve duygusal bir dille yazılmış ham hukuki sorular verilecek.

GÖREVİN: Bu ham metni analiz edip; sokağın dilini profesyonel hukuk diline çevirerek sayfada kullanılacak H1 başlığını (h1_summary) oluşturmaktır.

KATI KURALLAR:
1. Asla Sokak Ağzı Kullanma: Vatandaş "dövüş, kavga, kağıt geldi, içeri attılar" dese bile bunları hukuki karşılıklarına çevir (Örn: Darp, Kasten Yaralama, Meşru Müdafaa, Tebligat, Soruşturma, Tutuklama). Başlık profesyonel hukuk diliyle yazılmalı.
2. h1_summary: Türkçe, 8–14 kelime, doğal soru cümlesi. Hukuki kavramları kullan (miras, tapu, kira, icra, darp, tebligat vb.). Emoji ve kanun/madde numarası yok. Maksimum 110 karakter.
3. should_apply: true = mevcut başlık uzun/eksik/alakasız veya sokak ağzı içeriyor, başlık değiştirilmeli; false = mevcut başlık zaten kısa ve profesyonel, yine de h1_summary öneri olarak dolu olabilir.
4. "Sitede zaten kullanılan H1 başlıkları" listesi verilirse, üreteceğin başlık bu listedekilerle aynı veya çok benzer OLMAMALI. Farklı ve özgün bir ifade üret.
5. ÇIKTI FORMATI: Ekstra metin veya markdown eklemeden SADECE geçerli JSON dön: { "h1_summary": "...", "should_apply": true veya false }`;

function cleanRawResponse(raw: string): string {
  return raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
}

function parseAndValidate(
  raw: string
): { h1_summary: string | null; should_apply: boolean } | string {
  const cleaned = cleanRawResponse(raw);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return "Geçersiz JSON.";
  }
  if (!parsed || typeof parsed !== "object") return "Geçersiz JSON.";
  const o = parsed as Record<string, unknown>;
  const should_apply = o.should_apply === true;
  const h1_summary =
    o.h1_summary === null || o.h1_summary === undefined
      ? null
      : typeof o.h1_summary === "string"
        ? o.h1_summary.trim()
        : "";

  if (!h1_summary) return "h1_summary boş olamaz.";
  if (h1_summary.length > 110) return "h1_summary en fazla 110 karakter olmalı.";

  return {
    h1_summary,
    should_apply,
  };
}

/** Sitede yayında kullanılan H1 metinlerini döndürür (kopyadan kaçınmak için). excludeQuestionId verilirse o sorunun H1'i listede olmaz. */
async function getExistingH1s(excludeQuestionId?: string): Promise<string[]> {
  const supabase = createSupabaseAdminClient();
  const { data: rows } = await supabase
    .from("questions")
    .select("id,title,ai_h1_summary,ai_h1_enabled")
    .eq("status", "published")
    .limit(600);

  const set = new Set<string>();
  for (const r of rows ?? []) {
    if (excludeQuestionId && r.id === excludeQuestionId) continue;
    const effective =
      r.ai_h1_enabled === true && r.ai_h1_summary && String(r.ai_h1_summary).trim()
        ? String(r.ai_h1_summary).trim()
        : r.title && String(r.title).trim()
          ? String(r.title).trim()
          : "";
    if (effective) set.add(effective);
  }
  return Array.from(set);
}

export async function POST(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  let body: { question_text?: string; current_title?: string; question_id?: string };
  try {
    body = (await request.json()) as { question_text?: string; current_title?: string; question_id?: string };
  } catch {
    return NextResponse.json({ message: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const questionText = typeof body.question_text === "string" ? body.question_text.trim() : "";
  const currentTitle = typeof body.current_title === "string" ? body.current_title.trim() : "";
  const questionId = typeof body.question_id === "string" ? body.question_id.trim() || undefined : undefined;
  if (!questionText) {
    return NextResponse.json({ message: "question_text gerekli." }, { status: 400 });
  }

  const existingH1s = await getExistingH1s(questionId);
  const existingBlock =
    existingH1s.length > 0
      ? `\n\nSİTEDE ZATEN KULLANILAN H1 BAŞLIKLARI (bunlarla aynı veya çok benzer bir başlık üretme):\n${existingH1s.slice(0, 400).join("\n")}`
      : "";

  const messages: OpenAIMessage[] = [
    { role: "system", content: H1_SYSTEM },
    {
      role: "user",
      content: `Mevcut başlık ve soru metni verildi. Soruyu özetleyen kısa bir başlık (H1) üret. Başlık çok uzunsa veya yoksa/alakasızsa should_apply=true, aksi halde false. Listede varsa mevcut başlıklarla aynı/benzer olmayan özgün bir başlık üret. Sadece JSON ver.\n\nMEVCUT BAŞLIK:\n${currentTitle || "(yok)"}\n\nSORU METNİ:\n${questionText}${existingBlock}`,
    },
  ];

  let raw: string;
  try {
    raw = await callOpenAI(messages);
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "AI çağrısı başarısız." },
      { status: 502 }
    );
  }

  const result = parseAndValidate(raw);
  if (typeof result === "string") {
    return NextResponse.json({ message: result }, { status: 422 });
  }
  if (!result.h1_summary) {
    return NextResponse.json({ message: "h1_summary boş." }, { status: 422 });
  }

  const normalizedNew = result.h1_summary.trim().toLowerCase();
  const isDuplicate = existingH1s.some(
    (h) => h.trim().toLowerCase() === normalizedNew
  );
  if (isDuplicate) {
    return NextResponse.json(
      { message: "Üretilen başlık sitede zaten kullanılıyor. Lütfen tekrar deneyin veya elle düzenleyin." },
      { status: 422 }
    );
  }

  return NextResponse.json(result);
}
