import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { callOpenAI, type OpenAIMessage } from "@/lib/ai/callOpenAI";

const SEO_SYSTEM = `Sen bir SEO editörüsün. Sadece aşağıdaki 3 alanı Türkçe ve kurallara uygun üret. Başka hiçbir şey yazma. Çıktı SADECE geçerli JSON olsun.

Kurallar:
- slug: Türkçe, küçük harf, tire ile ayrılmış, 4–8 kelime, arama niyetini yansıtsın, stopword doldurma yok.
- meta_title: Türkçe, 45–60 karakter, doğal bir soru, gerçek kullanıcı aramasına yakın. Emoji ve kanun/madde numarası yok.
- meta_description: Türkçe, 140–160 karakter, bilgilendirici, sakin, nötr. Sayfanın neye cevap verdiğini anlat, "kesin çözüm" gibi vaat yok. Emoji ve kanun/madde numarası yok.`;

function buildUserPrompt(questionText: string, answerText: string | undefined): string {
  let out = `SORU METNİ:\n${questionText}`;
  if (answerText?.trim()) {
    out += `\n\nCEVAP METNİ (isteğe bağlı, sayfa içeriğini yansıtmak için kullan):\n${answerText.trim()}`;
  }
  out += `\n\nYanıtı SADECE şu JSON formatında ver:\n{"slug":"...","meta_title":"...","meta_description":"..."}`;
  return out;
}

function parseAndValidate(body: string): { slug: string; meta_title: string; meta_description: string } | string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return "Geçersiz JSON.";
  }
  if (!parsed || typeof parsed !== "object") return "Geçersiz JSON.";
  const o = parsed as Record<string, unknown>;
  const slug = typeof o.slug === "string" ? o.slug.trim() : "";
  const meta_title = typeof o.meta_title === "string" ? o.meta_title.trim() : "";
  const meta_description = typeof o.meta_description === "string" ? o.meta_description.trim() : "";
  if (!slug) return "slug boş olamaz.";
  if (!meta_title) return "meta_title boş olamaz.";
  if (!meta_description) return "meta_description boş olamaz.";
  if (meta_title.length > 60) return "meta_title en fazla 60 karakter olmalı.";
  if (meta_description.length > 160) return "meta_description en fazla 160 karakter olmalı.";
  return { slug, meta_title, meta_description };
}

export async function POST(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  let body: { question_text?: string; answer_text?: string };
  try {
    body = (await request.json()) as { question_text?: string; answer_text?: string };
  } catch {
    return NextResponse.json({ message: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const questionText = typeof body.question_text === "string" ? body.question_text.trim() : "";
  if (!questionText) {
    return NextResponse.json({ message: "question_text gerekli." }, { status: 400 });
  }

  const answerText = typeof body.answer_text === "string" ? body.answer_text : undefined;

  const messages: OpenAIMessage[] = [
    { role: "system", content: SEO_SYSTEM },
    { role: "user", content: buildUserPrompt(questionText, answerText) },
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
