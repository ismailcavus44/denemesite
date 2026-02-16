import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { callOpenAI, type OpenAIMessage } from "@/lib/ai/callOpenAI";

const CARD_SYSTEM = `Sen sadece kart özeti üreten bir asistanısın. Türkçe hukuk Q&A platformunda sadece kartlarda (anasayfa, liste) gösterilecek tek cümlelik özet yazıyorsun.

KURALLAR:
- Sadece verilen cevap metninin özünü tek cümlede özetle.
- Türkçe, tam bir cümle, 80–120 karakter.
- Sakin, bilgilendirici, vatandaş dili.
- Cevaptaki hiçbir cümleyi aynen kopyalama; ilk veya son cümleyi kullanma.
- Emoji, kanun/madde numarası, "kesin", "garanti", "mutlaka" yok.
- Soru formatında cümle kurma.
- Çıktı SADECE geçerli JSON: { "card_summary": "..." }`;

function parseAndValidate(
  raw: string,
  answerText: string
): { card_summary: string | null } | string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return "Geçersiz JSON.";
  }
  if (!parsed || typeof parsed !== "object") return "Geçersiz JSON.";
  const o = parsed as Record<string, unknown>;
  const summary =
    o.card_summary === null || o.card_summary === undefined
      ? null
      : typeof o.card_summary === "string"
        ? o.card_summary.trim()
        : "";

  if (summary === null || summary === "") {
    return "card_summary boş veya null olamaz (cevap varken).";
  }

  if (summary.length < 80 || summary.length > 120) {
    return `card_summary 80–120 karakter olmalı (şu an ${summary.length}).`;
  }

  const answerNorm = answerText.trim().replace(/\s+/g, " ");
  const summaryNorm = summary.replace(/\s+/g, " ");
  if (answerNorm.includes(summaryNorm)) {
    return "Özet cevap metninin içinde geçmemeli (kopya cümle yok).";
  }

  return { card_summary: summary };
}

export async function POST(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  let body: { answer_text?: string | null };
  try {
    body = (await request.json()) as { answer_text?: string | null };
  } catch {
    return NextResponse.json({ message: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const answerText = typeof body.answer_text === "string" ? body.answer_text : "";
  if (!answerText.trim()) {
    return NextResponse.json({ card_summary: null });
  }

  const messages: OpenAIMessage[] = [
    { role: "system", content: CARD_SYSTEM },
    {
      role: "user",
      content: `Aşağıdaki cevap metnini 80–120 karakterlik tek cümle kart özetine dönüştür. Cevaptaki cümleleri kopyalama. Sadece JSON döndür: { "card_summary": "..." }\n\nCEVAP:\n${answerText.trim()}`,
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

  const result = parseAndValidate(raw, answerText);
  if (typeof result === "string") {
    return NextResponse.json({ message: result }, { status: 422 });
  }

  return NextResponse.json(result);
}
