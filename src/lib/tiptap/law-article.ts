import { Node } from "@tiptap/core";

export const LawArticle = Node.create({
  name: "lawArticle",
  group: "block",
  atom: true,

  addAttributes() {
    const getTitle = (el: HTMLElement) =>
      el.getAttribute("data-title") || el.querySelector("cite")?.textContent?.trim() || "";
    const getContent = (el: HTMLElement) =>
      el.getAttribute("data-content") || el.querySelector("p")?.textContent?.trim() || "";
    return {
      title: {
        default: "Türk Medeni Kanunu Madde 166",
        parseHTML: (el) => getTitle(el as HTMLElement),
        renderHTML: (attrs) => ({ "data-title": attrs.title }),
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
      { tag: 'blockquote[data-type="law-article"]' },
      { tag: 'div[data-type="law-article"]' },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const title = HTMLAttributes["data-title"] || "Kanun maddesi başlığı";
    const content = HTMLAttributes["data-content"] || "Madde metnini buraya yazın.";

    return [
      "blockquote",
      {
        "data-type": "law-article",
        "data-title": title,
        "data-content": content,
        class: "relative my-8 border-l-4 border-slate-800 bg-slate-50 pl-4 pr-4 py-4 rounded-r-lg not-prose",
      },
      ["cite", { class: "text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 block font-sans" }, title],
      ["p", { class: "text-slate-800 text-[14px] leading-relaxed font-sans m-0" }, content],
    ];
  },
});
