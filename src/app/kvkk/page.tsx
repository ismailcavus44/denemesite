import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { LegalLayout, slugifyId } from "@/components/legal-layout";

const _t = "KVKK Aydınlatma Metni | YasalHaklarınız";
const _d = "Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni. Veri sorumlusu olarak kişisel verilerin işlenmesi ve korunması.";
const _u = `${siteConfig.url}/kvkk`;

const LAST_UPDATED = "12 Mart 2026";

export const metadata: Metadata = {
  title: { absolute: "KVKK Aydınlatma Metni | YasalHaklarınız" },
  description: _d,
  openGraph: { title: _t, description: _d, url: _u },
  twitter: { card: "summary_large_image", title: _t, description: _d },
  alternates: { canonical: _u },
};

export default function KvkkPage() {
  return (
    <LegalLayout
      title="Kişisel Verilerin Korunması ve İşlenmesine İlişkin Aydınlatma Metni"
      lastUpdated={LAST_UPDATED}
    >
      <h2 id={slugifyId("Veri Sorumlusunun Kimliği")}>1. Veri Sorumlusunun Kimliği</h2>
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) ve ilgili mevzuat uyarınca, Yasal Haklarınız Platformu (&quot;yasalhaklariniz.com&quot; veya &quot;Veri Sorumlusu&quot;) olarak, kişisel verilerinizin güvenliğine azami hassasiyet göstermekteyiz. İşbu aydınlatma metni, sitemizi ziyaret eden kullanıcıların, soru soranların ve gönüllü yazar/editör adaylarının kişisel verilerinin hangi şartlarda işlendiği konusunda şeffaflık sağlamak amacıyla hazırlanmıştır.
      </p>

      <h2 id={slugifyId("İşlenen Kişisel Veri Kategorileri")}>2. İşlenen Kişisel Veri Kategorileri</h2>
      <p>
        Sitemiz, &quot;anonimlik&quot; esasıyla çalışmakta olup, zorunlu haller dışında kişisel veri talep etmemektedir. Ancak siteyi kullanım şeklinize göre aşağıdaki kişisel verileriniz işlenebilmektedir:
      </p>
      <ul>
        <li><strong>İşlem Güvenliği Verileri (Tüm Ziyaretçiler):</strong> 5651 sayılı Kanun gereği tutulması zorunlu olan IP adresi, erişim tarih/saat bilgileri, log kayıtları ve tarayıcı (browser) bilgileri.</li>
        <li><strong>İletişim Verileri (Bildirim İsteyen Kullanıcılar):</strong> Yalnızca kendi rızasıyla &quot;soruma yanıt gelince bildirim alayım&quot; opsiyonunu seçen kullanıcıların Cep Telefonu Numarası.</li>
        <li><strong>Kimlik, İletişim ve Mesleki Deneyim Verileri (Yazar/Editör Adayları):</strong> Gönüllülük başvurusu yapan kişilerin Adı, Soyadı, E-posta adresi, Telefon Numarası, Eğitim Bilgileri ve Özgeçmiş (CV) içeriklerinde kendi hür iradeleriyle paylaştıkları diğer kişisel veriler.</li>
      </ul>

      <h2 id={slugifyId("Kişisel Verilerin İşlenme Amaçları")}>3. Kişisel Verilerin İşlenme Amaçları</h2>
      <p>
        Toplanan kişisel verileriniz, KVKK&apos;nın 4. maddesinde belirtilen genel ilkelere uygun olarak aşağıdaki amaçlarla işlenmektedir:
      </p>
      <ul>
        <li><strong>IP ve Log Kayıtları:</strong> Bilgi güvenliği süreçlerinin yürütülmesi, yetkili kişi, kurum ve kuruluşlara mevzuat gereği bilgi verilmesi ve 5651 sayılı Kanun&apos;dan doğan yükümlülüklerimizin yerine getirilmesi.</li>
        <li><strong>Cep Telefonu Numarası (Kullanıcılar İçin):</strong> Kullanıcı deneyiminin artırılması, talep edilen &quot;soru yanıtlandı&quot; bildiriminin ilgili kişiye WhatsApp uygulaması üzerinden anlık olarak iletilebilmesi ve iletişim faaliyetlerinin yürütülmesi.</li>
        <li><strong>Yazar/Editör Başvuru Verileri:</strong> İnsan kaynakları ve gönüllü ağımızın yönetilmesi, adayların yasal ve mesleki uygunluklarının değerlendirilmesi (reklam yasağı vb. regülasyonlara uyum kapsamında) ve başvuru sonuçları hakkında iletişim kurulması.</li>
      </ul>

      <h2 id={slugifyId("Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi")}>4. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h2>
      <p>
        Kişisel verileriniz; web sitemizdeki başvuru formları, soru sorma ekranındaki opsiyonel bildirim kutucukları ve sistem altyapımız (çerezler ve log kayıtları) aracılığıyla tamamen otomatik veya kısmen otomatik yollarla elektronik ortamda toplanmaktadır.
      </p>
      <p>
        Bu veriler, KVKK&apos;nın 5. maddesinde yer alan aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:
      </p>
      <ul>
        <li>5651 sayılı Kanun kapsamındaki log kayıtları için: &quot;Kanunlarda açıkça öngörülmesi&quot; ve &quot;Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması&quot; (KVKK m. 5/2-a ve ç).</li>
        <li>Yazar/Editör başvuruları için: &quot;Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması&quot; (KVKK m. 5/2-c).</li>
        <li>WhatsApp bildirimleri (Telefon Numarası) için: Kullanıcının sunmuş olduğu &quot;Açık Rıza&quot; (KVKK m. 5/1).</li>
      </ul>

      <h2 id={slugifyId("Kişisel Verilerin Aktarılması ve Yurtdışına Aktarım")}>5. Kişisel Verilerin Aktarılması ve Yurtdışına Aktarım</h2>
      <p>
        yasalhaklariniz.com, kişisel verilerinizi kural olarak üçüncü kişilere satmaz, kiralamaz veya ticari amaçla paylaşmaz. Ancak, yasal yükümlülüklerimiz ve sunduğumuz altyapının teknik doğası gereği aşağıdaki aktarımlar yapılmaktadır:
      </p>
      <ul>
        <li><strong>Yetkili Kurumlar:</strong> Hukuki uyuşmazlıklar veya adli/idari makamların usulüne uygun talepleri halinde, talep edilen veriler (IP kayıtları vb.) kanuni yükümlülüklerimizi yerine getirmek amacıyla ilgili resmi makamlara aktarılır.</li>
        <li><strong>Yurtdışına Aktarım (Veritabanı ve Mesajlaşma Altyapıları):</strong> Sitemizde yer alan &quot;WhatsApp üzerinden bildirim al&quot; özelliğini kullanmayı tercih etmeniz halinde; girdiğiniz telefon numarası, sorunuz yanıtlanana kadar sistemimizin bulut veritabanı sağlayıcısı olan Supabase, Inc. altyapısında güvenli bir şekilde saklanmaktadır. Sorunuz yanıtlandığında ise bildirimler Twilio Inc. ve Meta Platforms, Inc. (WhatsApp) servisleri entegrasyonu ile tarafınıza iletilmektedir. Bu teknoloji ve hizmet sağlayıcılarının (Supabase, Twilio, Meta) sunucularının ve veri merkezlerinin yurtdışında bulunması sebebiyle, paylaştığınız telefon numarası, sadece bu hizmetin size sunulabilmesi ve verinin güvenli şekilde barındırılabilmesi amacıyla yurtdışına aktarılmaktadır. Bu aktarım ve yurtdışında saklama işlemi, KVKK&apos;nın 9. maddesi uyarınca tamamen &quot;Açık Rızanıza&quot; istinaden gerçekleştirilir. Açık rıza vermemeniz halinde telefon numaranız işlenmez, yurtdışı sunucularına aktarılmaz ve WhatsApp bildirimi yapılamaz (sorunuzu sitemiz üzerinden anonim olarak takip etmeye devam edebilirsiniz).</li>
      </ul>

      <h2 id={slugifyId("Kişisel Verilerin Saklanma ve İmha Süresi")}>6. Kişisel Verilerin Saklanma ve İmha Süresi</h2>
      <p>
        İşlenen kişisel veriler, işlenme amacının ortadan kalkması veya yasal saklama sürelerinin sona ermesi halinde, Kurul tarafından yayımlanan rehberlere ve Kişisel Veri Saklama ve İmha Politikamıza uygun olarak periyodik periyotlarda (örneğin bildirim SMS&apos;i/WhatsApp mesajı başarıyla iletildikten hemen sonra telefon numaraları veritabanından) silinir, yok edilir veya anonim hale getirilir.
      </p>

      <h2 id={slugifyId("İlgili Kişinin Hakları")}>7. İlgili Kişinin Hakları (KVKK Madde 11)</h2>
      <p>
        KVKK&apos;nın 11. maddesi kapsamında ilgili kişi olarak aşağıdaki haklara sahipsiniz:
      </p>
      <ul>
        <li>Kişisel veri işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme,</li>
        <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
        <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
        <li>Verilerin eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini isteme,</li>
        <li>KVKK&apos;nın 7. maddesindeki şartlar çerçevesinde silinmesini veya yok edilmesini isteme,</li>
        <li>Düzeltme, silinme ve yok edilme işlemlerinin, verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
        <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
        <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
      </ul>
      <p>
        Bu haklarınızı kullanmak için taleplerinizi, &quot;Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ&quot;e uygun olarak;{" "}
        <a href="mailto:bilgi@yasalhaklariniz.com" className="text-slate-900 underline underline-offset-2 hover:no-underline">
          bilgi@yasalhaklariniz.com
        </a>
        {" "}adresine güvenli elektronik imza, mobil imza ya da sistemimizde kayıtlı e-posta adresiniz üzerinden iletebilirsiniz. Talepleriniz, niteliğine göre en kısa sürede ve en geç otuz (30) gün içinde ücretsiz olarak sonuçlandırılacaktır.
      </p>
    </LegalLayout>
  );
}
