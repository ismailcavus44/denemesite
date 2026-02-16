import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type CategoryPillarDemoProps = {
  categoryName: string;
};

type Section = { title: string; content: (name: string) => string };

const DEMO_SECTIONS: Section[] = [
  {
    title: "Bu kategori neyi kapsar?",
    content: (name) =>
      `${name} alanı, bu hukuk dalıyla ilgili temel kavramları, sık karşılaşılan durumları ve genel bilgilendirme içeriklerini kapsar. Buradaki yazılar yalnızca bilgilendirme amaçlıdır; somut olayınız için mutlaka bir avukata danışmanız önerilir.`,
  },
  {
    title: "En sık karşılaşılan sorunlar",
    content: () =>
      "Bu kategoride vatandaşların sıkça sorduğu konular rehber yazıları ve cevaplanmış sorularla ele alınır. Üst menüden rehberlere ve sorulara göz atarak ilgilendiğiniz başlıklara ulaşabilirsiniz.",
  },
  {
    title: "Hak kaybı yaşanmaması için dikkat edilmesi gerekenler",
    content: () =>
      "Süreye tabi işlemlerde gecikmek hak kaybına yol açabilir. Kendi durumunuzu tam olarak anlamak ve doğru adımları atmak için profesyonel hukuki destek almanız önemlidir. Bu sitedeki içerikler genel bilgilendirme niteliğindedir.",
  },
  {
    title: "Ne zaman profesyonel destek alınmalı?",
    content: () =>
      "Somut bir hukuki sorununuz, davaya dönüşebilecek bir uyuşmazlığınız veya süre riski taşıyan bir işleminiz varsa mutlaka bir avukata başvurun. Bu sayfa ve sitedeki diğer içerikler hukuki danışmanlık yerine geçmez.",
  },
];

/** Pillar yokken gösterilecek demo metin (kategorisine özel başlık). */
export function CategoryPillarDemo({ categoryName }: CategoryPillarDemoProps) {
  return (
    <article className="max-w-none">
      <Accordion type="single" collapsible className="w-full">
        {DEMO_SECTIONS.map((section, i) => (
          <AccordionItem key={i} value={`section-${i}`}>
            <AccordionTrigger className="text-left text-base font-semibold text-slate-900">
              {section.title}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-slate-600 leading-7">
                {section.content(categoryName)}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p className="mt-4 text-xs text-slate-500">
        Bu içerik genel bilgilendirme amaçlıdır; hukuki danışmanlık değildir.
      </p>
    </article>
  );
}
