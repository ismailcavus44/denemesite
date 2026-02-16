import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { callOpenAI, type OpenAIMessage } from "@/lib/ai/callOpenAI";
import {
  validateJson,
  type AITask,
  type TitleResult,
  type ClassifyResult,
  type AnswerResult,
  type ConceptLinkResult,
  type CardSummaryResult,
  type SeoResult,
} from "@/lib/ai/validateJson";

const CLASSIFY_CATEGORIES = [
  "ceza_hukuku",
  "tapu_ve_tasinmaz",
  "miras_hukuku",
  "icra_ve_borclar",
  "is_hukuku",
  "kira_hukuku",
  "aile_hukuku",
  "tuketici_hukuku",
  "genel_ozel_hukuk",
] as const;

function getPrompts(task: AITask, userInput: string): OpenAIMessage[] {
  const systemTitles: Record<AITask, string> = {
    TITLE:
      "You are an editor for a Turkish legal Q&A platform. Convert messy or long user question into a clean, searchable 1-sentence title. Do NOT change meaning. Output only valid JSON.",
    CLASSIFY:
      "Sen bir hukuk içerik editörüsün. Görevin sadece sorunun hangi hukuki alana ait olduğunu tespit etmektir. Cevap yazma. Yorum yapma. Output only valid JSON.",
    ANSWER:
      "Sen, Türkçe vatandaş diliyle (sen dili) hukuki bilgilendirme yapan bir editörsün. Chatbot gibi konuşmazsın. Genel geçer motivasyon cümleleri kurmazsın. Kanun/madde numarası vermezsin. Maddeleme/numaralandırma/emoji yok. Kısa cümleler. Output only valid JSON.",
    CONCEPT_LINK:
      "Sen bir içerik stratejistisin. Tek bir ana kavram seçeceksin ve tek bir pillar link eşleyeceksin. JSON dışında hiçbir şey yazma.",
    CARD_SUMMARY:
      "You are writing a homepage card teaser. It must not copy the answer verbatim. Output only valid JSON.",
    SEO:
      "You generate SEO fields for a single Q&A detail page. Unique, intent-based, Turkish. Output only valid JSON.",
  };
  const userTemplates: Record<AITask, string> = {
    TITLE: `Given QUESTION_TEXT, produce JSON: { "title": "..." }
Rules: Turkish, 8–14 words, natural question, no legal article numbers, no emojis. Keep intent and key entities (miras, hisseli tapu, kira, icra). If already short and clean, lightly improve.

QUESTION_TEXT:
${userInput}`,
    CLASSIFY: `QUESTION_TEXT verildi. Aşağıdaki kategorilerden SADECE BİR TANESİNİ seç ve JSON döndür.

Kategoriler:
- ceza_hukuku
- tapu_ve_tasinmaz
- miras_hukuku
- icra_ve_borclar
- is_hukuku
- kira_hukuku
- aile_hukuku
- tuketici_hukuku
- genel_ozel_hukuk

JSON formatı:
{ "category": "..." }

Kurallar:
- "sahte imza", "evrakta sahtecilik", "imzam taklit edildi" → ceza_hukuku
- "tapu", "arsa", "tarla", "ev devri" → tapu_ve_tasinmaz
- "baba", "miras", "ölüm", "kardeş" → miras_hukuku
- SADECE en baskın alanı seç.
- Emin değilsen "genel_ozel_hukuk" seç.

QUESTION_TEXT:
${userInput}`,
    ANSWER: `QUESTION_TEXT ve CATEGORY verildi. JSON üret: { "answer": "..." }

ÖNEMLİ: CATEGORY dışına ÇIKAMAZSIN. Cevapta CATEGORY ile ilgisiz bir alan geçerse bu bir hatadır.
- Eğer CATEGORY = ceza_hukuku ise: Tapu, miras, bağış, satış gibi konulara ASLA girme. Sadece sahte imza, sorumluluk, itiraz, delil, şikayet mantığıyla yaz.
- Eğer CATEGORY = tapu_ve_tasinmaz veya miras_hukuku ise: İşlem türü (satış/bağış/başka), senaryolar ve ilk adım mantığını kullan.

Kurallar:
- 140–190 kelime arası.
- "Olabilir" yanında mutlaka koşul: "Eğer X ise…, değilse…"
- 4 unsur: 1) Somut ayrım (işlem türü veya alana özel), 2) En az 3 senaryo, 3) İlk yapılacak şey, 4) Sonda CTA: "Benzer sorulara da göz atabilirsin."
- "Avukat" en fazla 1 kez, reklam değil. Sonuç vaat etme yok. Düz metin, tek paragraf.

QUESTION_TEXT ve CATEGORY:
${userInput}`,
    CONCEPT_LINK: `QUESTION_TEXT ve PILLARS listesi verildi. JSON üret:
{
 "main_concept": "...",
 "pillar_slug": "... or null",
 "pillar_url": "... or null",
 "anchor_sentence": "...",
 "reason": "..."
}

Kurallar:
- main_concept 1–3 kelime olmalı ve "işin çözüm yolunu" göstermeli.
- Aşağıdaki kavramları ASLA seçme (çok genel): "mülkiyet hakkı", "hak", "hukuk", "dava", "mağduriyet", "adalet".
- Bu soru tiplerinde tercih sırası:
  - Devir geri alma / kayıt değişikliği isteniyorsa: "tapu iptali"
  - Mirasçıların devirle hak kaybı varsa: "muris muvazaası" veya "tenkis"
  - Baskı/aldatma/ehliyet şüphesi varsa: "irade sakatlığı" veya "ehliyetsizlik"
  - Vekaletle işlem varsa: "vekaletin kötüye kullanılması"
- PILLARS ile iyi eşleşme yoksa pillar_slug/url null döndür.
- anchor_sentence tek cümle olacak ve main_concept tam 1 kez geçecek.
- "Sahte imza", "evrakta sahtecilik", "imzam taklit edildi" gibi sorularda: main_concept = "sahte imza" veya "evrakta sahtecilik", pillar_slug ve pillar_url = null (ceza rehberi yoksa).

${userInput}`,
    CARD_SUMMARY: `Given QUESTION_TITLE and ANSWER_DRAFT, output JSON: { "summary": "..." }
Rules: 80–120 chars Turkish, teaser not full answer, not first 100 chars of answer, no emojis, plain sentence.

${userInput}`,
    SEO: `Given QUESTION_TEXT and AI_TITLE, output JSON: { "slug": "...", "meta_title": "...", "meta_description": "..." }
Rules: slug lowercase hyphen 4–8 words. meta_title 45–60 chars. meta_description 140–160 chars. Unique, context-specific. No emojis.

${userInput}`,
  };
  return [
    { role: "system", content: systemTitles[task] },
    { role: "user", content: userTemplates[task] },
  ];
}

