import DOMPurify from "isomorphic-dompurify";

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

const ALLOWED_ATTR = [
  "href", "target", "rel", "id", "class", "style",
  "src", "alt", "width", "height", "loading",
  "data-nosnippet", "open",
];

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}
