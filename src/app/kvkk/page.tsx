import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { LegalLayout, slugifyId } from "@/components/legal-layout";

const _t = "KVKK Aydınlatma Metni | YasalHaklarınız";
const _d = "Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni. Veri sorumlusu olarak kişisel verilerin işlenmesi ve korunması.";
const _u = `${siteConfig.url}/kvkk`;

const LAST_UPDATED = "24 Mart 2025";

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
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) ve ilgili mevzuat uyarınca, Yasal Haklarınız Platformu (&quot;yasalhaklariniz.com&quot; veya &quot;Veri Sorumlusu&quot;) olarak, kişisel verilerinizin güvenliğine azami özen göstermekteyiz. İşbu aydınlatma metni; sitemizi ziyaret eden kullanıcıların, sitede yer alan başvuru ve değerlendirme formları aracılığıyla veri paylaşanların ile soru soranların ve gönüllü yazar/editör adaylarının kişisel verilerinin hangi kapsamda ve hangi hukuki çerçevede işlendiği konusunda şeffaflık sağlamak amacıyla hazırlanmıştır.
      </p>

      <h2 id={slugifyId("İşlenen Kişisel Veri Kategorileri")}>2. İşlenen Kişisel Veri Kategorileri</h2>
      <p>
        Platformumuz içerik sunumunda öncelikle anonimlik ilkesini gözetmekle birlikte, hizmetin niteliği ve yasal yükümlülükler gereği aşağıdaki kişisel veri kategorileri işlenebilmektedir:
      </p>
      <ul>
        <li><strong>İşlem Güvenliği Verileri (Tüm Ziyaretçiler):</strong> 5651 sayılı Kanun gereği tutulması zorunlu olan IP adresi, erişim tarih/saat bilgileri, log kayıtları ve tarayıcı (browser) bilgileri.</li>
        <li><strong>Kimlik ve İletişim Verileri (Form Dolduran Kullanıcılar):</strong> Sitede yer alan iletişim, başvuru ve benzeri formlar üzerinden tarafınızca paylaşılan <strong>Ad, Soyad ve Telefon Numarası</strong> ile formlarda istenen diğer içerikler (örneğin mesaj metni). Bu veriler, güvenli bulut veritabanı altyapımız (<strong>Supabase</strong>) üzerinde saklanmaktadır.</li>
        <li><strong>Kimlik, İletişim ve Mesleki Deneyim Verileri (Yazar/Editör Adayları):</strong> Gönüllülük başvurusu yapan kişilerin adı, soyadı, e-posta adresi, telefon numarası, eğitim bilgileri ve özgeçmiş (CV) içeriklerinde kendi hür iradeleriyle paylaştıkları diğer kişisel veriler.</li>
      </ul>

      <h2 id={slugifyId("Kişisel Verilerin İşlenme Amaçları")}>3. Kişisel Verilerin İşlenme Amaçları</h2>
      <p>
        Toplanan kişisel verileriniz, KVKK&apos;nın 4. maddesinde belirtilen genel ilkelere uygun olarak aşağıdaki amaçlarla işlenmektedir:
      </p>
      <ul>
        <li><strong>IP ve Log Kayıtları:</strong> Bilgi güvenliği süreçlerinin yürütülmesi, yetkili kişi, kurum ve kuruluşlara mevzuat gereği bilgi verilmesi ve 5651 sayılı Kanun&apos;dan doğan yükümlülüklerin yerine getirilmesi.</li>
        <li><strong>Form Üzerinden Toplanan Ad, Soyad ve Telefon:</strong> İlgili başvuruların ve iletişim taleplerinin kayıt altına alınması, ön değerlendirme yapılması, uygun bulunan kişilerle Veri Sorumlusunun kendi telefon hattından <strong>sesli (telefon) iletişim</strong> kurulması ve talebin niteliğine göre sürecin yürütülmesi. Bu kapsamda otomatik mesajlaşma veya anlık bildirim uygulamaları üzerinden toplu ileti gönderimi yapılmamaktadır.</li>
        <li><strong>Yazar/Editör Başvuru Verileri:</strong> İnsan kaynakları ve gönüllü ağın yönetilmesi, adayların yasal ve mesleki uygunluklarının değerlendirilmesi (reklam yasağı vb. düzenlemelere uyum dahil) ve başvuru sonuçları hakkında iletişim kurulması.</li>
      </ul>

      <h2 id={slugifyId("Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi")}>4. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h2>
      <p>
        Kişisel verileriniz; web sitemizdeki başvuru ve iletişim formları, soru sorma süreçlerindeki ilgili alanlar ve sistem altyapımız (çerezler ve log kayıtları) aracılığıyla tamamen veya kısmen otomatik yollarla elektronik ortamda toplanmaktadır.
      </p>
      <p>
        Bu veriler, KVKK&apos;nın 5. maddesinde yer alan aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:
      </p>
      <ul>
        <li>5651 sayılı Kanun kapsamındaki log kayıtları için: &quot;Kanunlarda açıkça öngörülmesi&quot; ve &quot;Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması&quot; (KVKK m. 5/2-a ve ç).</li>
        <li>Yazar/Editör başvuruları için: &quot;Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması&quot; (KVKK m. 5/2-c).</li>
        <li>
          Sitedeki başvuru/değerlendirme ve iletişim formları kapsamında tarafınızdan alınan <strong>ad, soyad ve telefon numarası</strong> için: Başvuru ve ön değerlendirme sürecinin yürütülmesi ile uygun adaylarla telefon üzerinden sesli iletişim kurulması amaçları doğrultusunda, öncelikle &quot;bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması&quot; (KVKK m. 5/2-c) hukuki sebebine; bu verilerin <strong>Supabase, Inc.</strong> tarafından sağlanan ve bir kısmı yurtdışında barındırılan <strong>bulut veritabanı</strong> üzerinde saklanması teknik gereği doğan <strong>yurtdışına aktarım</strong> boyutu için ise KVKK m. 5/1 kapsamındaki <strong>açık rızanıza</strong> dayanılmaktadır. Formlarda sunulan onay metinleri bu kapsamda açık rızanızın kanıtı olarak işlenir.
        </li>
      </ul>
      <p>
        Kayıt ve saklama teknik altyapısı olarak kişisel verileriniz, erişim kontrolleri ve şifreleme gibi güvenlik önlemleri çerçevesinde <strong>Supabase</strong> bulut veritabanında tutulmaktadır. Supabase&apos;in kullanımına ilişkin yurtdışı aktarım açıklaması aşağıdaki 5. maddede yer almaktadır.
      </p>

      <h2 id={slugifyId("Kişisel Verilerin Aktarılması ve Yurtdışına Aktarım")}>5. Kişisel Verilerin Aktarılması ve Yurtdışına Aktarım</h2>
      <p>
        Veri Sorumlusu, kişisel verilerinizi ticari amaçla satmaz veya pazarlamada kullanmak üzere üçüncü kişilere devretmez. Kişisel verilerinizin güvenli bir şekilde saklanması için site altyapımızda <strong>Supabase, Inc.</strong> tarafından sunulan bulut tabanlı veritabanı hizmetinden yararlanılmaktadır. Bu hizmet, verilerin şifreli ve erişim kontrollü ortamlarda tutulmasına imkân sağlar.
      </p>
      <p>
        Supabase&apos;in sunucularının bir kısmı yurtdışında bulunduğundan, formlar ve sistem kayıtları kapsamında işlenen verileriniz teknik olarak yurtdışındaki sunucularda muhafaza edilebilir. Bu durum, mesajlaşma platformlarına veya reklam/ticari iletişim sağlayıcılarına veri aktarımı anlamına gelmez; amaç yalnızca verilerin güvenli depolanması ve platformun çalışmasının sağlanmasıdır. Yurtdışına aktarımın hukuki dayanağı, ilgili veri kategorileri için işbu metinde belirtilen açık rıza ve diğer şartlarla sınırlıdır.
      </p>
      <ul>
        <li><strong>Yetkili Kurumlar:</strong> Hukuki uyuşmazlıklar veya adli/idari makamların usulüne uygun talepleri halinde, talep konusu veriler (örneğin IP kayıtları) kanuni yükümlülüklerin yerine getirilmesi amacıyla ilgili resmi makamlara aktarılabilir.</li>
      </ul>

      <h2 id={slugifyId("Kişisel Verilerin Saklanma ve İmha Süresi")}>6. Kişisel Verilerin Saklanma ve İmha Süresi</h2>
      <p>
        İşlenen kişisel veriler, işlenme amacının ortadan kalkması veya yasal saklama sürelerinin sona ermesi halinde, Kişisel Verileri Koruma Kurulu tarafından yayımlanan rehberlere ve Veri Sorumlusunun Kişisel Veri Saklama ve İmha Politikası&apos;na uygun olarak silinir, yok edilir veya anonim hale getirilir. Form verileri ve iletişim bilgileri, ilgili süreç tamamlandıktan ve saklama yükümlülüğü bulunmadıkça makul süre içinde imha edilir.
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