type PillarRow = { title: string; slug: string; url: string; synonyms: string[] | null };

export async function POST(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  let body: { task?: string; questionId?: string };
  try {
    body = (await request.json()) as { task?: string; questionId?: string };
  } catch {
    return NextResponse.json({ message: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const task = body.task as AITask | undefined;
  const questionId = body.questionId;

  const allowed: AITask[] = ["TITLE", "CLASSIFY", "ANSWER", "CONCEPT_LINK", "CARD_SUMMARY", "SEO"];
  if (!task || !allowed.includes(task) || !questionId) {
    return NextResponse.json(
      { message: "task (TITLE|CLASSIFY|ANSWER|CONCEPT_LINK|CARD_SUMMARY|SEO) ve questionId gerekli." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();

  const { data: question, error: qErr } = await supabase
    .from("questions")
    .select(
      "id,title,body,ai_title,ai_answer_draft,ai_main_concept,ai_pillar_slug,ai_pillar_url,ai_category,ai_card_summary,seo_slug,seo_title,seo_description"
    )
    .eq("id", questionId)
    .maybeSingle();

  if (qErr || !question) {
    return NextResponse.json({ message: "Soru bulunamadı." }, { status: 404 });
  }

  const questionText = [question.title, question.body].filter(Boolean).join("\n\n");
  const aiTitle = question.ai_title ?? question.title;
  const answerDraft = question.ai_answer_draft ?? "";
  const mainConcept = question.ai_main_concept ?? "";

  let userPrompt = "";
  let categoryForAnswer: string | null = (question as { ai_category?: string | null }).ai_category ?? null;

  if (task === "ANSWER" && !categoryForAnswer) {
    const classifyRaw = await callOpenAI(getPrompts("CLASSIFY", questionText));
    const classifyParsed = validateJson("CLASSIFY", classifyRaw) as ClassifyResult;
    const cat = CLASSIFY_CATEGORIES.includes(classifyParsed.category as (typeof CLASSIFY_CATEGORIES)[number])
      ? classifyParsed.category
      : "genel_ozel_hukuk";
    categoryForAnswer = cat;
    await supabase
      .from("questions")
      .update({ ai_category: cat, ai_updated_at: new Date().toISOString() })
      .eq("id", questionId);
  }

  switch (task) {
    case "TITLE":
      userPrompt = `QUESTION_TEXT:\n${questionText}`;
      break;
    case "CLASSIFY":
      userPrompt = questionText;
      break;
    case "ANSWER": {
      const catPart = categoryForAnswer ? `\nCATEGORY: ${categoryForAnswer}` : "";
      userPrompt = mainConcept
        ? `QUESTION_TEXT:\n${questionText}${catPart}\n\nMAIN_CONCEPT (mention naturally once): ${mainConcept}`
        : `QUESTION_TEXT:\n${questionText}${catPart}`;
      break;
    }
    case "CONCEPT_LINK": {
      const { data: pillars } = await supabase
        .from("pillars")
        .select("title,slug,url,synonyms")
        .eq("is_active", true);
      const pillarsList = (pillars ?? []) as PillarRow[];
      userPrompt = `QUESTION_TEXT:\n${questionText}\n\nPILLARS:\n${JSON.stringify(pillarsList, null, 2)}`;
      break;
    }
    case "CARD_SUMMARY":
      userPrompt = `QUESTION_TITLE: ${aiTitle}\n\nANSWER_DRAFT:\n${answerDraft}`;
      break;
    case "SEO":
      userPrompt = `QUESTION_TEXT:\n${questionText}\n\nAI_TITLE: ${aiTitle}`;
      break;
    default:
      return NextResponse.json({ message: "Bilinmeyen task." }, { status: 400 });
  }

  let raw: string;
  try {
    raw = await callOpenAI(getPrompts(task, userPrompt));
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "AI çağrısı başarısız." },
      { status: 502 }
    );
  }

  let parsed: TitleResult | ClassifyResult | AnswerResult | ConceptLinkResult | CardSummaryResult | SeoResult;
  try {
    parsed = validateJson(task, raw);
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Yanıt doğrulaması başarısız." },
      { status: 422 }
    );
  }

  const now = new Date().toISOString();
  const update: Record<string, unknown> = { ai_version: "v1", ai_updated_at: now };

  switch (task) {
    case "TITLE":
      update.ai_title = (parsed as TitleResult).title;
      break;
    case "CLASSIFY":
      update.ai_category = (parsed as ClassifyResult).category;
      break;
    case "ANSWER":
      update.ai_answer_draft = (parsed as AnswerResult).answer;
      break;
    case "CONCEPT_LINK": {
      const c = parsed as ConceptLinkResult;
      update.ai_main_concept = c.main_concept;
      update.ai_pillar_slug = c.pillar_slug;
      update.ai_pillar_url = c.pillar_url;
      break;
    }
    case "CARD_SUMMARY":
      update.ai_card_summary = (parsed as CardSummaryResult).summary;
      break;
    case "SEO": {
      const s = parsed as SeoResult;
      update.seo_slug = s.slug;
      update.seo_title = s.meta_title;
      update.seo_description = s.meta_description;
      break;
    }
  }

  const { error: updateErr } = await supabase
    .from("questions")
    .update(update)
    .eq("id", questionId);

  if (updateErr) {
    return NextResponse.json({ message: updateErr.message }, { status: 400 });
  }

  return NextResponse.json(parsed);
}
