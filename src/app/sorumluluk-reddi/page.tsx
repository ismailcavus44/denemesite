import type { Metadata } from "next";
import {
  LEGAL_DISCLAIMER_TITLE,
  LEGAL_DISCLAIMER_TEXT,
  LEGAL_DISCLAIMER_LIST_CEVAPLAR,
  LEGAL_DISCLAIMER_LIST_KABUL,
  LEGAL_DISCLAIMER_LIST_KABUL_SUFFIX,
} from "@/lib/legal-disclaimer";

export const metadata: Metadata = {
  title: "Sorumluluk Reddi",
  description:
    "Platformda verilen cevaplar genel hukuki bilgilendirme amaçlıdır; hukuki danışmanlık veya vekillik değildir. Kullanım koşulları.",
};

const isSectionHeading = (p: string) => /^\d+\.\s+/.test(p);
const headingClass = "font-bold text-slate-900";

export default function SorumlulukReddiPage() {
  const paragraphs = LEGAL_DISCLAIMER_TEXT.split(/\n\n+/).filter(Boolean);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">
        {LEGAL_DISCLAIMER_TITLE}
      </h1>
      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        {paragraphs.map((p, i) => {
          const trimmed = p.trim();
          if (trimmed === "__LIST_CEVAPLAR__") {
            return (
              <ul key={i} className="list-inside list-disc space-y-1 pl-2">
                {LEGAL_DISCLAIMER_LIST_CEVAPLAR.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          }
          if (trimmed === "__LIST_KABUL__") {
            return (
              <div key={i}>
                <ul className="list-inside list-disc space-y-1 pl-2">
                  {LEGAL_DISCLAIMER_LIST_KABUL.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
                <p className="mt-2">{LEGAL_DISCLAIMER_LIST_KABUL_SUFFIX}</p>
              </div>
            );
          }
          return (
            <p key={i} className={isSectionHeading(trimmed) ? headingClass : undefined}>
              {trimmed}
            </p>
          );
        })}
      </div>
    </div>
  );
}
