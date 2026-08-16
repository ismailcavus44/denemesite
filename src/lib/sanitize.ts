import sanitize from "sanitize-html";

const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "ul", "ol", "li",
  "a", "strong", "em", "b", "i", "u", "s", "del", "ins",
  "blockquote", "cite", "pre", "code",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "colgroup", "col",
  "img", "figure", "figcaption",
  "span", "div", "section",
  "details", "summary",
  "sub", "sup", "mark",
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ["href", "target", "rel"],
  img: ["src", "alt", "width", "height", "loading"],
  table: ["class", "style"],
  th: ["colspan", "rowspan", "colwidth", "style", "class"],
  td: ["colspan", "rowspan", "colwidth", "style", "class"],
  col: ["span", "width", "style"],
  div: ["id", "class", "style", "data-type", "data-cta-type", "data-title", "data-button-text", "data-href", "data-content", "data-file-info", "data-davaci", "data-davali", "data-vekili", "data-konu", "data-aciklamalar", "data-dilekce-metni", "data-sonuc-talep", "data-tarih", "data-sifat", "data-imza"],
  blockquote: ["data-type", "data-title", "data-content", "class"],
  cite: ["class"],
  p: ["class"],
  "*": ["id", "class", "style", "data-nosnippet", "open", "aria-hidden", "data-type", "data-footnote-id", "data-n"],
};

const FILE_HREF_RE = /(?:drive|docs)\.google\.com/i;
const NOFOLLOW_REL = "noopener noreferrer nofollow";

function mergeRelValue(existing: string | undefined): string {
  const parts = new Set(
    `${existing ?? ""} ${NOFOLLOW_REL}`.split(/\s+/).filter(Boolean)
  );
  return [...parts].join(" ");
}

function mergeRelIntoAttrs(attrs: string): string {
  if (/\brel\s*=/i.test(attrs)) {
    return attrs.replace(/\brel\s*=\s*(["'])(.*?)\1/i, (_m, q: string, val: string) => {
      return `rel=${q}${mergeRelValue(val)}${q}`;
    });
  }
  return `${attrs} rel="${NOFOLLOW_REL}"`;
}

/** Evrak/dilekçe butonu ve Google Drive linklerine nofollow ekler. */
export function ensureNofollowOnFileLinks(html: string): string {
  let out = html.replace(
    /(<div\b[^>]*\bdata-type=["']download-button["'][^>]*>)([\s\S]*?)(<\/div>)/gi,
    (_m, open: string, inner: string, close: string) => {
      const patched = inner.replace(/<a\b([^>]*?)>/gi, (_a, attrs: string) => `<a${mergeRelIntoAttrs(attrs)}>`);
      return `${open}${patched}${close}`;
    }
  );

  out = out.replace(/<a\b([^>]*?)>/gi, (full, attrs: string) => {
    const href = attrs.match(/\bhref\s*=\s*(["'])(.*?)\1/i)?.[2] ?? "";
    if (!FILE_HREF_RE.test(href)) return full;
    return `<a${mergeRelIntoAttrs(attrs)}>`;
  });

  return out;
}

export function isGoogleDriveHref(href: string): boolean {
  return FILE_HREF_RE.test(href);
}

export function sanitizeHtml(dirty: string): string {
  const clean = sanitize(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        if (FILE_HREF_RE.test(href)) {
          attribs.rel = mergeRelValue(attribs.rel);
          if (!attribs.target) attribs.target = "_blank";
        }
        return { tagName, attribs };
      },
    },
  });
  return ensureNofollowOnFileLinks(clean);
}
