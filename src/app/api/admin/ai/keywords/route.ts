import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { callOpenAI, type OpenAIMessage } from "@/lib/ai/callOpenAI";

const SYSTEM = `Sen bir Türkçe hukuk Q&A platformu editörüsün. Görevin: Verilen soru metninden iki şey çıkarmak.

1) keywords: Tam 2 adet kısa anahtar kelime/ifade (SEO için). Soruda geçen kavramlar, küçük harf. Örn: miras, tapu iptali.
2) hukuki_uyusmazlik: Bu metindeki asıl hukuki uyuşmazlık nedir? Tek bir net ifade ver — editör iç link ekleyebilsin. Muris muvazaası mı, işçilik alacağı mı, boşanma tazminatı mı, icra takibi mi, kira feshi mi? Tam olarak tek kavram/ifade (2–5 kelime), Türkçe.

Çıktı SADECE geçerli JSON: { "keywords": ["kelime1", "kelime2"], "hukuki_uyusmazlik": "örn. muris muvazaası" }`;

type KeywordsResult = { keywords: string[]; hukuki_uyusmazlik: string };

function parseKeywords(raw: string): KeywordsResult | string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return "Geçersiz JSON.";
  }
  if (!parsed || typeof parsed !== "object") return "Geçersiz JSON.";
  const o = parsed as { keywords?: unknown; hukuki_uyusmazlik?: unknown };
  const arr = o.keywords;
  if (!Array.isArray(arr) || arr.length !== 2) return "keywords 2 elemanlı dizi olmalı.";
  const keywords = arr
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim())
    .filter(Boolean);
  if (keywords.length !== 2) return "2 geçerli anahtar kelime gerekli.";
  const hukuki =
    o.hukuki_uyusmazlik != null && typeof o.hukuki_uyusmazlik === "string"
      ? o.hukuki_uyusmazlik.trim()
      : "";
  if (!hukuki) return "hukuki_uyusmazlik boş olamaz.";
  return { keywords, hukuki_uyusmazlik: hukuki };
}

export async function POST(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  let body: { question_text?: string };
  try {
    body = (await request.json()) as { question_text?: string };
  } catch {
    return NextResponse.json({ message: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const questionText = typeof body.question_text === "string" ? body.question_text.trim() : "";
  if (!questionText) {
    return NextResponse.json({ message: "question_text gerekli." }, { status: 400 });
  }

  const messages: OpenAIMessage[] = [
    { role: "system", content: SYSTEM },
    {
      role: "user",
      content: `Soru metninden 2 anahtar kelime ve bu metindeki asıl hukuki uyuşmazlığı (tek kavram) çıkar. İç link için tam olarak ne? Sadece JSON ver.\n\nSORU METNİ:\n${questionText}`,
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

  const result = parseKeywords(raw);
  if (typeof result === "string") {
    return NextResponse.json({ message: result }, { status: 422 });
  }
  return NextResponse.json(result);
}
