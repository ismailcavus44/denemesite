import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { callOpenAI, type OpenAIMessage } from "@/lib/ai/callOpenAI";

const SYSTEM = `Sen Türkiye'nin en büyük hukuki danışmanlık platformu olan 'Yasalhaklarınız'ın Baş SEO Uzmanı ve Kıdemli Avukatısın. Sana vatandaşlar tarafından yazılmış, genellikle imla hataları içeren, sokak ağzıyla ve duygusal bir dille yazılmış ham hukuki sorular verilecek.

GÖREVİN: Bu ham metni analiz edip; sokağın dilini profesyonel hukuk diline çevirerek 2 anahtar kelime ve asıl hukuki uyuşmazlık kavramını çıkarmaktır.

KATI KURALLAR:
1. Asla Sokak Ağzı Kullanma: Vatandaş "dövüş, kavga, kağıt geldi, içeri attılar" dese bile bunları hukuki karşılıklarına çevir (Darp, Kasten Yaralama, Meşru Müdafaa, Tebligat, Soruşturma, Tutuklama vb.). Anahtar kelime ve hukuki_uyusmazlik profesyonel hukuk diliyle olmalı.
2. keywords: Tam 2 adet kısa anahtar kelime/ifade (SEO için). Hukuki kavramlar, küçük harf. Örn: miras payı, tapu iptali, darp, tebligat, icra takibi, kira feshi.
3. hukuki_uyusmazlik: Bu metindeki asıl hukuki uyuşmazlık tek bir net ifade (2–5 kelime). Profesyonel terim kullan: muris muvazaası, işçilik alacağı, boşanma tazminatı, icra takibi, kira feshi, kasten yaralama, meşru müdafaa vb.
4. ÇIKTI FORMATI: Ekstra metin veya markdown eklemeden SADECE geçerli JSON dön: { "keywords": ["kelime1", "kelime2"], "hukuki_uyusmazlik": "örn. muris muvazaası" }`;

type KeywordsResult = { keywords: string[]; hukuki_uyusmazlik: string };

function cleanRawResponse(raw: string): string {
  return raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
}

function parseKeywords(raw: string): KeywordsResult | string {
  const cleaned = cleanRawResponse(raw);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
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
