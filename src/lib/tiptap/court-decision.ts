import { Node } from "@tiptap/core";

export const CourtDecision = Node.create({
  name: "courtDecision",
  group: "block",
  atom: true,

  addAttributes() {
    const getTitle = (el: HTMLElement) =>
      el.getAttribute("data-title") || "";
    const getFileInfo = (el: HTMLElement) =>
      el.getAttribute("data-file-info") || "";
    const getContent = (el: HTMLElement) =>
      el.getAttribute("data-content") || "";
    return {
      title: {
        default: "Yargıtay 2. Hukuk Dairesi",
        parseHTML: (el) => getTitle(el as HTMLElement),
        renderHTML: (attrs) => ({ "data-title": attrs.title }),
      },
      fileInfo: {
        default: "Esas No: 2023/1234, Karar No: 2024/5678",
        parseHTML: (el) => getFileInfo(el as HTMLElement),
        renderHTML: (attrs) => ({ "data-file-info": attrs.fileInfo }),
      },
      content: {
        default: "",
        parseHTML: (el) => getContent(el as HTMLElement),
        renderHTML: (attrs) => ({ "data-content": attrs.content }),
      },
    };
  },

  parseHTML() {
    return [
      { tag: 'div[data-type="court-decision"]' },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const title = HTMLAttributes["data-title"] || "Yargıtay Kararı";
    const fileInfo = HTMLAttributes["data-file-info"] || "Esas No: -, Karar No: -";
    const content = HTMLAttributes["data-content"] || "Karar metnini buraya yazın.";

    return [
      "div",
      {
        "data-type": "court-decision",
        "data-title": title,
        "data-file-info": fileInfo,
        "data-content": content,
        class: "my-10 p-6 bg-white border border-slate-200 rounded-xl shadow-sm relative overflow-hidden not-prose",
      },
      [
        "div",
        { class: "flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-slate-100 pb-4 mb-4 gap-2" },
        ["div", { class: "text-slate-900 font-extrabold text-[15px] tracking-tight uppercase" }, title],
        ["div", { class: "text-slate-500 text-xs sm:text-sm font-mono bg-slate-50 px-2 py-1 rounded border border-slate-100 italic" }, fileInfo],
      ],
      ["p", { class: "text-slate-700 text-[14px] leading-relaxed font-sans m-0 whitespace-pre-wrap" }, content],
      ["span", { class: "absolute bottom-2 right-2 opacity-5 text-4xl select-none pointer-events-none", "aria-hidden": "true" }, "⚖"],
    ];
  },
});
