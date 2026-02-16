import { callOpenAI, type OpenAIMessage } from "@/lib/ai/callOpenAI";

const SYSTEM = `Sen Türkçe hukuk içeriği yazan bir editörsün. Sadece istenen JSON çıktıyı ver.
Kurallar: Kanun/madde numarası verme. Genel, anlaşılır dil. 450-750 kelime arası pillar_md.
İçerikte "Bu içerik genel bilgilendirme amaçlıdır; hukuki danışmanlık değildir." ifadesi geçsin.`;

const H2_TEMPLATE = `
Pillar metinde mutlaka şu H2 başlıkları (Markdown: ## Başlık) kullan, sırayla:
- ## Bu kategori neyi kapsar?
- ## En sık karşılaşılan sorunlar
- ## Hak kaybı yaşanmaması için dikkat edilmesi gerekenler
- ## Süreç nasıl ilerler? (genel)
- ## Ne zaman profesyonel destek alınmalı?

Her H2 altında 1-3 paragraf yaz. Son başlık "Ne zaman profesyonel destek alınmalı?" kısa olsun ve profesyonel destek ihtiyacını vurgula.
`;

export type PillarResult = { intro: string; pillar_md: string };

export async function generateCategoryPillar(
  categoryName: string,
  categorySlug: string
): Promise<PillarResult> {
  const userPrompt = `${categoryName} (slug: ${categorySlug}) kategorisi için:
1) intro: 1-2 cümle, kategorinin ne olduğunu özetleyen kısa açıklama.
2) pillar_md: Yukarıdaki H2 şablonuna uygun, 450-750 kelime arası Markdown metin. Türkçe, hukuki ama anlaşılır.
${H2_TEMPLATE}

Yanıtı SADECE şu JSON formatında ver (pillar_md içinde \\n kullan, kaçış karakterlerine dikkat et):
{"intro":"...","pillar_md":"..."}`;

  const messages: OpenAIMessage[] = [
    { role: "system", content: SYSTEM },
    { role: "user", content: userPrompt },
  ];

  const raw = await callOpenAI(messages);
  const parsed = JSON.parse(raw) as { intro?: string; pillar_md?: string };
  const intro = typeof parsed.intro === "string" ? parsed.intro.trim() : "";
  const pillar_md = typeof parsed.pillar_md === "string" ? parsed.pillar_md.trim() : "";
  if (!intro || !pillar_md) {
    throw new Error("AI yanıtında intro veya pillar_md eksik.");
  }
  return { intro, pillar_md };
}
