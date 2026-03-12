import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { LegalLayout, slugifyId } from "@/components/legal-layout";

const _t = "Sorumluluk Reddi | YasalHaklarınız";
const _d = "Platformda verilen cevaplar genel hukuki bilgilendirme amaçlıdır; hukuki danışmanlık veya vekillik değildir. Kullanım koşulları.";
const _u = `${siteConfig.url}/sorumluluk-reddi`;

const LAST_UPDATED = "12 Mart 2026";

export const metadata: Metadata = {
  title: { absolute: "Sorumluluk Reddi | YasalHaklarınız" },
  description: _d,
  openGraph: { title: _t, description: _d, url: _u },
  twitter: { card: "summary_large_image", title: _t, description: _d },
  alternates: { canonical: _u },
};

export default function SorumlulukReddiPage() {
  return (
    <LegalLayout
      title="Sorumluluk Reddi, Hukuki Bilgilendirme ve Kullanım Beyanı"
      lastUpdated={LAST_UPDATED}
    >
      <h2 id={slugifyId("Hizmetin Kapsamı ve Hukuki Niteliği")}>1. Hizmetin Kapsamı ve Hukuki Niteliği</h2>
      <p>
        yasalhaklariniz.com (&quot;Platform&quot;), kullanıcılara hukuki konularda genel, soyut ve temel düzeyde bilgilendirme sunmayı amaçlayan ücretsiz ve anonim bir içerik platformudur. Platformda yer alan tüm yazılar, sorulara verilen yanıtlar, makaleler, yönlendirmeler ve yorumlar yalnızca genel bilgilendirme niteliği taşımaktadır. Sunulan hiçbir içerik; bireysel hukuki danışmanlık, avukatlık hizmeti, hukuki mütalaa veya profesyonel bir yol haritası teşkil etmez.
      </p>

      <h2 id={slugifyId("Avukat-Müvekkil İlişkisinin Kesin Olarak Reddi")}>2. Avukat-Müvekkil İlişkisinin Kesin Olarak Reddi</h2>
      <ul>
        <li>1136 sayılı Avukatlık Kanunu&apos;nun 35. maddesi uyarınca; hukuki meselelerde mütalaa vermek, mahkeme ve hakemler huzurunda hak aramak ve temsil faaliyetinde bulunmak münhasıran baroya kayıtlı avukatlara aittir.</li>
        <li>Platformumuz, Avukatlık Kanunu ve ilgili mevzuat kapsamında avukatlık veya hukuki danışmanlık faaliyeti yürütmemektedir.</li>
        <li>Platforma soru sorulması, sorulara yanıt alınması veya içeriklerin okunması, kullanıcı ile Platform yöneticileri, içerik sağlayıcıları, gönüllü yazarları veya editörleri arasında hiçbir şekilde avukat-müvekkil (vekalet) ilişkisi kurmaz.</li>
      </ul>

      <h2 id={slugifyId("TBB Reklam Yasağı Yönetmeliğine Tam Uyum")}>3. TBB Reklam Yasağı Yönetmeliği&apos;ne Tam Uyum</h2>
      <p>
        Platformumuz, Türkiye Barolar Birliği Reklam Yasağı Yönetmeliği&apos;ne sıkı sıkıya bağlıdır. Sitemizin yayın politikası gereği; iş sağlama, haksız rekabet yaratma, müvekkil bulma veya ticari menfaat elde etme amacı güdülmez. Platformda gönüllü olarak yanıt veren hukukçular veya yazarlar, platform üzerinden yönlendirme yapamaz, iletişim bilgilerini vererek dava/iş takibi teklif edemezler.
      </p>

      <h2 id={slugifyId("5651 Sayılı Kanun Kapsamında Yer Sağlayıcı Statüsü")}>4. 5651 Sayılı Kanun Kapsamında &quot;Yer Sağlayıcı&quot; Statüsü</h2>
      <ul>
        <li>yasalhaklariniz.com, 5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun uyarınca &quot;Yer Sağlayıcı&quot; konumundadır.</li>
        <li>Yer sağlayıcı olarak Platform, kullanıcılar veya gönüllü yazarlar tarafından sağlanan içerikleri önceden kontrol etmek veya hukuka aykırı bir faaliyetin söz konusu olup olmadığını araştırmakla yükümlü değildir.</li>
        <li>Sorulan sorulardan veya verilen cevaplardan doğabilecek her türlü hukuki ve cezai sorumluluk, içeriği üreten kişiye aittir.</li>
      </ul>

      <h2 id={slugifyId("Bilgilerin Güncelliği ve Kesinliği Konusunda Sorumsuzluk Kaydı")}>5. Bilgilerin Güncelliği ve Kesinliği Konusunda Sorumsuzluk Kaydı</h2>
      <ul>
        <li>Hukuk kuralları, mevzuat değişiklikleri, Yargıtay, Danıştay ve Anayasa Mahkemesi içtihatları sürekli olarak değişen ve gelişen bir yapıdadır.</li>
        <li>Platformda verilen yanıtlar, sorunun sorulduğu tarihteki genel geçer kurallara ve kullanıcının sunduğu kısıtlı bilgilere dayanmaktadır.</li>
        <li>Her somut olay kendi içinde özel delil durumlarına, sürelere ve detaylara sahiptir. Platformdaki yanıtların kesinliği, güncelliği ve her somut olaya/davaya birebir uygunluğu garanti edilmez.</li>
      </ul>

      <h2 id={slugifyId("Tazminat ve Hukuki Sorumluluğun Açıkça Reddi")}>6. Tazminat ve Hukuki Sorumluluğun Açıkça Reddi</h2>
      <p>
        Kullanıcıların yalnızca Platformda yer alan bilgilere, yanıtlara veya makalelere dayanarak;
      </p>
      <ul>
        <li>Kendi başlarına tesis edecekleri hukuki işlemlerden,</li>
        <li>Açacakları veya yürütecekleri davalardan,</li>
        <li>Kaçıracakları hak düşürücü veya zamanaşımı sürelerinden,</li>
        <li>Doğabilecek her türlü doğrudan veya dolaylı maddi/manevi zararlardan ve hak kayıplarından,</li>
      </ul>
      <p>
        yasalhaklariniz.com platformu, imtiyaz sahibi, yöneticileri, editörleri ve gönüllü yazarları hiçbir koşulda, hukuki, cezai veya mali olarak sorumlu tutulamaz. 6098 sayılı Türk Borçlar Kanunu çerçevesinde platform ile kullanıcı arasında herhangi bir vekalet veya hizmet sözleşmesi kurulmuş sayılmaz.
      </p>

      <h2 id={slugifyId("Profesyonel Hukuki Destek Alınması Zorunluluğu")}>7. Profesyonel Hukuki Destek Alınması Zorunluluğu</h2>
      <p>
        Hak kaybına uğramamak; özellikle süreye tabi işlemler, dava açma hazırlıkları, icra takipleri ve ceza soruşturmaları gibi kritik süreçleri hatasız yürütmek adına, somut olayınıza ilişkin tüm dosya ve delillerinizle birlikte bulunduğunuz ildeki baroya kayıtlı uzman bir avukata fiziki veya doğrudan başvurmanız zorunludur. Platformdaki bilgiler profesyonel desteğin alternatifi olamaz. Maddi durumunuz elverişsiz ise, bulunduğunuz ilin barosuna başvurarak &quot;Adli Yardım&quot; talebinde bulunabilirsiniz.
      </p>

      <h2 id={slugifyId("Kabul Beyanı")}>8. Kabul Beyanı</h2>
      <p>
        Platformu ziyaret eden, soru soran veya içerikleri okuyan her kullanıcı; işbu Sorumluluk Reddi Beyanı&apos;nı okuduğunu, anladığını, içeriğini kayıtsız şartsız kabul ettiğini ve Platforma karşı hiçbir ad altında tazminat veya hak talebinde bulunmayacağını peşinen kabul, beyan ve taahhüt eder.
      </p>
    </LegalLayout>
  );
}
