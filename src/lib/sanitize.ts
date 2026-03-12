import sanitize from "sanitize-html";

const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "ul", "ol", "li",
  "a", "strong", "em", "b", "i", "u", "s", "del", "ins",
  "blockquote", "cite", "pre", "code",
  "table", "thead", "tbody", "tr", "th", "td",
  "img", "figure", "figcaption",
  "span", "div", "section",
  "details", "summary",
  "sub", "sup", "mark",
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ["href", "target", "rel"],
  img: ["src", "alt", "width", "height", "loading"],
  div: ["id", "class", "style", "data-type", "data-cta-type", "data-title", "data-button-text", "data-href", "data-content", "data-file-info", "data-davaci", "data-davali", "data-vekili", "data-konu", "data-aciklamalar", "data-dilekce-metni", "data-sonuc-talep", "data-tarih", "data-sifat", "data-imza"],
  blockquote: ["data-type", "data-title", "data-content", "class"],
  cite: ["class"],
  p: ["class"],
  "*": ["id", "class", "style", "data-nosnippet", "open", "aria-hidden"],
};

export function sanitizeHtml(dirty: string): string {
  return sanitize(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
  });
}
