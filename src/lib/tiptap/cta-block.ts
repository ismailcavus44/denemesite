import { Node } from "@tiptap/core";

export type CtaType = "contact" | "internal";

export const CtaBlock = Node.create({
  name: "ctaBlock",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      ctaType: {
        default: "contact",
        parseHTML: (el) => (el as HTMLElement).getAttribute("data-cta-type") || "contact",
        renderHTML: (attrs) => ({ "data-cta-type": attrs.ctaType }),
      },
      title: {
        default: "Hukuki süreciniz için yardıma mı ihtiyacınız var?",
        parseHTML: (el) => (el as HTMLElement).getAttribute("data-title") || "",
        renderHTML: (attrs) => ({ "data-title": attrs.title }),
      },
      buttonText: {
        default: "Bizimle İletişime Geçin",
        parseHTML: (el) => (el as HTMLElement).getAttribute("data-button-text") || "",
        renderHTML: (attrs) => ({ "data-button-text": attrs.buttonText }),
      },
      href: {
        default: "/iletisim",
        parseHTML: (el) => (el as HTMLElement).getAttribute("data-href") || "/iletisim",
        renderHTML: (attrs) => ({ "data-href": attrs.href }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="cta-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const type = HTMLAttributes["data-cta-type"] || "contact";
    const title = HTMLAttributes["data-title"] || (type === "contact" ? "Hukuki süreciniz için yardıma mı ihtiyacınız var?" : "Diğer rehberimizi inceleyebilirsiniz:");
    const buttonText = HTMLAttributes["data-button-text"] || (type === "contact" ? "Bizimle İletişime Geçin" : "Rehbere Git");
    const href = HTMLAttributes["data-href"] || "/iletisim";

    return [
      "div",
      {
        "data-type": "cta-block",
        "data-cta-type": type,
        "data-title": title,
        "data-button-text": buttonText,
        "data-href": href,
        class: "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg my-6 not-prose",
      },
      ["span", { class: "text-slate-800 m-0 flex-1 font-medium text-sm" }, title],
      [
        "a",
        {
          href,
          class: "whitespace-nowrap bg-slate-900 text-white! no-underline! hover:bg-slate-800 px-5 py-2.5 rounded-md font-semibold transition-colors text-sm",
          ...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {}),
        },
        buttonText,
      ],
    ];
  },
});
