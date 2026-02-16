import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVKK",
  description:
    "Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni. Veri sorumlusu olarak kişisel verilerin işlenmesi ve korunması.",
};

export default function KvkkPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">
        Kişisel Verilerin Korunması ve İşlenmesine İlişkin Aydınlatma Metni
      </h1>
      <p className="text-xs text-slate-500">Son güncellenme: 16/02/2026</p>

      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        <p>
          YasalHaklariniz.com olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında, veri sorumlusu sıfatıyla kişisel verilerinizi hukuka ve dürüstlük kurallarına uygun şekilde işlemekte, muhafaza etmekte ve korumaktayız.
        </p>
        <p>
          Bu metin, platformumuz üzerinden elde edilen kişisel verilerin hangi kapsamda işlendiğine ilişkin bilgilendirme amacı taşır.
        </p>

        <p className="font-bold text-slate-900">1. İşlenen Kişisel Veriler</p>
        <p>
          Platform üzerinden aşağıdaki kişisel veriler işlenebilmektedir:
        </p>
        <p className="font-semibold text-slate-800">Soru Gönderimi Sürecinde:</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>İsteğe bağlı olarak paylaşılan e-posta adresi</li>
        </ul>
        <p className="font-semibold text-slate-800">Yazar ve Editör Başvurularında:</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>Ad ve soyad</li>
          <li>Telefon numarası</li>
          <li>E-posta adresi</li>
          <li>Özgeçmiş (CV) içerisinde yer alan mesleki ve iletişim bilgileri</li>
        </ul>
        <p>
          Platformumuz kullanıcılarından kimlik numarası, adres, finansal veri veya özel nitelikli kişisel veri talep edilmemektedir.
        </p>

        <p className="font-bold text-slate-900">2. Kişisel Verilerin İşlenme Amaçları</p>
        <p>Toplanan kişisel veriler;</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>Kullanıcı sorularına geri dönüş yapılabilmesi</li>
          <li>Yazar ve editör başvurularının değerlendirilmesi</li>
          <li>Başvuru sahipleri ile iletişime geçilmesi</li>
          <li>Platformun teknik güvenliğinin sağlanması</li>
          <li>Hukuki yükümlülüklerin yerine getirilmesi</li>
        </ul>
        <p>amaçlarıyla işlenmektedir.</p>

        <p className="font-bold text-slate-900">3. Kişisel Verilerin Aktarımı</p>
        <p>Kişisel verileriniz;</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>Yasal zorunluluk halinde yetkili kamu kurum ve kuruluşlarına</li>
          <li>Hukuki yükümlülük kapsamında adli mercilere</li>
        </ul>
        <p>aktarılabilir.</p>
        <p>
          Bunun dışında kişisel veriler üçüncü kişilerle ticari amaçla paylaşılmaz, satılmaz veya devredilmez.
        </p>

        <p className="font-bold text-slate-900">4. Veri Toplama Yöntemi ve Hukuki Sebep</p>
        <p>Kişisel verileriniz;</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>Web sitesi üzerindeki başvuru ve iletişim formları aracılığıyla</li>
          <li>Elektronik ortamda otomatik veya kısmen otomatik yollarla</li>
        </ul>
        <p>
          KVKK m.5/2 kapsamında sözleşmenin kurulması, hukuki yükümlülüklerin yerine getirilmesi ve meşru menfaat hukuki sebeplerine dayanılarak işlenmektedir.
        </p>

        <p className="font-bold text-slate-900">5. Saklama Süresi</p>
        <p>Kişisel veriler;</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>Soru süreci tamamlandıktan sonra makul süre içinde</li>
          <li>Başvurular bakımından değerlendirme süreci sona erdikten sonra</li>
        </ul>
        <p>silinir, yok edilir veya anonim hale getirilir.</p>

        <p className="font-bold text-slate-900">6. KVKK Kapsamındaki Haklarınız</p>
        <p>KVKK m.11 kapsamında;</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>İşlenmişse bilgi talep etme</li>
          <li>İşlenme amacını öğrenme</li>
          <li>Yanlış veya eksik işlenmişse düzeltilmesini isteme</li>
          <li>Silinmesini veya yok edilmesini talep etme</li>
          <li>İşlemenin kanuna aykırı olması halinde zararın giderilmesini talep etme</li>
        </ul>
        <p>haklarına sahipsiniz.</p>
        <p>
          Bu haklara ilişkin taleplerinizi site üzerinden iletişim adresine iletebilirsiniz.
        </p>
      </div>
    </div>
  );
}
