import { Node, mergeAttributes } from "@tiptap/core";

/**
 * Tek bir dipnot maddesi. footnoteId ile ilgili referansa bağlı.
 * İçerik: zengin paragraf (link, italik vb.).
 */
export const FootnoteItem = Node.create({
  name: "footnoteItem",
  content: "paragraph+",
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      footnoteId: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-footnote-id"),
        renderHTML: (attrs) =>
          attrs.footnoteId
            ? { "data-footnote-id": attrs.footnoteId as string }
            : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type='footnoteItem']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "footnoteItem",
        class: "footnote-item",
      }),
      0,
    ];
  },
});
