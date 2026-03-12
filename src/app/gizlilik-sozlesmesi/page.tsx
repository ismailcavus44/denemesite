import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { LegalLayout, slugifyId } from "@/components/legal-layout";

const _t = "Gizlilik Politikası | YasalHaklarınız";
const _d = "YasalHaklarınız gizlilik ve veri koruma politikası. Toplanan veriler, kullanım amaçları ve kullanıcı hakları hakkında bilgi.";
const _u = `${siteConfig.url}/gizlilik-sozlesmesi`;

const LAST_UPDATED = "12 Mart 2026";

export const metadata: Metadata = {
  title: { absolute: "Gizlilik Politikası | YasalHaklarınız" },
  description: _d,
  openGraph: { title: _t, description: _d, url: _u },
  twitter: { card: "summary_large_image", title: _t, description: _d },
  alternates: { canonical: _u },
};

export default function GizlilikSozlesmesiPage() {
  return (
    <LegalLayout
      title="Gizlilik Politikası"
      lastUpdated={LAST_UPDATED}
    >
      <h2 id={slugifyId("Amaç ve Kapsam")}>1. Amaç ve Kapsam</h2>
      <p>
        yasalhaklariniz.com (&quot;Site&quot;), kullanıcıların hukuki konularda genel ve temel düzeyde bilgiye ulaşabilmesi amacıyla kurulan anonim bir soru-cevap platformudur. İşbu Gizlilik Politikası, sitemizi ziyaret eden tüm kullanıcıların, soru soranların ve yazar/editör adaylarının sitemizi kullanırken paylaştıkları verilerin nasıl toplandığını, korunduğunu, işlendiğini ve imha edildiğini şeffaf bir şekilde açıklamak amacıyla hazırlanmıştır. Sitemizi kullanarak bu politikada yer alan şartları kabul etmiş sayılırsınız.
      </p>

      <h2 id={slugifyId("Temel Prensibimiz Anonimlik")}>2. Temel Prensibimiz: Anonimlik</h2>
      <p>
        Platformumuzun temel yapı taşı &quot;anonimliktir&quot;. Sitemizde soru sormak, yanıtları okumak veya platformda gezinmek için üyelik açmanız, adınızı veya e-posta adresinizi vermeniz zorunlu değildir. Kullanıcılar, kimliklerini ifşa etmeden hukuki sorularını özgürce iletebilirler. Soru içeriklerinde kullanıcıların kendi istekleriyle ad-soyad veya kişisel detay paylaşmaları halinde, sitemiz bu verileri yayınlamadan önce sansürleme/anonimleştirme hakkını saklı tutar.
      </p>

      <h2 id={slugifyId("Toplanan Veriler ve Toplanma Yöntemleri")}>3. Toplanan Veriler ve Toplanma Yöntemleri</h2>
      <p>
        Sitemiz asgari veri toplama prensibiyle (data minimization) hareket eder. Kullanımınıza bağlı olarak yalnızca aşağıdaki veriler toplanmaktadır:
      </p>
      <ul>
        <li><strong>Pasif/Teknik Veriler:</strong> 5651 sayılı Kanun gereği yasal zorunluluk olan IP adresiniz, siteye giriş-çıkış saatleriniz, tarayıcı (browser) türünüz ve cihaz bilgileriniz otomatik olarak loglanır.</li>
        <li><strong>Gönüllü Olarak Sunulan Veriler (Opsiyonel):</strong> Sorunuza yanıt verildiğinde haberdar olmak isterseniz, tamamen kendi rızanızla form aracılığıyla ilettiğiniz Cep Telefonu Numaranız.</li>
        <li><strong>Yazar/Editör Başvuru Verileri:</strong> Gönüllü yazar veya editör olmak amacıyla başvuru formumuz üzerinden kendi hür iradenizle ilettiğiniz Özgeçmiş (CV), ad-soyad ve iletişim bilgileri.</li>
      </ul>

      <h2 id={slugifyId("Üçüncü Taraf Altyapılar ve Yurtdışı Veri Aktarımı")}>4. Üçüncü Taraf Altyapılar ve Yurtdışı Veri Aktarımı (Önemli)</h2>
      <p>
        Sitemiz, kesintisiz ve güvenli bir hizmet sunabilmek için global teknoloji sağlayıcılarıyla çalışmaktadır:
      </p>
      <ul>
        <li><strong>Veritabanı ve Saklama (Supabase):</strong> Sitemizin veritabanı altyapısı Supabase, Inc. tarafından sağlanmaktadır. Kendi rızanızla bıraktığınız telefon numaraları ve başvuru dosyalarınız, şifrelenmiş olarak Supabase&apos;in yurtdışı sunucularında (bulut ortamında) barındırılmaktadır.</li>
        <li><strong>Bildirim Entegrasyonu (Twilio ve Meta):</strong> Soru bildirimleri için tercih ettiğiniz telefon numarasına gönderilecek olan WhatsApp mesajları, Twilio Inc. API&apos;leri ve Meta Platforms, Inc. (WhatsApp) altyapısı üzerinden iletilmektedir. Sitemizde opsiyonel olarak sunulan &quot;WhatsApp Bildirimi Al&quot; özelliğini kullandığınızda, verilerinizin bu servis sağlayıcıların uluslararası sunucuları aracılığıyla işlendiğini ve yurtdışına aktarıldığını kabul etmiş olursunuz.</li>
      </ul>

      <h2 id={slugifyId("Veri Güvenliği ve Koruma Önlemleri")}>5. Veri Güvenliği ve Koruma Önlemleri</h2>
      <p>
        yasalhaklariniz.com, topladığı verilerin yetkisiz erişime, değiştirilmeye, ifşaya veya imhaya karşı korunması için endüstri standardı güvenlik önlemlerini alır. Veri iletimi sırasında SSL (Secure Socket Layer) şifreleme teknolojisi kullanılmaktadır. Ancak, internet üzerinden yapılan hiçbir veri iletiminin veya elektronik depolama yönteminin %100 güvenli olduğu garanti edilemez.
      </p>

      <h2 id={slugifyId("Veri Saklama Süresi ve İmha")}>6. Veri Saklama Süresi ve İmha</h2>
      <p>
        yasalhaklariniz.com, 6698 sayılı Kişisel Verilerin Korunması Kanunu ve &quot;Kişisel Verilerin Silinmesi, Yok Edilmesi veya Anonim Hale Getirilmesi Hakkında Yönetmelik&quot; hükümleri uyarınca, işlediği kişisel verileri yalnızca işlenme amacının gerektirdiği süre boyunca veya ilgili mevzuatta öngörülen yasal süreler zarfında muhafaza eder. Sürelerin dolması veya işleme amacının ortadan kalkması halinde veriler, bulut veritabanımızdan (Supabase) ve tüm sistemlerimizden kalıcı olarak silinir, yok edilir veya anonim hale getirilir.
      </p>

      <h3 id={slugifyId("Kullanıcı Telefon Numaraları")}>6.1. Kullanıcı Telefon Numaraları (WhatsApp Bildirimleri İçin)</h3>
      <ul>
        <li><strong>Durum A (Soru Yanıtlandığında):</strong> Kullanıcının sorusu yanıtlanıp, ilgili WhatsApp bildirimi Twilio/Meta API üzerinden kullanıcıya başarıyla iletildiği anda, söz konusu telefon numarası işleme amacını tamamlamış sayılır. Bu numara, sistem loglarındaki periyodik temizlik döngümüze bağlı olarak en geç 30 (otuz) gün içerisinde veritabanından kalıcı olarak silinir veya sistemle bağı koparılarak kriptografik olarak anonim hale getirilir.</li>
        <li><strong>Durum B (Soru Reddedildiğinde/Yanıtlanmadığında):</strong> Kullanıcının sorusu yayın kriterlerine uymadığı için reddedilirse veya sistemden silinirse, bildirime konu edilecek bir işlem kalmayacağından, bu soruyla eşleşen telefon numarası derhal (anında) veritabanından imha edilir.</li>
      </ul>

      <h3 id={slugifyId("Gönüllü Yazar ve Editör Adaylarına Ait Veriler")}>6.2. Gönüllü Yazar ve Editör Adaylarına Ait Veriler (CV, Kimlik ve İletişim)</h3>
      <ul>
        <li><strong>Başvurusu Reddedilen Adaylar:</strong> Gönüllülük başvurusu onaylanmayan adaylara ait özgeçmiş (CV), iletişim bilgileri ve portfolyo dosyaları, itiraz süreçlerinin yönetilebilmesi ve ileride açılabilecek yeni pozisyonlar için değerlendirme yapılabilmesi amacıyla başvurunun sonuçlanma tarihinden itibaren en fazla 6 (altı) ay süreyle saklanır ve bu sürenin sonunda geri döndürülemeyecek şekilde imha edilir.</li>
        <li><strong>Başvurusu Kabul Edilen (Aktif) Yazar/Editörler:</strong> Gönüllülük ilişkisi devam ettiği müddetçe verileri saklanır. Kişinin platformdan ayrılması veya ilişiğinin kesilmesi halinde ise; doğabilecek hukuki uyuşmazlıklarda (telif hakları, yayınlanan içerik sorumlulukları vb.) delil teşkil etmesi amacıyla, 6098 sayılı Türk Borçlar Kanunu Madde 146 uyarınca genel zamanaşımı süresi olan 10 (on) yıl boyunca yalnızca hukuki uyuşmazlıkların çözümü amacıyla erişime kısıtlanmış bir arşivde saklanır. Süre bitiminde imha edilir.</li>
      </ul>

      <h3 id={slugifyId("İşlem Güvenliği ve Trafik Kayıtları")}>6.3. İşlem Güvenliği ve Trafik Kayıtları (Log Verileri)</h3>
      <ul>
        <li>Siteyi ziyaret eden tüm kullanıcılara ait IP adresleri, siteye giriş-çıkış (erişim) tarih ve saatleri ile cihaz/tarayıcı bilgileri, 5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun uyarınca, veri bütünlüğü (hash) sağlanmış bir şekilde kanuni yükümlülük olarak 2 (iki) yıl süreyle saklanmak zorundadır. Bu süre dolduğunda kayıtlar sistemden periyodik olarak silinir.</li>
      </ul>

      <h3 id={slugifyId("Soru ve Cevap İçerikleri")}>6.4. Soru ve Cevap İçerikleri (Anonim Veriler)</h3>
      <ul>
        <li>Platformumuzun doğası gereği, isim belirtilmeden veya platform tarafından anonimleştirilerek yayınlanan hukuki sorular ve bunlara verilen cevaplar &quot;kişisel veri&quot; niteliği taşımamaktadır. Bu nedenle anonim soru-cevap içerikleri, platform yayında kaldığı sürece süresiz olarak saklanabilir ve kamuya açık olarak sergilenebilir. Ancak kullanıcının sorunun içinde yanlışlıkla kimliğini ifşa edecek veriler (TCKN, isim, tam adres vb.) paylaşması durumunda, tespit edildiği an veya kullanıcının talebi üzerine bu spesifik veriler derhal sansürlenir/silinir.</li>
      </ul>

      <h3 id={slugifyId("Veri Saklama Çerezler")}>6.5. Çerezler (Cookies)</h3>
      <ul>
        <li><strong>Oturum Çerezleri:</strong> Kullanıcı tarayıcıyı kapattığı anda otomatik olarak silinir.</li>
        <li><strong>Performans ve Analitik Çerezleri:</strong> Çerezin türüne göre en fazla 6 (altı) ay ile 1 (bir) yıl arasında tarayıcınızda saklanır. (Kullanıcı dilediği zaman tarayıcı ayarlarından bu çerezleri silebilir).</li>
        <li><strong>Periyodik İmha Süresi:</strong> yasalhaklariniz.com, saklama süresi dolan verileri tespit etmek ve imha etmek amacıyla, &quot;Kişisel Veri Saklama ve İmha Politikası&quot; gereğince sistemlerinde her 6 (altı) ayda bir otomatik ve manuel periyodik imha işlemi gerçekleştirmektedir.</li>
      </ul>

      <h2 id={slugifyId("Çerezler")}>7. Çerezler (Cookies)</h2>
      <p>
        Sitemiz, kullanıcı deneyimini optimize etmek, site trafiğini analiz etmek ve güvenliği sağlamak amacıyla temel/zorunlu çerezler (cookies) kullanmaktadır. Tarayıcı ayarlarınızı değiştirerek çerezleri reddedebilir veya silebilirsiniz; ancak bu durumda sitenin bazı fonksiyonları tam olarak çalışmayabilir.
      </p>

      <h2 id={slugifyId("Dış Bağlantılar")}>8. Dış Bağlantılar (Linkler)</h2>
      <p>
        yasalhaklariniz.com sayfalarında, başka web sitelerine (Yargıtay kararları, resmi gazeteler, mevzuat bilgi sistemleri vb.) yönlendiren bağlantılar bulunabilir. Sitemiz, bu harici sitelerin gizlilik uygulamalarından veya içeriklerinden sorumlu değildir. Ziyaret ettiğiniz dış sitelerin kendi gizlilik politikalarını okumanızı tavsiye ederiz.
      </p>

      <h2 id={slugifyId("Değişiklikler ve Güncellemeler")}>9. Değişiklikler ve Güncellemeler</h2>
      <p>
        Sitemiz, mevzuat değişiklikleri veya platformun sunduğu yeni özellikler doğrultusunda bu Gizlilik Politikası&apos;nı önceden haber vermeksizin güncelleme hakkını saklı tutar. Yapılan değişiklikler, Site&apos;de yayınlandığı tarihte yürürlüğe girer. Politikadaki güncellemeleri düzenli olarak takip etmek kullanıcının sorumluluğundadır.
      </p>

      <h2 id={slugifyId("İletişim")}>10. İletişim</h2>
      <p>
        Gizlilik Politikamız, veri güvenliği uygulamalarımız veya kişisel verilerinizle ilgili her türlü soru, talep ve geri bildirimleriniz için bizimle{" "}
        <a href="mailto:bilgi@yasalhaklariniz.com" className="text-slate-900 underline underline-offset-2 hover:no-underline">
          bilgi@yasalhaklariniz.com
        </a>
        {" "}adresi üzerinden iletişime geçebilirsiniz.
      </p>

      <p className="mt-8 text-sm text-slate-600">
        (Avukatlık reklam yasağı ve hukuki tavsiye verilmediğine ilişkin detaylar için lütfen sitemizdeki{" "}
        <Link href="/sorumluluk-reddi" className="text-slate-900 underline underline-offset-2 hover:no-underline">
          Sorumluluk Reddi Beyanı (Disclaimer)
        </Link>
        {" "}sayfasını inceleyiniz.)
      </p>
    </LegalLayout>
  );
}
