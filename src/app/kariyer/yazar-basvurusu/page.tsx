import type { Metadata } from "next";
import Link from "next/link";
import { PenLine, ArrowRight, FileDown } from "lucide-react";
import { BasvuruForm } from "@/components/kariyer/BasvuruForm";

export const metadata: Metadata = {
  title: "Yazar Başvurusu",
  description:
    "YasalHaklarınız ekibine gönüllü yazar olarak başvurun. Hukuki rehber ve bilgilendirme yazıları yazmak isteyenler için başvuru bilgileri.",
};

export default function YazarBasvurusuPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Anasayfa</Link>
          <span>/</span>
          <Link href="/kariyer" className="hover:text-foreground">Gönüllü Başvurusu</Link>
          <span>/</span>
          <span>Yazar Başvurusu</span>
        </div>

        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <PenLine className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Yazar Başvurusu
              </h1>
              <p className="text-sm text-slate-600">
                Gönüllü yazar olarak ekibimize katılın
              </p>
            </div>
          </div>
        </header>

        <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-6">
          <p className="text-sm leading-relaxed text-slate-700">
            YasalHaklariniz platformu, hukuki bilgiyi sade, anlaşılır ve doğru şekilde
            kamuoyuna ulaştırmayı amaçlayan bağımsız bir dijital içerik platformudur.
            Bu çerçevede yazarlık başvuruları belirli mesleki ve editoryal yeterlilikler
            dikkate alınarak değerlendirilmektedir.
          </p>
          <p className="text-sm font-medium text-slate-900">
            Platformda içerik üretmek isteyen adaylarda aşağıdaki niteliklerin bulunması beklenir:
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-700">
            <li>
              Hukuk fakültesi mezunu olmak veya avukatlık stajını tamamlamış olmak. Aktif
              avukatlık yapılması zorunlu olmamakla birlikte, hukuki eğitim altyapısının
              bulunması önemlidir.
            </li>
            <li>
              Temel mevzuata ve güncel yargı uygulamalarına hâkimiyet. Özellikle medeni
              hukuk, borçlar hukuku, iş hukuku, icra hukuku ve ceza hukuku gibi temel
              alanlarda bilgi sahibi olunması tercih edilir.
            </li>
            <li>
              Hukuki konuları teknik karmaşıklıktan arındırarak sade bir dille
              aktarabilme yeteneği. Platformun yayın politikası gereği içeriklerin
              herkes tarafından anlaşılabilir olması esastır.
            </li>
            <li>
              Meslek kurallarına ve reklam yasağına uygun içerik üretme bilinci. Yazılar
              bilgilendirme amaçlı olmalı; yönlendirme, müvekkil temini veya ticari
              çağrı niteliği taşımamalıdır.
            </li>
            <li>
              Güncellik ve doğruluk hassasiyeti. Paylaşılan bilgilerin yürürlükteki
              mevzuata ve yerleşik uygulamaya uygun olması gerekmektedir.
            </li>
          </ul>
          <p className="text-sm leading-relaxed text-slate-700">
            Başvurular editör kurulu tarafından incelenmekte olup, platform yayın
            politikası doğrultusunda uygun bulunan adaylarla iletişime geçilmektedir.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Başvuru formu</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Aşağıdaki formu doldurup CV’nizi (Word) yükleyin. İstenen formatta
            CV hazırlamak için{" "}
            <a
              href="/yazar-basvuru.docx"
              download
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
            >
              <FileDown className="h-4 w-4" aria-hidden />
              CV şablonunu indir
            </a>
            .
          </p>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <BasvuruForm type="yazar" />
          </div>
        </section>

        <Link
          href="/kariyer"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:underline"
        >
          <ArrowRight className="h-4 w-4 rotate-180" aria-hidden />
          Gönüllü Başvurusu sayfasına dön
        </Link>
      </div>
    </div>
  );
}
