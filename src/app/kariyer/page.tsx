import type { Metadata } from "next";
import Link from "next/link";
import { PenLine, Pencil, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Kariyer",
  description:
    "YasalHaklarınız ekibine gönüllü yazar veya editör olarak başvurun. Hukuki bilgilendirme içerikleri üretmek isteyenler için başvuru sayfaları.",
};

const cards = [
  {
    title: "Yazar Başvurusu",
    description:
      "Hukuk alanında rehber ve bilgilendirme yazıları yazmak, okurlara sade ve anlaşılır içerik sunmak istiyorsanız yazar başvurusu sayfamızdan detayları inceleyebilirsiniz.",
    href: "/kariyer/yazar-basvurusu",
    icon: PenLine,
  },
  {
    title: "Editör Başvurusu",
    description:
      "İçerikleri düzenlemek, sadeleştirmek ve yayına hazırlamak istiyorsanız editör başvurusu sayfamızdan koşulları ve başvuru sürecini görebilirsiniz.",
    href: "/kariyer/editor-basvurusu",
    icon: Pencil,
  },
];

export default function KariyerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Anasayfa
            </Link>
            <span>/</span>
            <span>Gönüllü Başvurusu</span>
          </div>
          <header className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Gönüllü Başvurusu
            </h1>
            <p className="text-slate-600">
              Yazar veya editör olarak ekibimize katılmak için aşağıdaki
              başvuru türlerinden birini seçin.
            </p>
          </header>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {cards.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-200">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-slate-900">
                {title}
              </h2>
              <p className="flex-1 text-sm leading-relaxed text-slate-600">
                {description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
                Detaylı bilgi
                <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
          ))}
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          Yazar ve editör pozisyonlarımız gönüllülük esaslıdır. YasalHaklarınız,
          ticari bir amaç gütmeyen bir bilgilendirme projesidir; içerikler
          gönüllü katkılarla üretilir ve herkes için ücretsiz sunulur.
        </p>
      </div>
    </div>
  );
}
