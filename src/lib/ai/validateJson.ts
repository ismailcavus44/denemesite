import { z } from "zod";

export const schemaTitle = z.object({
  title: z.string().min(1),
});

export const schemaAnswer = z.object({
  answer: z.string().min(1),
});

export const schemaConceptLink = z.object({
  main_concept: z.string(),
  pillar_slug: z.string().nullable(),
  pillar_url: z.string().nullable(),
  anchor_sentence: z.string(),
  reason: z.string(),
});

export const schemaCardSummary = z.object({
  summary: z.string().min(1),
});

export const schemaSeo = z.object({
  slug: z.string().min(1),
  meta_title: z.string().min(1),
  meta_description: z.string().min(1),
});

export const schemaClassify = z.object({
  category: z.string().min(1),
});

export type TitleResult = z.infer<typeof schemaTitle>;
export type AnswerResult = z.infer<typeof schemaAnswer>;
export type ConceptLinkResult = z.infer<typeof schemaConceptLink>;
export type CardSummaryResult = z.infer<typeof schemaCardSummary>;
export type SeoResult = z.infer<typeof schemaSeo>;
export type ClassifyResult = z.infer<typeof schemaClassify>;

const TASK_SCHEMAS = {
  TITLE: schemaTitle,
  CLASSIFY: schemaClassify,
  ANSWER: schemaAnswer,
  CONCEPT_LINK: schemaConceptLink,
  CARD_SUMMARY: schemaCardSummary,
  SEO: schemaSeo,
} as const;

export type AITask = keyof typeof TASK_SCHEMAS;

export function validateJson<T extends AITask>(
  task: T,
  raw: string
): z.infer<(typeof TASK_SCHEMAS)[T]> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Geçersiz JSON yanıtı.");
  }
  const schema = TASK_SCHEMAS[task];
  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new Error(result.error.flatten().formErrors[0] ?? "Doğrulama hatası.");
  }
  return result.data as z.infer<(typeof TASK_SCHEMAS)[T]>;
}
