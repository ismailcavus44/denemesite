import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, ArrowRight, FileDown } from "lucide-react";
import { BasvuruForm } from "@/components/kariyer/BasvuruForm";

export const metadata: Metadata = {
  title: "Editör Başvurusu",
  description:
    "YasalHaklarınız ekibine gönüllü editör olarak başvurun. İçerikleri düzenleyen ve yayına hazırlayan editörler için başvuru bilgileri.",
};

export default function EditorBasvurusuPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Anasayfa</Link>
          <span>/</span>
          <Link href="/kariyer" className="hover:text-foreground">Gönüllü Başvurusu</Link>
          <span>/</span>
          <span>Editör Başvurusu</span>
        </div>

        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Pencil className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Editör Başvurusu
              </h1>
              <p className="text-sm text-slate-600">
                Gönüllü editör olarak ekibimize katılın
              </p>
            </div>
          </div>
        </header>

        <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-6">
          <p className="text-sm leading-relaxed text-slate-700">
            YasalHaklariniz platformunda yayımlanan içeriklerin doğruluğu, güncelliği ve
            dil standardı editöryal denetim sürecinden geçmektedir. Editör başvuruları,
            hukuki yeterlilik ve yayın disiplini esas alınarak değerlendirilmektedir.
          </p>
          <p className="text-sm font-medium text-slate-900">
            Editör adaylarında aşağıdaki niteliklerin bulunması beklenir:
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-700">
            <li>
              Hukuk fakültesi mezunu olmak. Avukatlık ruhsatı bulunması tercih sebebidir.
            </li>
            <li>
              Mevzuat okuma, yorumlama ve hukuki metin analiz yetkinliği. İçeriklerin
              hukuki doğruluk açısından kontrol edilebilmesi için güçlü teorik altyapı
              gereklidir.
            </li>
            <li>
              Yargı kararlarını ve uygulamayı değerlendirme kabiliyeti. İçeriklerde yer
              alan bilgilerin uygulamayla uyumlu olup olmadığını denetleyebilme yetisi
              önemlidir.
            </li>
            <li>
              Dil ve anlatım standardı oluşturma yeteneği. Teknik hukuki ifadelerin
              sadeleştirilmesi ve metin bütünlüğünün sağlanması editör sorumluluğundadır.
            </li>
            <li>
              Meslek etiği ve reklam yasağı konusunda hassasiyet. Yayınlanan içeriklerin
              bilgilendirme sınırları içinde kalması gözetilir.
            </li>
            <li>
              Dijital içerik yönetim sistemleri ve temel SEO bilgisi tercih sebebidir.
            </li>
          </ul>
          <p className="text-sm leading-relaxed text-slate-700">
            Editörler, platformun yayın politikası doğrultusunda içeriklerin hukuki
            uygunluğunu ve kalite standardını gözetir. Başvurular editoryal kurul
            tarafından değerlendirilir ve uygun bulunan adaylarla iletişime geçilir.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Başvuru formu</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Aşağıdaki formu doldurup CV’nizi (Word) yükleyin. İstenen formatta
            CV hazırlamak için{" "}
            <a
              href="/editor-basvuru.docx"
              download
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
            >
              <FileDown className="h-4 w-4" aria-hidden />
              CV şablonunu indir
            </a>
            .
          </p>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <BasvuruForm type="editor" />
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
