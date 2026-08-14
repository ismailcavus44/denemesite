import { Node, mergeAttributes } from "@tiptap/core";

/**
 * Metin içi dipnot işaretçisi. Atom inline node.
 * Attr: footnoteId (stabil uuid). Numara ATTR’da yok — sıradan türetilir.
 */
export const FootnoteReference = Node.create({
  name: "footnoteReference",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  draggable: true,

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
    return [{ tag: "sup[data-footnote-id][data-type='footnoteReference']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "sup",
      mergeAttributes(HTMLAttributes, {
        "data-type": "footnoteReference",
        class: "fn-mark footnote-reference",
      }),
    ];
  },
});
