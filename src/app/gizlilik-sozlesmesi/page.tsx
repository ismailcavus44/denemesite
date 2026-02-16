import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Sözleşmesi",
  description:
    "YasalHaklarınız gizlilik ve veri koruma politikası. Toplanan veriler, kullanım amaçları ve kullanıcı hakları hakkında bilgi.",
};

export default function GizlilikSozlesmesiPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Gizlilik Sözleşmesi</h1>
      <p className="text-xs text-slate-500">Son güncellenme: 16/02/2026</p>

      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        <p className="font-bold text-slate-900">1. Amaç ve Kapsam</p>
        <p>
          Bu Gizlilik ve Veri Koruma Politikası, YasalHaklariniz.com (&quot;Platform&quot;) üzerinden toplanan kişisel verilerin işlenme esaslarını, güvenlik tedbirlerini, kullanıcı haklarını ve tarafların sorumluluklarını düzenler.
        </p>
        <p>
          Platformu kullanan herkes bu metni okumuş ve kabul etmiş sayılır.
        </p>
        <p>
          Platform, kişisel verilerin korunmasına ilişkin 6698 sayılı KVKK ve ilgili mevzuata uygun hareket eder.
        </p>

        <p className="font-bold text-slate-900">2. Toplanan Veriler</p>
        <p>
          Platform yalnızca faaliyet amacıyla sınırlı ve ölçülü veri toplar.
        </p>
        <p className="font-semibold text-slate-800">2.1 Soru Gönderimi</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>İsteğe bağlı e-posta adresi</li>
          <li>Kullanıcının soru metni içinde kendi iradesiyle paylaştığı bilgiler</li>
        </ul>
        <p>
          Platform, soru sorulması için kimlik, adres, T.C. kimlik numarası veya özel nitelikli kişisel veri talep etmez.
        </p>
        <p className="font-semibold text-slate-800">2.2 Yazar ve Editör Başvuruları</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>Ad ve soyad</li>
          <li>Telefon numarası</li>
          <li>E-posta adresi</li>
          <li>Özgeçmiş (CV)</li>
          <li>CV içerisinde yer alan mesleki bilgiler</li>
        </ul>
        <p>
          Başvuru sahipleri, CV içerisinde üçüncü kişilere ait verileri hukuka aykırı şekilde paylaşmamayı kabul eder.
        </p>

        <p className="font-bold text-slate-900">3. Veri İşleme Amaçları</p>
        <p>Toplanan veriler aşağıdaki amaçlarla işlenir:</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>Soruya geri dönüş yapılabilmesi</li>
          <li>İçerik üretim sürecinin yürütülmesi</li>
          <li>Yazar/Editör değerlendirme sürecinin gerçekleştirilmesi</li>
          <li>Başvuru sahipleriyle iletişim kurulması</li>
          <li>Hukuki yükümlülüklerin yerine getirilmesi</li>
          <li>Olası hukuki uyuşmazlıklarda delil niteliğinde kullanılması</li>
          <li>Platform güvenliğinin sağlanması</li>
        </ul>
        <p>
          Veriler ticari veri satışı, üçüncü taraf reklam aktarımı veya pazarlama amacıyla kullanılmaz.
        </p>

        <p className="font-bold text-slate-900">4. Kullanıcı İçerik Sorumluluğu</p>
        <p>Kullanıcılar;</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>Soru metni içinde üçüncü kişilere ait özel nitelikli veri paylaşmamayı</li>
          <li>Açık rıza olmaksızın kimlik, adres, sağlık bilgisi, finansal veri yayımlamamayı</li>
          <li>Hukuka aykırı içerik göndermemeyi</li>
        </ul>
        <p>kabul eder.</p>
        <p>
          Platform, kullanıcı tarafından sağlanan içeriklerden doğabilecek hukuki sorumluluğu kabul etmez.
        </p>
        <p>
          Gerekli görüldüğünde içerikler yayından kaldırılabilir veya anonimleştirilebilir.
        </p>

        <p className="font-bold text-slate-900">5. Veri Güvenliği</p>
        <p>Platform;</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>Yetkisiz erişimi engelleyecek teknik ve idari tedbirleri alır</li>
          <li>Sunucu güvenliği sağlar</li>
          <li>Erişim yetkilerini sınırlar</li>
          <li>Verileri makul süre boyunca muhafaza eder</li>
        </ul>
        <p>
          Ancak internet ortamında veri aktarımının tamamen risksiz olduğu garanti edilemez. Kullanıcı bu teknik gerçeği kabul eder.
        </p>

        <p className="font-bold text-slate-900">6. Saklama ve İmha Politikası</p>
        <p>Kişisel veriler;</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>İşleme amacı ortadan kalktığında</li>
          <li>Başvuru süreci sona erdiğinde</li>
          <li>Makul saklama süresi dolduğunda</li>
        </ul>
        <p>silinir, yok edilir veya anonim hale getirilir.</p>
        <p>
          Platform, gerekli hallerde hukuki yükümlülük sebebiyle belirli sürelerle saklama yapabilir.
        </p>

        <p className="font-bold text-slate-900">7. Üçüncü Taraf Aktarımı</p>
        <p>Veriler;</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>Yetkili kamu kurumlarına</li>
          <li>Mahkemelere</li>
          <li>Savcılıklara</li>
          <li>Yasal zorunluluk halinde resmi makamlara</li>
        </ul>
        <p>aktarılabilir.</p>
        <p>
          Bunun dışında üçüncü kişilere veri aktarımı yapılmaz.
        </p>

        <p className="font-bold text-slate-900">8. Çerezler ve Teknik Veriler</p>
        <p>Platform;</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>IP adresi</li>
          <li>Tarayıcı bilgisi</li>
          <li>Oturum verileri</li>
        </ul>
        <p>gibi teknik verileri sistem güvenliği amacıyla işleyebilir.</p>
        <p>
          Çerezler kullanıcı deneyimini geliştirmek amacıyla kullanılabilir.
        </p>

        <p className="font-bold text-slate-900">9. Sorumluluk Reddi</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>Platform üzerindeki soru-cevap içerikleri genel hukuki bilgilendirme niteliğindedir.</li>
          <li>Platform üzerinden yapılan paylaşımlar avukat-müvekkil ilişkisi oluşturmaz.</li>
          <li>Kullanıcı, hukuki işlem yapmadan önce bireysel danışmanlık alması gerektiğini kabul eder.</li>
        </ul>

        <p className="font-bold text-slate-900">10. Kullanıcı Hakları</p>
        <p>Kullanıcılar;</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>Verilerinin işlenip işlenmediğini öğrenme</li>
          <li>İşlenmişse bilgi talep etme</li>
          <li>Düzeltme isteme</li>
          <li>Silme talep etme</li>
          <li>İşlemeye itiraz etme</li>
        </ul>
        <p>haklarına sahiptir.</p>
        <p>
          Talepler makul sürede değerlendirilir.
        </p>

        <p className="font-bold text-slate-900">11. Politika Değişiklikleri</p>
        <p>
          Platform bu politikayı güncelleme hakkını saklı tutar. Güncel metin yayımlandığı tarihte yürürlüğe girer.
        </p>
      </div>
    </div>
  );
}
