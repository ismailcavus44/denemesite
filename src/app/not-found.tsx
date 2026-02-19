"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  useEffect(() => {
    const meta = document.querySelector('meta[name="robots"]') ?? document.createElement("meta");
    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex, nofollow");
    if (!document.querySelector('meta[name="robots"]')) document.head.appendChild(meta);
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <p className="text-6xl font-bold tabular-nums text-slate-300">404</p>
      <h1 className="text-xl font-semibold text-slate-900">Sayfa bulunamadı</h1>
      <p className="max-w-sm text-sm text-slate-600">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg" className="bg-[#1d293d] text-white hover:bg-[#1d293d]/90">
          <Link href="/">Anasayfa</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="border-[#1d293d] text-[#1d293d] hover:bg-[#1d293d]/10 hover:border-[#1d293d] hover:text-[#1d293d]">
          <Link href="/iletisim">İletişim</Link>
        </Button>
      </div>
    </div>
  );
}
