import { Node, mergeAttributes } from "@tiptap/core";

/**
 * Editör sonunda tek instance. Tüm footnoteItem’ları barındırır.
 * Document schema: `block+ footnoteList?`
 */
export const FootnoteList = Node.create({
  name: "footnoteList",
  content: "footnoteItem*",
  isolating: true,
  defining: true,

  parseHTML() {
    return [{ tag: "section[data-type='footnoteList']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "section",
      mergeAttributes(HTMLAttributes, {
        "data-type": "footnoteList",
        class: "footnote-list",
      }),
      0,
    ];
  },
});
