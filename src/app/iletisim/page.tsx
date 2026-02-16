"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center space-y-6">
        <div className="w-[662px] max-w-full space-y-2 text-left">
          <h1 className="text-2xl font-semibold">İletişim</h1>
          <p className="text-sm text-muted-foreground">
            Öneri ve geri bildirimlerinizi paylaşabilirsiniz.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          <Link href="/gizlilik-sozlesmesi" className="group block w-full sm:w-[315px]">
            <Card className="relative h-[420px] w-full min-w-0 overflow-hidden transition-transform duration-200 group-hover:scale-[1.02] sm:h-[480px] sm:w-[315px]">
              <img
                src="/gizlilik-sozlesmesi.png"
                alt=""
                width={315}
                height={480}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent" />
              <div className="relative flex h-full flex-col justify-start gap-4 p-4 text-white">
                <h2 className="text-center text-[24px] font-semibold">Gizlilik Sözleşmesi</h2>
                <p className="ml-2 text-left text-[16px] text-zinc-200">
                  Gizlilik sözleşmesini incelemek için sayfamızı ziyaret edebilirsiniz.
                </p>
                <span className="ml-2 flex items-center gap-1 text-[16px] text-white underline underline-offset-2">
                  detaylı incele
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Card>
          </Link>
          <Link href="/kvkk" className="group block w-full sm:w-[315px]">
            <Card className="relative h-[420px] w-full min-w-0 overflow-hidden transition-transform duration-200 group-hover:scale-[1.02] sm:h-[480px] sm:w-[315px]">
              <img
                src="/kullanıcı-sozlesmesi.png"
                alt=""
                width={315}
                height={480}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent" />
              <div className="relative flex h-full flex-col justify-start gap-4 p-4 text-white">
                <h2 className="text-center text-[24px] font-semibold">KVKK Aydınlatma Metni</h2>
                <p className="ml-2 text-left text-[16px] text-zinc-200">
                  KVKK aydınlatma metnini incelemek için sayfamızı ziyaret edebilirsiniz.
                </p>
                <span className="ml-2 flex items-center gap-1 text-[16px] text-white underline underline-offset-2">
                  detaylı incele
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Card>
          </Link>
        </div>

        <section className="flex w-full max-w-full flex-col rounded-lg border border-border sm:min-h-[313px] md:flex-row md:h-[313px]">
          <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-3 px-4 py-8 text-center md:w-1/2 md:min-h-0 md:px-6 md:pt-20">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Mail className="h-5 w-5 shrink-0" />
              İletişime geçin
            </h2>
            <p className="text-sm text-muted-foreground">
              Öneri, görüş ve taleplerinizi bize iletmek için mail adresimizden iletişime geçebilirsiniz.{" "}
              <a href="mailto:info@yasalhaklariniz.com" className="text-primary underline underline-offset-2">
                info@yasalhaklariniz.com
              </a>
            </p>
          </div>
          <div className="relative h-[200px] w-full overflow-hidden md:h-full md:min-h-0 md:w-1/2">
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
