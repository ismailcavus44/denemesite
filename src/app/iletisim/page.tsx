"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";

export default function ContactPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center space-y-6">
        <div className="w-[662px] max-w-full space-y-2 text-left">
          <h1 className="text-2xl font-semibold">İletişim</h1>
          <p className="text-sm text-muted-foreground">
            Öneri ve geri bildirimlerinizi paylaşabilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-6 sm:gap-8">
          <Link href="/gizlilik-sozlesmesi" className="group block min-w-0 sm:w-[315px]">
            <Card className="relative h-[260px] w-full min-w-0 overflow-hidden transition-transform duration-200 group-hover:scale-[1.02] sm:h-[420px] md:h-[480px]">
              <img
                src="/gizlilik-sozlesmesi.png"
                alt=""
                width={315}
                height={480}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent" />
              <div className="absolute inset-0 bg-black/45 sm:hidden" aria-hidden />
              <div className="relative flex h-full flex-col justify-start gap-1 p-2 text-white sm:gap-4 sm:p-4">
                <h2 className="text-center text-sm font-semibold sm:text-[24px]">Gizlilik Sözleşmesi</h2>
                <p className="ml-1 text-left text-xs text-zinc-200 sm:ml-2 sm:text-[16px]">
                  Gizlilik sözleşmesini incelemek için sayfamızı ziyaret edebilirsiniz.
                </p>
                <span className="ml-1 flex items-center gap-1 text-xs text-white underline underline-offset-2 sm:ml-2 sm:text-[16px]">
                  detaylı incele
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </span>
              </div>
            </Card>
          </Link>
          <Link href="/kvkk" className="group block min-w-0 sm:w-[315px]">
            <Card className="relative h-[260px] w-full min-w-0 overflow-hidden transition-transform duration-200 group-hover:scale-[1.02] sm:h-[420px] md:h-[480px]">
              <img
                src="/kullanıcı-sozlesmesi.png"
                alt=""
                width={315}
                height={480}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent" />
              <div className="absolute inset-0 bg-black/45 sm:hidden" aria-hidden />
              <div className="relative flex h-full flex-col justify-start gap-1 p-2 text-white sm:gap-4 sm:p-4">
                <h2 className="text-center text-sm font-semibold sm:text-[24px]">KVKK Aydınlatma Metni</h2>
                <p className="ml-1 text-left text-xs text-zinc-200 sm:ml-2 sm:text-[16px]">
                  KVKK aydınlatma metnini incelemek için sayfamızı ziyaret edebilirsiniz.
                </p>
                <span className="ml-1 flex items-center gap-1 text-xs text-white underline underline-offset-2 sm:ml-2 sm:text-[16px]">
                  detaylı incele
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </span>
              </div>
            </Card>
          </Link>
        </div>

        <section className="flex w-full max-w-full flex-row rounded-lg border border-border min-h-[200px] md:h-[313px]">
          <div className="flex w-1/2 min-w-0 flex-col items-center justify-center gap-2 overflow-x-auto px-3 py-4 text-center sm:gap-3 sm:px-4 sm:py-5 md:px-6 md:pt-8">
            <h2 className="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-xl">
              <Mail className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              İletişime geçin
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Öneri, görüş ve taleplerinizi bize iletmek için mail adresimizden iletişime geçebilirsiniz.{" "}
              <a href={`mailto:${siteConfig.contactEmail}`} className="inline-block text-primary underline underline-offset-2 text-xs whitespace-nowrap sm:text-sm">
                {siteConfig.contactEmail}
              </a>
            </p>
          </div>
          <div className="relative h-[200px] w-1/2 shrink-0 overflow-hidden md:h-full md:min-h-0">
            <img
              src="/iletisim.png"
              alt="İletişim"
              className="h-full w-full object-cover"
            />
          </div>
        </section>
    </div>
  );
}
