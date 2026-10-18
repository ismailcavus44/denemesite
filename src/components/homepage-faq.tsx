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
    question: "YasalHaklarınız nedir?",
    answer:
      "YasalHaklarınız; miras, aile, iş, icra ve gayrimenkul hukuku gibi alanlarda genel hukuki bilgilendirme amacıyla hazırlanan rehber yazılarının yayımlandığı bir hukuk bloğudur.",
  },
  {
    id: "soru-2",
    question: "Rehber yazıları hukuki danışmanlık yerine geçer mi?",
    answer:
      "Hayır. Yazılar yalnızca genel bilgilendirme amacı taşır; avukatlık hizmeti veya hukuki danışmanlık niteliğinde değildir. Her olayın koşulları farklıdır.",
  },
  {
    id: "soru-3",
    question: "Yazılar güncel mi?",
    answer:
      "Yazılar mevzuat ve Yargıtay uygulamasındaki değişikliklere göre düzenli olarak gözden geçirilir; her yazının üzerinde son güncelleme tarihi yer alır.",
  },
  {
    id: "soru-4",
    question: "Aradığım konuyu nasıl bulabilirim?",
    answer:
      "Rehber sayfasındaki arama kutusunu kullanabilir veya kategori sayfalarından ilgili hukuk alanındaki tüm yazılara ulaşabilirsiniz.",
  },
  {
    id: "soru-5",
    question: "İçerikleri okumak ücretli mi?",
    answer: "Hayır. Sitedeki tüm rehber yazıları ücretsiz okunabilir.",
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
