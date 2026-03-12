"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    id: "soru-1",
    question: "Platform üzerinden nasıl hukuki soru sorabilirim?",
    answer:
      "Ana sayfamızda bulunan \"Hemen Soru Sor\" butonuna tıklayarak karşınıza çıkan forma yaşadığınız hukuki durumu yazabilirsiniz. Sistemimiz, herkesin kolayca hukuki soru sorabilmesi için son derece sade tasarlanmıştır.",
  },
  {
    id: "soru-2",
    question: "Sorduğum hukuki sorular gizli kalıyor mu?",
    answer:
      "Evet. Gizliliğiniz bizim için önceliklidir. Platforma ilettiğiniz olaylar ve sorular, kişisel verilerinizden (isim, kurum adı vb.) arındırılarak tamamen anonim bir şekilde yayınlanır.",
  },
  {
    id: "soru-3",
    question: "Sorularıma verilen cevaplar yasal tavsiye niteliği taşır mı?",
    answer:
      "Hayır. Platformumuz genel hukuki bilgilendirme sunar. Verilen cevaplar karmaşık hukuk dilini sadeleştirmeyi amaçlar ancak resmi bir avukatlık hizmeti veya birebir hukuki danışmanlık niteliği taşımaz.",
  },
  {
    id: "soru-4",
    question: "Daha önce sorulan hukuki soruları nasıl inceleyebilirim?",
    answer:
      "Sitemizdeki \"Sorular\" sekmesini ziyaret ederek, sizinle benzer durumları yaşamış kişilerin sorduğu güncel hukuki soruları ve bu sorulara verilen net cevapları inceleyebilirsiniz.",
  },
  {
    id: "soru-5",
    question: "Hukuki soru sormak ücretli mi?",
    answer:
      "Platformumuzda yer alan içerikleri okumak, benzer hukuki sorunlara verilen genel bilgilendirme cevaplarını incelemek tamamen ücretsizdir.",
  },
] as const;

export const HOMEPAGE_FAQ_ITEMS = FAQ_ITEMS.map(({ question, answer }) => ({
  question,
  answer,
}));

export function HomepageFAQ() {
  return (
    <section className="py-12 md:py-16" aria-labelledby="sss-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2
          id="sss-heading"
          className="mb-8 flex items-center gap-2 text-xl font-semibold text-gray-900"
        >
          <span className="h-5 w-1 shrink-0 rounded-full bg-primary" />
          Sıkça Sorulan Sorular
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="border-b border-gray-200 last:border-b-0"
            >
              <AccordionTrigger className="py-5 text-left text-[15px] font-medium text-gray-900 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
