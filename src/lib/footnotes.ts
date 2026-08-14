/**
 * Dipnot numaralandırma ve citation türetme — tek kaynak.
 * Numara ATTR’da tutulmaz; footnoteReference ilk-görünme sırasından türetilir.
 * Bu sitede makale gövdesi HTML saklanır; TipTap JSON da kabul edilir.
 */

export type FootnoteWalkNode = {
  type: string;
  text?: string;
  attrs?: Record<string, unknown> | null;
  content?: FootnoteWalkNode[];
};

function stripHtmlToText(html: string): string {
  return html
    .replace(/<a[^>]*class=["'][^"']*footnote-backlink[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function nodePlainText(node: FootnoteWalkNode): string {
  if (typeof node.text === "string") return node.text;
  if (!node.content?.length) return "";
  return node.content.map(nodePlainText).join("");
}

/** HTML gövdedeki (liste dışı) referansların ilk-görünme sırası. */
export function collectFootnoteIdsFromHtml(html: string): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();
  const re = /<sup[^>]*data-type=["']footnoteReference["'][^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const id = match[0].match(/data-footnote-id=["']([^"']+)["']/i)?.[1];
    if (id && !seen.has(id)) {
      seen.add(id);
      ids.push(id);
    }
  }
  return ids;
}

/** TipTap JSON gövdedeki referansların ilk-görünme sırası. */
export function collectFootnoteIdsInOrder(
  doc: FootnoteWalkNode | null | undefined
): string[] {
  if (!doc?.content) return [];
  const ids: string[] = [];
  const seen = new Set<string>();

  const walk = (node: FootnoteWalkNode) => {
    if (node.type === "footnoteList") return;
    if (node.type === "footnoteReference") {
      const id = node.attrs?.footnoteId;
      if (typeof id === "string" && id && !seen.has(id)) {
        seen.add(id);
        ids.push(id);
      }
      return;
    }
    if (node.content) {
      for (const child of node.content) walk(child);
    }
  };

  for (const child of doc.content) walk(child);
  return ids;
}

function indexFootnoteItemsFromHtml(html: string): Map<string, string> {
  const map = new Map<string, string>();
  const re = /<div([^>]*data-type=["']footnoteItem["'][^>]*)>([\s\S]*?)<\/div>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const id = match[1].match(/data-footnote-id=["']([^"']+)["']/i)?.[1];
    if (!id || map.has(id)) continue;
    const text = stripHtmlToText(match[2]);
    if (text) map.set(id, text);
  }
  return map;
}

function indexFootnoteItemsFromDoc(doc: FootnoteWalkNode): Map<string, string> {
  const map = new Map<string, string>();
  if (!doc.content) return map;
  for (const node of doc.content) {
    if (node.type !== "footnoteList" || !node.content) continue;
    for (const item of node.content) {
      if (item.type !== "footnoteItem") continue;
      const id = item.attrs?.footnoteId;
      if (typeof id !== "string" || !id || map.has(id)) continue;
      const text = nodePlainText(item).replace(/\s+/g, " ").trim();
      if (text) map.set(id, text);
    }
  }
  return map;
}

/**
 * Dipnot maddelerinden citation metinlerini, görünür listedeki sırayla çıkarır.
 * Boş sonuç: dipnot yok.
 */
export function extractCitations(
  source: string | FootnoteWalkNode | null | undefined
): string[] {
  if (!source) return [];

  if (typeof source === "string") {
    const ids = collectFootnoteIdsFromHtml(source);
    if (ids.length === 0) return [];
    const items = indexFootnoteItemsFromHtml(source);
    return ids.map((id) => items.get(id) ?? "").filter((t) => t.length > 0);
  }

  const ids = collectFootnoteIdsInOrder(source);
  if (ids.length === 0) return [];
  const items = indexFootnoteItemsFromDoc(source);
  return ids.map((id) => items.get(id) ?? "").filter((t) => t.length > 0);
}
