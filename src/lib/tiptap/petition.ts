import { Node } from "@tiptap/core";

const get = (el: HTMLElement, key: string) => el.getAttribute(`data-${key}`) ?? "";
const toJsKey = (k: string) => k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

/** Sadece mevcut dilekçe bloklarını parse/render için. Yeni ekleme UI yok. */
export const Petition = Node.create({
  name: "petition",
  group: "block",
  atom: true,

  addAttributes() {
    const attr = (dataKey: string, def = "") => ({
      default: def,
      parseHTML: (el: HTMLElement) => get(el, dataKey),
      renderHTML: (attrs: Record<string, string>) => ({ [`data-${dataKey}`]: attrs[toJsKey(dataKey)] ?? "" }),
    });
    return {
      title: attr("title", "ANKARA NÖBETÇİ ASLİYE HUKUK MAHKEMESİNE"),
      davaci: attr("davaci"),
      davali: attr("davali"),
      vekili: attr("vekili"),
      konu: attr("konu"),
      aciklamalar: attr("aciklamalar"),
      dilekceMetni: attr("dilekce-metni"),
      sonucTalep: attr("sonuc-talep"),
      tarih: attr("tarih"),
      sifat: attr("sifat"),
      imza: attr("imza"),
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="petition"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const g = (k: string) => HTMLAttributes[`data-${k}`] ?? "";
    const row = (label: string, val: string) => [
      "div",
      { class: "grid grid-cols-[100px_1fr] gap-2 mb-2 text-sm sm:text-base" },
      ["span", { class: "font-medium" }, label],
      ["span", {}, val],
    ];
    const title = g("title") || "Dilekçe Başlığı";
    const aciklamalar = g("aciklamalar");
    const dilekceMetni = g("dilekce-metni");
    const sonucTalep = g("sonuc-talep");
    const tarih = g("tarih");
    const sifat = g("sifat");
    const imza = g("imza");

    return [
      "div",
      {
        "data-type": "petition",
        "data-title": title,
        "data-davaci": g("davaci"),
        "data-davali": g("davali"),
        "data-vekili": g("vekili"),
        "data-konu": g("konu"),
        "data-aciklamalar": aciklamalar,
        "data-dilekce-metni": dilekceMetni,
        "data-sonuc-talep": sonucTalep,
        "data-tarih": tarih,
        "data-sifat": sifat,
        "data-imza": imza,
        class: "my-12 p-8 sm:p-12 bg-white border border-slate-300 shadow-xl max-w-4xl mx-auto font-serif text-slate-900 not-prose relative print:shadow-none",
      },
      ["div", { class: "text-center font-bold text-base sm:text-lg mb-8 uppercase leading-tight" }, title],
      row("Davacı:", g("davaci")),
      row("Davalı:", g("davali")),
      row("Vekili:", g("vekili")),
      row("Konu:", g("konu")),
      ["span", { class: "font-bold mt-6 mb-2 block uppercase text-sm border-b border-slate-100 pb-1" }, "Açıklamalar"],
      ["p", { class: "leading-relaxed text-justify mb-4 whitespace-pre-wrap" }, aciklamalar || "\u00A0"],
      ["span", { class: "font-bold mt-6 mb-2 block uppercase text-sm border-b border-slate-100 pb-1" }, "Dilekçe Metni"],
      ["p", { class: "leading-relaxed text-justify mb-4 whitespace-pre-wrap" }, dilekceMetni || "\u00A0"],
      ["span", { class: "font-bold mt-6 mb-2 block uppercase text-sm border-b border-slate-100 pb-1" }, "Sonuç ve Talep"],
      ["p", { class: "leading-relaxed text-justify mb-4 whitespace-pre-wrap" }, sonucTalep || "\u00A0"],
      [
        "div",
        { class: "flex flex-col items-end mt-12 text-center ml-auto w-fit" },
        ["div", { class: "text-sm" }, tarih || "Tarih"],
        ["div", { class: "text-sm font-medium mt-1" }, sifat || "Davacı/Davalı"],
        ["div", { class: "text-sm mt-1" }, imza || "İsim Soyisim"],
      ],
    ];
  },
});
