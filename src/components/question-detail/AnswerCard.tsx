"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Copy, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sanitizeAnswerHtml } from "@/lib/sanitize-answer-html";

export type GuideCta = { href: string; label: string };

type AnswerCardProps = {
  answerHtml: string;
  /** Cevap sonunda gösterilecek rehber linki (panelden manuel eklenir). */
  guideCta?: GuideCta | null;
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function estimateReadingMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function AnswerCard({ answerHtml, guideCta }: AnswerCardProps) {
  const [copied, setCopied] = useState(false);
  const hasAnswer = answerHtml?.trim().length > 0;
  const sanitized = sanitizeAnswerHtml(answerHtml ?? "");
  const readingMin = estimateReadingMinutes(sanitized); // şu an sadece istenirse gösterilebilir

  const handleCopy = async () => {
    const text = sanitized.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [waShareUrl, setWaShareUrl] = useState("#");
  useEffect(() => {
    const url = window.location.href;
    const text = document.title;
    setWaShareUrl(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`);
  }, []);

  if (!hasAnswer) {
    return (
      <section className="p-0">
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-slate-800" />
            <h2 className="text-xl font-bold text-slate-900">Cevap</h2>
          </div>
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
            Bu soru henüz cevaplanmadı.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="p-0">
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-slate-800" />
            <h2 className="text-xl font-bold text-slate-900">Cevap</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="size-9 text-slate-600"
              title={copied ? "Kopyalandı" : "Cevabı kopyala"}
              aria-label={copied ? "Kopyalandı" : "Cevabı kopyala"}
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
            <a
              href={waShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              aria-label="WhatsApp ile paylaş"
              title="WhatsApp ile paylaş"
            >
              <WhatsAppIcon className="size-4" />
            </a>
          </div>
        </div>

        <div
          className="mt-3 text-sm leading-7 text-slate-700 [&_a]:text-slate-800 [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />

        {guideCta?.href && guideCta?.label ? (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-700 underline">
              Sorunuzla ilgili rehber yazımızı inceleyebilirsiniz:
            </span>
            <Link
              href={guideCta.href}
              className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-900"
            >
              {guideCta.label}
              <ArrowRight className="size-3.5 shrink-0" aria-hidden />
            </Link>
          </div>
        ) : null}
      </div>

      <div
        className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900"
        role="alert"
      >
        <p className="font-medium">Önemli uyarı</p>
        <p className="mt-1 leading-relaxed">
          Bu yanıt yalnızca genel hukuki bilgilendirme amacı taşımaktadır; hukuki danışmanlık veya vekillik hizmeti değildir ve taraflar arasında avukat-müvekkil ilişkisi kurulmaz. Yanıtta yer alan bilgiler somut olayınıza birebir uygulanabilir nitelikte olmayabilir. İçeriğe dayanarak yapacağınız işlemlerden doğabilecek sonuçlara ilişkin sorumluluk tarafınıza aittir. Somut durumunuz için profesyonel hukuki destek almanız önerilir.
        </p>
      </div>
    </section>
  );
}
