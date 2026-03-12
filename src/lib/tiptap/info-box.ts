import { Node } from "@tiptap/core";

export const InfoBox = Node.create({
  name: "infoBox",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      content: {
        default: "",
        parseHTML: (el) => (el as HTMLElement).getAttribute("data-content") || "",
        renderHTML: (attrs) => ({ "data-content": attrs.content }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="info-box"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const content = HTMLAttributes["data-content"] || "Önemli bilgi veya uyarı metnini buraya yazın.";

    return [
      "div",
      {
        "data-type": "info-box",
        "data-content": content,
        class: "my-4 flex items-center gap-4 rounded-r-lg border-l-4 border-blue-500 bg-blue-50 p-4",
      },
      ["span", { class: "shrink-0 flex items-center justify-center text-4xl font-bold text-blue-500", "aria-hidden": "true" }, "!"],
      ["p", { class: "text-sm leading-relaxed text-slate-700 m-0" }, content],
    ];
  },
});
