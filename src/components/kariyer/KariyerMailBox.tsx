import { Mail } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function KariyerMailBox() {
  const email = siteConfig.kariyerEmail;
  return (
    <section className="flex w-full max-w-full flex-row rounded-lg border border-border min-h-[200px] md:h-[313px]">
      <div className="flex w-1/2 min-w-0 flex-col items-center justify-center gap-2 overflow-x-auto px-3 py-4 text-center sm:gap-3 sm:px-4 sm:py-5 md:px-6 md:pt-8">
        <h2 className="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-xl">
          <Mail className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
          CV&apos;nizi gönderin
        </h2>
        <p className="text-xs text-muted-foreground sm:text-sm">
          CV&apos;nizi ve kısa özgeçmişinizi{" "}
          <a
            href={`mailto:${email}`}
            className="inline-block text-primary underline underline-offset-2 text-xs whitespace-nowrap sm:text-sm"
          >
            {email}
          </a>
          {" "}adresine göndererek başvurunuzu yapabilirsiniz.
        </p>
      </div>
      <div className="relative h-[200px] w-1/2 shrink-0 overflow-hidden md:h-full md:min-h-0">
        <img
          src="/kariyer-gorsel.png"
          alt="Kariyer başvurusu"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
