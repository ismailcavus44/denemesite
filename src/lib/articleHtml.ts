/** Başlık metninden id üretir (Türkçe uyumlu). */
function slugifyForId(text: string): string {
  const t = text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return t || "baslik";
}

export type TocItem = { id: string; label: string; level: "h2" | "h3" };

/**
 * HTML içindeki h2/h3 etiketlerine id ekler ve TOC listesi döner.
 * label için tag içindeki metin kullanılır (HTML strip).
 */
export function addHeadingIdsAndGetToc(html: string): { html: string; tocItems: TocItem[] } {
  const tocItems: TocItem[] = [];
  const used = new Set<string>();

  function makeId(text: string): string {
    const raw = slugifyForId(text);
    let id = raw;
    let n = 1;
    while (used.has(id)) {
      id = `${raw}-${n}`;
      n++;
    }
    used.add(id);
    return id;
  }

  function stripTags(s: string): string {
    return s.replace(/<[^>]+>/g, "").trim();
  }

  let out = html;

  // h2: <h2>...</h2> veya <h2 ...>...</h2>
  out = out.replace(/<h2(?:\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (_, inner) => {
    const label = stripTags(inner);
    const id = makeId(label);
    tocItems.push({ id, label, level: "h2" });
    return `<h2 id="${id}" class="mt-8 text-[26px] font-semibold text-slate-900 scroll-mt-6">${inner}</h2>`;
  });

  // h3
  out = out.replace(/<h3(?:\s[^>]*)?>([\s\S]*?)<\/h3>/gi, (_, inner) => {
    const label = stripTags(inner);
    const id = makeId(label);
    tocItems.push({ id, label, level: "h3" });
    return `<h3 id="${id}" class="mt-6 text-[22px] font-semibold text-slate-900 scroll-mt-6">${inner}</h3>`;
  });

  return { html: out, tocItems };
}
