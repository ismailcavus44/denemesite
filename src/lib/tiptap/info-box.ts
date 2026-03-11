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
        class: "my-4 flex gap-3 rounded-r-lg border-l-4 border-blue-500 bg-blue-50 p-4",
      },
      ["span", { class: "shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white", "aria-hidden": "true" }, "i"],
      ["p", { class: "text-sm leading-relaxed text-slate-700" }, content],
    ];
  },
});
