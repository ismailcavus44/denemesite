import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { callOpenAI, type OpenAIMessage } from "@/lib/ai/callOpenAI";

const SEO_SYSTEM = `Sen Türkiye'nin en büyük hukuki danışmanlık platformu olan 'Yasalhaklarınız'ın Baş SEO Uzmanı ve Kıdemli Avukatısın. Sana vatandaşlar tarafından yazılmış, genellikle imla hataları içeren, sokak ağzıyla ve duygusal bir dille yazılmış ham hukuki sorular verilecek.
GÖREVİN: Bu ham metni analiz edip; sokağın dilini profesyonel hukuk diline çevirerek kusursuz SEO alanları (Title, Description, Slug) oluşturmaktır.
KATI KURALLAR:
1. Asla Sokak Ağzı Kullanma: Vatandaş 'dövüş, kavga, kağıt geldi, içeri attılar' dese bile bunları hukuki karşılıklarına çevir (Örn: Darp, Kasten Yaralama, Meşru Müdafaa, Tebligat, Soruşturma, Tutuklama).
2. Meta Title: Maksimum 60 karakter. Hukuki sorunun özünü yansıtan, profesyonel ve ilgi çekici bir başlık olmalı.
3. Meta Description: 140-160 karakter. Durumu özetleyen ve tıkla-oku hissi uyandıran hukuki bir ön açıklama olmalı.
4. SEO Slug: Sadece küçük harf, Türkçe karakter içermeyen, boşluklar yerine tire (-) kullanılan URL uzantısı.
5. ÇIKTI FORMATI: Ekstra hiçbir metin, markdown (\`\`\`json) veya açıklama eklemeden SADECE aşağıdaki yapıda geçerli bir JSON objesi dön:
{"slug": "olusturulan-slug", "metaTitle": "Oluşturulan Başlık", "metaDescription": "Oluşturulan açıklama"}`;

function buildUserMessage(questionText: string, answerText: string | undefined): string {
  let out = questionText;
  if (answerText?.trim()) {
    out += `\n\nCEVAP (sayfa içeriğini yansıtmak için):\n${answerText.trim()}`;
  }
  return out;
}

function cleanRawResponse(raw: string): string {
  return raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
}

function parseAndValidate(
  body: string
): { slug: string; meta_title: string; meta_description: string } | string {
  const cleaned = cleanRawResponse(body);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return "Geçersiz JSON.";
  }
  if (!parsed || typeof parsed !== "object") return "Geçersiz JSON.";
  const o = parsed as Record<string, unknown>;
  const slug = typeof o.slug === "string" ? o.slug.trim() : "";
  const meta_title =
    (typeof o.meta_title === "string" ? o.meta_title : typeof o.metaTitle === "string" ? o.metaTitle : "").trim();
  const meta_description =
    (
      typeof o.meta_description === "string"
        ? o.meta_description
        : typeof o.metaDescription === "string"
          ? o.metaDescription
          : ""
    ).trim();
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
    { role: "user", content: buildUserMessage(questionText, answerText) },
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
