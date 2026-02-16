import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

type CategoryNavCardsProps = {
  categorySlug: string;
};

export function CategoryNavCards({ categorySlug }: CategoryNavCardsProps) {
  const base = `/${categorySlug}`;
  const cards = [
    {
      title: "Rehberleri İncele",
      href: `${base}/rehber`,
      description: "Bu kategorideki rehber yazılarına göz atın.",
      image: "/kategori-rehber.png",
    },
    {
      title: "Soruları Gör",
      href: `${base}/sorular`,
      description: "Cevaplanmış soruları inceleyin.",
      image: "/kategori-soru.png",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
      {cards.map((card) => (
        <Link key={card.href} href={card.href} className="group block w-full sm:w-[280px]">
          <Card className="relative aspect-square h-auto w-full min-w-0 overflow-hidden transition-transform duration-200 group-hover:scale-[1.02] sm:h-[280px] sm:w-[280px]">
            <Image
              src={card.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 280px"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative flex h-full flex-col justify-start gap-4 p-4 text-white">
              <h2 className="text-center text-[24px] font-semibold">{card.title}</h2>
              <p className="ml-2 text-left text-[16px] text-zinc-200">{card.description}</p>
              <span className="ml-2 flex items-center gap-1 text-[16px] underline underline-offset-2">
                detaylı incele
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
