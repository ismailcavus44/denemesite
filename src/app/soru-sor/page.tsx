import type { Metadata } from "next";
import { QuestionForm } from "@/components/question-form";
import { WebPageSchema } from "@/components/schemas/WebPageSchema";
import { siteConfig } from "@/lib/site";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Soru Sor",
  description:
    "Hukuki sorununu detaylı yaz; editör incelemesinden sonra anonim yayımlansın. Miras, boşanma, iş hukuku ve icra konularında sade cevaplar.",
};

export default async function AskQuestionPage() {
  const supabase = createSupabaseServerClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id,name")
    .order("name");

  const pageUrl = `${siteConfig.url.replace(/\/$/, "")}/soru-sor`;

  return (
    <>
      <WebPageSchema
        name="Soru Sor"
        description="Hukuki sorununu detaylı yaz; editör incelemesinden sonra anonim yayımlansın. Miras, boşanma, iş hukuku ve icra konularında sade cevaplar."
        url={pageUrl}
      />
      <div className="mx-auto max-w-[728px] space-y-10">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Hukuki Soru Sor</h1>
        <p className="text-sm text-muted-foreground">
          Sorunu net ve detaylı anlat. Editör ekibi inceleyip uygun gördüğünde anonim şekilde yayımlar ve yanıtlar.
        </p>
      </div>
      <div className="mt-2">
        <QuestionForm categories={categories ?? []} />
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
          Bu platformda yer alan cevaplar yalnızca genel hukuki bilgilendirme amacı taşır; hukuki danışmanlık veya vekillik hizmeti değildir. Bu nedenle avukat-müvekkil ilişkisi kurulmaz ve herhangi bir ücret talep edilmez. Verilen cevaplara dayanılarak yapılacak işlem ve tercihlerden doğabilecek hukuki, idari veya mali sonuçlardan platform sorumlu değildir.
        </p>
      </div>

      <section className="mt-8 space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <span className="h-5 w-1 rounded-full bg-primary" />
          Sık sorulan sorular
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="dikkat">
            <AccordionTrigger className="text-left text-[15px]">
              Hukuki soru sorarken nelere dikkat etmeliyim?
            </AccordionTrigger>
            <AccordionContent className="text-[14px] text-muted-foreground">
              Hukuki soru sorarken somut olayın tarihini, tarafların kim olduğunu ve yapılan işlemin türünü açıkça belirtmelisiniz. Örneğin tapu devri mi yapıldı, bağış mı gösterildi, işten çıkarma yazılı mı yapıldı gibi detaylar önemlidir. Net bilgi verdiğinizde verilen hukuki cevap daha isabetli olur. Eksik veya genel anlatım, hukuki değerlendirmeyi zorlaştırır.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ucretsiz">
            <AccordionTrigger className="text-left text-[15px]">
              Soru sormak ücretsiz mi?
            </AccordionTrigger>
            <AccordionContent className="text-[14px] text-muted-foreground">
              Evet, bu platform üzerinden ücretsiz hukuki soru sorabilirsiniz. Sorularınız genel hukuki bilgilendirme kapsamında yanıtlanır. Ancak verilen cevaplar somut olayın tüm detayları bilinmeden hazırlanır. Bu nedenle bağlayıcı hukuki danışmanlık yerine ön değerlendirme niteliğindedir.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sure">
            <AccordionTrigger className="text-left text-[15px]">
              Soruma ne kadar sürede cevap verilir?
            </AccordionTrigger>
            <AccordionContent className="text-[14px] text-muted-foreground">
              Gönderilen hukuki sorular içerik yoğunluğuna göre değerlendirilir ve mümkün olan en kısa sürede yanıtlanır. Özellikle miras hukuku, boşanma, iş hukuku, icra ve tazminat gibi alanlarda gelen sorular öncelik sırasına göre incelenir.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="yayin">
            <AccordionTrigger className="text-left text-[15px]">
              Sorduğum hukuki soru sitede yayınlanır mı?
            </AccordionTrigger>
            <AccordionContent className="text-[14px] text-muted-foreground">
              Sorunuz anonim olarak yayınlanabilir. Kişisel veriler, isim, T.C. kimlik numarası, adres gibi bilgiler paylaşılmaz. Amaç, benzer hukuki sorun yaşayan kişilere de yol göstermektir. Yayınlanan içerikler genel bilgilendirme amacı taşır.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="belge">
            <AccordionTrigger className="text-left text-[15px]">
              Hukuki soru sorarken belge yüklemem gerekir mi?
            </AccordionTrigger>
            <AccordionContent className="text-[14px] text-muted-foreground">
              Genellikle belge yüklemeniz gerekmez. Ancak sözleşme, tapu kaydı, işten çıkarma bildirimi gibi belgeler varsa içeriğini özetlemeniz hukuki değerlendirme açısından faydalı olur. Özel bilgi içeren belgeler açık şekilde paylaşılmamalıdır.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="konular">
            <AccordionTrigger className="text-left text-[15px]">
              Hangi konularda hukuki soru sorabilirim?
            </AccordionTrigger>
            <AccordionContent className="text-[14px] text-muted-foreground">
              Miras hukuku, boşanma ve aile hukuku, iş hukuku, kıdem tazminatı, icra takibi, tapu iptali, muris muvazaası, ecrimisil, mal paylaşımı, trafik kazası, tazminat davaları gibi birçok alanda hukuki soru sorabilirsiniz. Sorunuz ilgili kategori altında değerlendirilir.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="kesin-gorus">
            <AccordionTrigger className="text-left text-[15px]">
              Verilen cevap kesin hukuki görüş müdür?
            </AccordionTrigger>
            <AccordionContent className="text-[14px] text-muted-foreground">
              Hayır. Bu platformda verilen yanıtlar genel hukuki bilgilendirme niteliğindedir. Somut olayın tüm detayları incelenmeden kesin hukuki görüş verilmez. Hak kaybı yaşamamak için birebir profesyonel hukuki destek alınması önerilir.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
    </>
  );
}
