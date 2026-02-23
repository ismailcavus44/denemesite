import type { ContentBlock } from "@/lib/blog-data";

/** Metinde *...* arası bold'u <strong> etiketine çevirir. */
function boldToHtml(text: string): string {
  return text.replace(/\*([^*]+)\*/g, "<strong>$1</strong>");
}

/** Tek bir ContentBlock'u HTML string'e çevirir. */
function blockToHtml(block: ContentBlock): string {
  switch (block.t) {
    case "h2":
      return `<h2>${escapeHtml(block.v)}</h2>`;
    case "h3":
      return `<h3>${escapeHtml(block.v)}</h3>`;
    case "p":
      return `<p>${boldToHtml(escapeHtml(block.v))}</p>`;
    case "ul":
      return `<ul>${block.v.map((li) => `<li>${boldToHtml(escapeHtml(li))}</li>`).join("")}</ul>`;
    default:
      return "";
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** contentBlocks dizisini tek bir HTML string'e dönüştürür. */
export function contentBlocksToHtml(blocks: ContentBlock[]): string {
  return blocks.map(blockToHtml).join("\n");
}
