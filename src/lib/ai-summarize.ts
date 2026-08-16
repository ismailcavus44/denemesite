export function buildArticleSummarizePrompt(title: string, url: string): string {
  return [
    "Aşağıdaki sayfayı aç ve yalnızca o sayfadaki bilgileri kaynak alarak özetle. Sayfada geçmeyen hiçbir bilgi ekleme, emin olamadığın noktaları açıkça belirt. Dilekçede doldurulması gereken alanları, başvuru merciini, yasal süreleri ve dikkat edilmesi gereken noktaları Türkçe olarak madde madde yaz. Özetin sonunda, somut olay için bir avukata danışılması gerektiğini hatırlat.",
    "",
    `"${title}"`,
    "",
    url,
  ].join("\n");
}

export type AiSummarizeProvider = {
  id: string;
  name: string;
  href: (prompt: string) => string;
};

export const AI_SUMMARIZE_PROVIDERS: AiSummarizeProvider[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    href: (prompt) => `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
  },
  {
    id: "claude",
    name: "Claude",
    href: (prompt) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
  },
  {
    id: "perplexity",
    name: "Perplexity",
    href: (prompt) => `https://www.perplexity.ai/?q=${encodeURIComponent(prompt)}`,
  },
  {
    id: "grok",
    name: "Grok",
    href: (prompt) => `https://grok.com/?q=${encodeURIComponent(prompt)}`,
  },
];
