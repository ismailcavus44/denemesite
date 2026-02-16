/**
 * Cevap metninde sadece /rehber/ iç linklere izin verir. Hem sunucu hem istemcide çalışır.
 */
export function sanitizeAnswerHtml(html: string): string {
  if (!html?.trim()) return "";

  const rehberLinkRe = /<a\s+href="(\/rehber\/[a-z0-9-]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  const placeholders: string[] = [];
  let text = html.replace(rehberLinkRe, (_, href, inner) => {
    const slug = href.replace(/^\/rehber\//, "").replace(/[^a-z0-9-]/g, "");
    if (!slug) return inner;
    placeholders.push(`<a href="/rehber/${slug}">${inner}</a>`);
    return `\u0000${placeholders.length - 1}\u0000`;
  });

  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<[^>]+>/g, "");
  text = text.replace(/\u0000(\d+)\u0000/g, (_, i) => placeholders[Number(i)] ?? "");
  text = text.replace(/\n/g, "<br>");

  return text.trim();
}
