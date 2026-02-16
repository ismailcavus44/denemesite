import type { Metadata } from "next";
import { LEGAL_DISCLAIMER_TITLE, LEGAL_DISCLAIMER_TEXT } from "@/lib/legal-disclaimer";

export const metadata: Metadata = {
  title: "Sorumluluk Reddi",
  description:
    "Platformda verilen cevaplar genel hukuki bilgilendirme amaçlıdır; hukuki danışmanlık veya vekillik değildir. Kullanım koşulları.",
};

const SECTION3_INTRO_END = "Bu nedenle platformda verilen cevaplar:";
const SECTION3_ITEM_COUNT = 4;
const SECTION6_HEADING = "6. Kullanıcının Kabul Beyanı";
const SECTION6_INTRO = "Platformu kullanan her kullanıcı;";
const SECTION6_CLOSING_START = "peşinen kabul";

const listItemTrim = (s: string) => s.replace(/[,;]\s*$/, "");
const isSectionHeading = (p: string) => /^\d+\.\s+/.test(p);
const headingClass = "font-bold text-slate-900";

export default function SorumlulukReddiPage() {
  const paragraphs = LEGAL_DISCLAIMER_TEXT.split(/\n\n+/).filter(Boolean);
  const idx6 = paragraphs.findIndex((p) => p.startsWith(SECTION6_HEADING));
  const before6 = idx6 >= 0 ? paragraphs.slice(0, idx6) : paragraphs;
  const idx3InBefore = before6.findIndex((p) => p.includes(SECTION3_INTRO_END));
  const intro6 = idx6 >= 0 ? paragraphs[idx6 + 1] : null;
  const items6 =
    idx6 >= 0 && intro6 === SECTION6_INTRO
      ? paragraphs.slice(idx6 + 2, idx6 + 7).filter((p) => !p.startsWith(SECTION6_CLOSING_START))
      : [];
  const closing6 =
    idx6 >= 0 ? paragraphs.find((p) => p.startsWith(SECTION6_CLOSING_START)) : null;
  const hasSection6 = idx6 >= 0 && items6.length > 0;

  const hasSection3 =
    idx3InBefore >= 0 &&
    idx3InBefore + SECTION3_ITEM_COUNT + 1 < before6.length;
  const before3 = hasSection3 ? before6.slice(0, idx3InBefore + 1) : before6;
  const items3 = hasSection3
    ? before6.slice(idx3InBefore + 1, idx3InBefore + 1 + SECTION3_ITEM_COUNT)
    : [];
  const closing3 = hasSection3 ? before6[idx3InBefore + 1 + SECTION3_ITEM_COUNT] : null;
  const after3 = hasSection3 ? before6.slice(idx3InBefore + 1 + SECTION3_ITEM_COUNT + 1) : [];

  const renderBefore6 = () => {
    if (!hasSection3)
      return before6.map((p, i) => (
        <p key={i} className={isSectionHeading(p) ? headingClass : undefined}>{p}</p>
      ));
    return (
      <>
        {before3.map((p, i) => (
          <p key={i} className={isSectionHeading(p) ? headingClass : undefined}>{p}</p>
        ))}
        <ul className="list-inside list-disc space-y-1 pl-2">
          {items3.map((item, i) => (
            <li key={i}>{listItemTrim(item)}</li>
          ))}
        </ul>
        {closing3 && <p>{closing3}</p>}
        {after3.map((p, i) => (
          <p key={`after3-${i}`} className={isSectionHeading(p) ? headingClass : undefined}>{p}</p>
        ))}
      </>
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">
        {LEGAL_DISCLAIMER_TITLE}
      </h1>
      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        {renderBefore6()}
        {hasSection6 && (
          <>
            <p className={headingClass}>{SECTION6_HEADING}</p>
            <p>{SECTION6_INTRO}</p>
            <ul className="list-inside list-disc space-y-1 pl-2">
              {items6.map((item, i) => (
                <li key={i}>{listItemTrim(item)}</li>
              ))}
            </ul>
            {closing6 && <p>{closing6}</p>}
          </>
        )}
      </div>
    </div>
  );
}
