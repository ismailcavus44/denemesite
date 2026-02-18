/**
 * Toplu e-posta şablonları. Soru cevaplandı maili ile aynı tasarım.
 * {{site_url}} sayfada site adresi ile değiştirilir.
 */
const SITE = "YasalHaklarınız";

/** Soru cevaplandı mailindeki gibi tek tip gövde: başlık, içerik, CTA butonu, footer */
function wrapEmail(title: string, bodyHtml: string, cta?: { text: string; url: string }): string {
  const ctaBlock =
    cta &&
    `<a href="${cta.url}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#111;color:#fff!important;text-decoration:none;border-radius:6px;font-size:14px;font-weight:500">${cta.text}</a>`;
  return `<div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1a1a1a;background:#fff">
  <h2 style="margin:0 0 20px;font-size:20px;font-weight:600;color:#111">${title}</h2>
  <div style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#333">
${bodyHtml}
  </div>
  ${ctaBlock ?? ""}
  <hr style="margin:28px 0;border:none;border-top:1px solid #e5e5e5" />
  <p style="margin:0;font-size:12px;color:#999">Bu e-posta ${SITE} tarafından gönderilmiştir.</p>
</div>`;
}

/** Paragraf stili (inline) */
function p(html: string): string {
  return `    <p style="margin:0 0 12px">${html}</p>`;
}

export type MailTemplate = {
  id: string;
  name: string;
  group: "reklam" | "son_makale" | "ozel_gun";
  subject: string;
  html: string;
};

export const MAIL_TEMPLATES: MailTemplate[] = [
  {
    id: "reklam-genel",
    name: "Reklam / Tanıtım (genel)",
    group: "reklam",
    subject: `${SITE} ile hukuki haklarınızı keşfedin`,
    html: wrapEmail(
      "Hukuki haklarınızı keşfedin",
      [
        p(`Merhaba,`),
        p(`<strong>${SITE}</strong> olarak size ulaşmak istedik. Miras, boşanma, iş hukuku, icra ve daha birçok alanda sorularınızı sorabilir, editör onaylı cevaplar ve rehber yazılarımızdan faydalanabilirsiniz.`),
        p(`Ücretsiz ve sade bir şekilde hukuki bilgiye ulaşmak için bizi ziyaret edin.`),
      ].join("\n"),
      { text: "Siteye git", url: "{{site_url}}" }
    ),
  },
  {
    id: "reklam-yeni-sorular",
    name: "Reklam – Yeni soru-cevaplar",
    group: "reklam",
    subject: `Yeni cevaplanan sorular ${SITE}'da`,
    html: wrapEmail(
      "Yeni soru ve cevaplar yayında",
      [
        p(`Merhaba,`),
        p(`<strong>${SITE}</strong>'da yeni soru ve cevaplar yayınlandı. Miras, aile, iş ve icra hukuku gibi konularda güncel içeriklerden haberdar olun.`),
        p(`Cevaplanan sorulara tek tıkla ulaşabilirsiniz.`),
      ].join("\n"),
      { text: "Tüm sorulara göz atın", url: "{{site_url}}/sorular" }
    ),
  },
  {
    id: "son-makale-genel",
    name: "Son rehber yazısı (genel)",
    group: "son_makale",
    subject: `Yeni rehber: [Başlığı buraya yazın] – ${SITE}`,
    html: wrapEmail(
      "Yeni rehber yazımız",
      [
        p(`Merhaba,`),
        p(`<strong>${SITE}</strong>'da yeni bir rehber yazısı yayınlandı.`),
        p(`<strong>Başlık:</strong> [Rehber başlığını buraya yazın]`),
        p(`Konuyla ilgili sade ve anlaşılır bilgi için yazımıza göz atabilirsiniz.`),
      ].join("\n"),
      { text: "Rehber sayfasına git", url: "{{site_url}}/rehber" }
    ),
  },
  {
    id: "ozel-yilbasi",
    name: "Özel gün – Yılbaşı",
    group: "ozel_gun",
    subject: `Yeni yılınız kutlu olsun – ${SITE}`,
    html: wrapEmail(
      "Yeni yılınız kutlu olsun",
      [
        p(`Merhaba,`),
        p(`<strong>${SITE}</strong> ailesi olarak yeni yılınızı kutlar, sağlık ve huzur dolu günler dileriz.`),
        p(`Yeni yılda hukuki haklarınızı öğrenmek ve sorularınızı sormak için yanınızdayız.`),
        p(`İyi yıllar.`),
      ].join("\n"),
      { text: "Siteyi ziyaret et", url: "{{site_url}}" }
    ),
  },
  {
    id: "ozel-bayram",
    name: "Özel gün – Bayram",
    group: "ozel_gun",
    subject: `Bayramınız kutlu olsun – ${SITE}`,
    html: wrapEmail(
      "Bayramınız kutlu olsun",
      [
        p(`Merhaba,`),
        p(`<strong>${SITE}</strong> olarak bayramınızı en içten dileklerimizle kutlarız.`),
        p(`Sağlık, huzur ve mutluluk dolu bir bayram geçirmenizi dileriz.`),
        p(`İyi bayramlar.`),
      ].join("\n"),
    ),
  },
  {
    id: "ozel-teşekkür",
    name: "Özel – Teşekkür / Hatırlatma",
    group: "ozel_gun",
    subject: `Bizi tercih ettiğiniz için teşekkürler – ${SITE}`,
    html: wrapEmail(
      "Teşekkür ederiz",
      [
        p(`Merhaba,`),
        p(`<strong>${SITE}</strong>'a gösterdiğiniz ilgi için teşekkür ederiz.`),
        p(`Hukuki sorularınızı sormaya ve rehber yazılarımızdan faydalanmaya devam edebilirsiniz.`),
      ].join("\n"),
      { text: "Siteyi ziyaret edin", url: "{{site_url}}" }
    ),
  },
];

const GROUP_LABELS: Record<MailTemplate["group"], string> = {
  reklam: "Reklam / Tanıtım",
  son_makale: "Son makale / Rehber",
  ozel_gun: "Özel günler",
};

export function getTemplateGroups(): { group: MailTemplate["group"]; label: string; templates: MailTemplate[] }[] {
  const groups: MailTemplate["group"][] = ["reklam", "son_makale", "ozel_gun"];
  return groups.map((group) => ({
    group,
    label: GROUP_LABELS[group],
    templates: MAIL_TEMPLATES.filter((t) => t.group === group),
  }));
}

export function getTemplateById(id: string): MailTemplate | undefined {
  return MAIL_TEMPLATES.find((t) => t.id === id);
}

/** Şablondaki {{site_url}} placeholder'ını doldurur */
export function resolveTemplateHtml(html: string, siteUrl?: string): string {
  const url = siteUrl ?? (typeof window !== "undefined" ? window.location.origin : "");
  return html.replace(/\{\{site_url\}\}/g, url);
}
