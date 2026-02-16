"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function StickyCTA() {
  return (
    <aside className="mt-0 mb-0 shrink-0">
      <div className="mt-0 mb-0 rounded-[6px] border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-bold text-slate-900">
          Benzer bir durum yaşıyor musun?
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sorunuzu iletebilir, yayınlanan benzer sorulara göz atabilirsiniz.
          Cevaplar genel bilgilendirme amaçlıdır.
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <Button asChild size="default" className="w-full bg-slate-800">
            <Link href="/soru-sor">Hemen Soru Sor</Link>
          </Button>
          <Button asChild variant="outline" size="default" className="w-full border-slate-300">
            <Link href="/iletisim">İletişime Geç</Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
