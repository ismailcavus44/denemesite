import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { callOpenAI, type OpenAIMessage } from "@/lib/ai/callOpenAI";

const H1_SYSTEM = `Sen bir Türkçe hukuk Q&A platformu editörüsün. Görevin: Soruyu özetleyen kısa bir BAŞLIK (H1) üretmek. Bu başlık sayfada H1 olarak kullanılır; asıl soru metni "Sorunun devamı" bloğunda gösterilir.

İki durumda başlık üretmek gerekir:
1) Mevcut başlık çok uzunsa (>180 karakter) → kısa referans başlık üret, should_apply=true.
2) Başlık yoksa veya çok kısaysa / soruyla alakasızsa → sorudan başlık üret, should_apply=true.
Mevcut başlık zaten kısa (≤180 karakter) ve soruyla uyumluysa should_apply=false döndür, yine de h1_summary alanında alternatif bir başlık öner (admin isterse kullanır).

Kurallar:
- h1_summary: Türkçe, 8–14 kelime, doğal soru cümlesi. Orijinal niyeti koru. Emoji ve kanun/madde numarası yok. Varsa ana kavramları ekle (miras, tapu, kira, icra vb.).
- should_apply: true = mevcut başlık uzun/eksik/alakasız, başlık değiştirilmeli; false = mevcut başlık yeterli, yine de h1_summary öneri olarak dolu olabilir.
- Çıktı SADECE geçerli JSON: { "h1_summary": "...", "should_apply": true/false }`;

function parseAndValidate(
  raw: string
): { h1_summary: string | null; should_apply: boolean } | string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
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

export async function POST(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  let body: { question_text?: string; current_title?: string };
  try {
    body = (await request.json()) as { question_text?: string; current_title?: string };
  } catch {
    return NextResponse.json({ message: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const questionText = typeof body.question_text === "string" ? body.question_text.trim() : "";
  const currentTitle = typeof body.current_title === "string" ? body.current_title.trim() : "";
  if (!questionText) {
    return NextResponse.json({ message: "question_text gerekli." }, { status: 400 });
  }

  const messages: OpenAIMessage[] = [
    { role: "system", content: H1_SYSTEM },
    {
      role: "user",
      content: `Mevcut başlık ve soru metni verildi. Soruyu özetleyen kısa bir başlık (H1) üret. Başlık çok uzunsa veya yoksa/alakasızsa should_apply=true, aksi halde false. Sadece JSON ver.\n\nMEVCUT BAŞLIK:\n${currentTitle || "(yok)"}\n\nSORU METNİ:\n${questionText}`,
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

  return NextResponse.json(result);
}
