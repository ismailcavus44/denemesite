import { Node } from "@tiptap/core";

export const DownloadButton = Node.create({
  name: "downloadButton",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      buttonText: {
        default: "Evrakı indir",
        parseHTML: (el) => (el as HTMLElement).getAttribute("data-button-text") || "Evrakı indir",
        renderHTML: (attrs) => ({ "data-button-text": attrs.buttonText }),
      },
      href: {
        default: "",
        parseHTML: (el) => (el as HTMLElement).getAttribute("data-href") || "",
        renderHTML: (attrs) => ({ "data-href": attrs.href }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="download-button"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const buttonText = HTMLAttributes["data-button-text"] || "Evrakı indir";
    const href = HTMLAttributes["data-href"] || "#";

    return [
      "div",
      {
        "data-type": "download-button",
        "data-button-text": buttonText,
        "data-href": href,
        class: "my-4 not-prose",
      },
      [
        "a",
        {
          href,
          target: "_blank",
          rel: "noopener noreferrer nofollow",
          class: "inline-flex items-center justify-center gap-1.5 rounded-md bg-slate-800 px-5 py-2.5 text-sm font-medium text-white no-underline hover:bg-slate-700 transition-colors",
        },
        buttonText,
        [
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            class: "shrink-0",
          },
          ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
          ["polyline", { points: "7 10 12 15 17 10" }],
          ["line", { x1: "12", y1: "15", x2: "12", y2: "3" }],
        ],
      ],
    ];
  },
});
