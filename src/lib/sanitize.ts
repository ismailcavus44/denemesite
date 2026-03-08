import sanitize from "sanitize-html";

const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "ul", "ol", "li",
  "a", "strong", "em", "b", "i", "u", "s", "del", "ins",
  "blockquote", "pre", "code",
  "table", "thead", "tbody", "tr", "th", "td",
  "img", "figure", "figcaption",
  "span", "div", "section",
  "details", "summary",
  "sub", "sup", "mark",
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ["href", "target", "rel"],
  img: ["src", "alt", "width", "height", "loading"],
  "*": ["id", "class", "style", "data-nosnippet", "open"],
};

export function sanitizeHtml(dirty: string): string {
  return sanitize(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
  });
}
