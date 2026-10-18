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
      `${name} alanı, bu hukuk dalıyla ilgili temel kavramları, sık karşılaşılan durumları ve genel bilgilendirme içeriklerini kapsar. Buradaki yazılar yalnızca bilgilendirme amaçlıdır.`,
  },
  {
    title: "En sık karşılaşılan sorunlar",
    content: () =>
      "Bu kategoride sık karşılaşılan konular rehber yazılarıyla ele alınır. Üst menüden rehberlere göz atarak ilgilendiğiniz başlıklara ulaşabilirsiniz.",
  },
  {
    title: "Hak kaybı yaşanmaması için dikkat edilmesi gerekenler",
    content: () =>
      "Süreye tabi işlemlerde gecikmek hak kaybına yol açabilir. Bu sitedeki içerikler genel bilgilendirme niteliğindedir.",
  },
];

/** Pillar yokken gösterilecek demo metin (kategorisine özel başlık). */
export function CategoryPillarDemo({ categoryName }: CategoryPillarDemoProps) {
  return (
    <article className="max-w-none">
      <Accordion type="single" collapsible className="w-full">
        {DEMO_SECTIONS.map((section, i) => (
          <AccordionItem key={i} value={`section-${i}`}>
            <AccordionTrigger className="text-left">
              <h3 className="m-0 text-base font-semibold text-slate-900">{section.title}</h3>
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
