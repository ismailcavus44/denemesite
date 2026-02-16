export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  /** Kategori URL slug (topic silo: /[category]/rehber/[slug]) */
  categorySlug: string;
  /** Yazar sayfası slug (örn. ismail-cavus) */
  authorSlug?: string;
  date: string;
  readTime: string;
  image?: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "kira-sorunlarinda-ilk-adimlar",
    title: "Kira sorunlarında ilk adımlar",
    summary:
      "Ev sahibi veya kiracı olarak yaşanan anlaşmazlıklarda izlenebilecek temel adımlar.",
    category: "Hukuk Rehberi",
    categorySlug: "hukuk-rehberi",
    authorSlug: "ismail-cavus",
    date: "2026-02-09",
    readTime: "3 dk",
    image: "/blog/kira-sorunlari.webp",
    content: [
      "Kira ilişkilerinde anlaşmazlıklar yaygın olabilir. Önce sakin bir iletişim kurmak ve konuyu yazılı şekilde netleştirmek iyi bir başlangıçtır.",
      "Sorun devam ediyorsa, kira sözleşmesi ve ödeme kayıtlarını düzenli şekilde saklamak önemlidir. Bu belgeler olası bir resmi süreçte temel referans olur.",
      "Çözüm için arabuluculuk veya profesyonel destek gibi seçenekler değerlendirilebilir. Sürecin kapsamı durumun detaylarına göre değişir.",
    ],
  },
  {
    slug: "muris-muvazaasi-nedir",
    title: "Muris muvazaası nedir?",
    summary: "Muris muvazaası kavramının hukuki tanımı ve sonuçları.",
    category: "Hukuk Rehberi",
    categorySlug: "hukuk-rehberi",
    authorSlug: "ismail-cavus",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Muris muvazaası, miras bırakanın sağlığında gerçek iradesine aykırı olarak yaptığı işlemlerle mirasçıları aldatmaya yönelik anlaşmaları ifade eder. Bu tür işlemler mirasçılar tarafından iptal edilebilir.",
    ],
  },
  {
    slug: "tapu-iptal-davasi-nedir",
    title: "Tapu iptal davası nedir?",
    summary: "Tapu iptal davasının ne olduğu ve hangi durumlarda açıldığı.",
    category: "Hukuk Rehberi",
    categorySlug: "hukuk-rehberi",
    authorSlug: "ismail-cavus",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Tapu iptal davası, tapu kaydının hukuka aykırı olduğu iddiasıyla kaydın silinmesi veya düzeltilmesi için açılan davadır. Yetkili mahkeme tarafından iptal kararı verilirse tapu idaresi kaydı günceller.",
    ],
  },
  {
    slug: "tapuda-bagis-nedir",
    title: "Tapuda bağış nedir?",
    summary: "Tapuda bağış işleminin tanımı ve şartları.",
    category: "Hukuk Rehberi",
    categorySlug: "hukuk-rehberi",
    authorSlug: "ismail-cavus",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Tapuda bağış, taşınmaz malın tapu sicilinde bağış sözleşmesiyle malikin başkasına devredilmesidir. Bağışlayan ve bağışlananın anlaşması ile noter veya tapu müdürlüğünde yapılır.",
    ],
  },
  {
    slug: "tapuda-satis-nedir",
    title: "Tapuda satış nedir?",
    summary: "Tapuda satış işleminin hukuki çerçevesi.",
    category: "Hukuk Rehberi",
    categorySlug: "hukuk-rehberi",
    authorSlug: "ismail-cavus",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Tapuda satış, taşınmazın mülkiyetinin satış sözleşmesiyle alıcıya devredilmesi ve bu devrin tapu sicilinde tescil edilmesidir. Geçerli bir satış için tarafların sözleşmesi ve tapu müdürlüğünde devir işlemi gerekir.",
    ],
  },
  {
    slug: "sakli-pay-nedir",
    title: "Saklı pay nedir?",
    summary: "Saklı pay kavramı ve mirasçıların saklı pay hakları.",
    category: "Miras ve Tapu",
    categorySlug: "miras-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Saklı pay, yasada belirlenen oranlarda mirasçıların miras bırakandan hiçbir şekilde yoksun bırakılamayacakları paydır. Miras bırakan vasiyetname veya bağışla bu payları ortadan kaldıramaz.",
    ],
  },
  {
    slug: "tenkis-davasi-nedir",
    title: "Tenkis davası nedir?",
    summary: "Tenkis davasının amacı ve koşulları.",
    category: "Miras ve Tapu",
    categorySlug: "miras-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Tenkis davası, saklı payı zedelenen mirasçının, miras bırakanın yaptığı tasarrufların saklı paya tecavüz eden kısmının tenkisini (indirimini) talep ettiği davadır.",
    ],
  },
  {
    slug: "muhdesat-nedir",
    title: "Muhdesat nedir?",
    summary: "Muhdesat kavramının tapu ve miras hukukundaki anlamı.",
    category: "Miras ve Tapu",
    categorySlug: "miras-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Muhdesat, bir taşınmaz üzerine sonradan yapılan ve tapu kütüğünde ayrı bir sayfada gösterilebilen yapılar (bina, tesis vb.) için kullanılır. Taşınmazın maliki ile muhdesatın maliki farklı kişiler olabilir.",
    ],
  },
  {
    slug: "ecrimisil-nedir",
    title: "Ecrimisil nedir?",
    summary: "Ecrimisil tazminatının tanımı ve hesaplanması.",
    category: "Miras ve Tapu",
    categorySlug: "miras-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Ecrimisil, haksız olarak bir taşınmazı işgal eden kişinin, işgal süresi boyunca ödemesi gereken kira bedeli niteliğindeki tazminattır. Malik veya zilyet ecrimisil talebinde bulunabilir.",
    ],
  },
  {
    slug: "miras-paylasimi-nedir",
    title: "Miras paylaşımı nedir?",
    summary: "Miras paylaşımının hukuki süreci.",
    category: "Miras ve Tapu",
    categorySlug: "miras-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Miras paylaşımı, miras bırakanın ölümüyle mirasçıların yasal paylarına göre malvarlığının dağıtılması sürecidir. Anlaşmalı veya mahkeme yoluyla yapılabilir.",
    ],
  },
  {
    slug: "mirascilik-belgesi-veraset-ilami-nedir",
    title: "Mirasçılık belgesi (veraset ilamı) nedir?",
    summary: "Veraset ilamının ne olduğu ve nereden alındığı.",
    category: "Miras ve Tapu",
    categorySlug: "miras-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Mirasçılık belgesi (veraset ilamı), sulh hukuk mahkemesince düzenlenen, miras bırakanın mirasçılarını ve paylarını gösteren resmî belgedir. Tapu, banka ve diğer kurumlarda mirasçılığın ispatı için kullanılır.",
    ],
  },
  {
    slug: "tasarrufun-iptali-davasi-nedir",
    title: "Tasarrufun iptali davası nedir?",
    summary: "Tasarrufun iptali davasının kapsamı ve şartları.",
    category: "Miras ve Tapu",
    categorySlug: "miras-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Tasarrufun iptali davası, miras bırakanın saklı paylara tecavüz eden tasarruflarının (vasiyetname, bağış vb.) iptalini talep etmek için mirasçılar tarafından açılan davadır.",
    ],
  },
  {
    slug: "icra-yoluyla-satis-nedir",
    title: "İcra yoluyla satış nedir?",
    summary: "İcra yoluyla satış işleminin tanımı ve süreci.",
    category: "İcra Hukuku",
    categorySlug: "icra-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "İcra yoluyla satış, icra dairesi tarafından borçlunun haczedilen taşınır veya taşınmaz malının açık artırma ile satılarak alacaklıya ödeme yapılması işlemidir.",
    ],
  },
  {
    slug: "hisseli-tapu-nedir",
    title: "Hisseli tapu nedir?",
    summary: "Hisseli tapu ve paylı mülkiyet ilişkisi.",
    category: "Miras ve Tapu",
    categorySlug: "miras-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Hisseli tapu, bir taşınmazın mülkiyetinin birden fazla kişiye belirli pay oranlarıyla (örn. 1/2, 1/3) ait olduğunun tapu kütüğünde gösterildiği durumdur. Paylı mülkiyet rejimi uygulanır.",
    ],
  },
  {
    slug: "payli-mulkiyet-nedir",
    title: "Paylı mülkiyet nedir?",
    summary: "Paylı mülkiyet rejiminin tanımı ve sonuçları.",
    category: "Miras ve Tapu",
    categorySlug: "miras-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Paylı mülkiyet, bir malın mülkiyetinin birden fazla kişiye belirli paylarla ait olduğu rejimdir. Her paydaş kendi payı üzerinde tasarruf edebilir; ortaklığın giderilmesi davası açılabilir.",
    ],
  },
  {
    slug: "elbirliği-mulkiyeti-nedir",
    title: "Elbirliği mülkiyeti nedir?",
    summary: "Elbirliği mülkiyeti rejiminin özellikleri.",
    category: "Miras ve Tapu",
    categorySlug: "miras-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Elbirliği mülkiyeti, miras ortaklığı gibi durumlarda mirasçıların miras malları üzerinde payları ayrılmadan birlikte malik oldukları rejimdir. Paylı mülkiyete geçiş için mirasçılık belgesi ve tapu işlemi gerekebilir.",
    ],
  },
  {
    slug: "zilyetlik-nedir",
    title: "Zilyetlik nedir?",
    summary: "Zilyetlik kavramının hukuki anlamı.",
    category: "Miras ve Tapu",
    categorySlug: "miras-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Zilyetlik, bir şey üzerinde fiilî hakimiyet veya hukuken korunan tasarruf yetkisidir. Taşınır ve taşınmazlar için farklı düzenlemeler vardır; tapu sicili taşınmazlarda zilyetliğin karinesi sayılır.",
    ],
  },
  {
    slug: "kira-sozlesmesi-nedir",
    title: "Kira sözleşmesi nedir?",
    summary: "Kira sözleşmesinin unsurları ve türleri.",
    category: "Konut",
    categorySlug: "gayrimenkul-hukuku",
    categorySlug: "gayrimenkul-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Kira sözleşmesi, bir şeyin kullanımının veya kullanım ve faydalanma hakkının belli bir süre karşılığında kiraya veren tarafından kiracıya bırakılmasını düzenleyen sözleşmedir. Konut ve iş yeri kiralarında özel kanun hükümleri uygulanır.",
    ],
  },
  {
    slug: "tahliye-davasi-nedir",
    title: "Tahliye davası nedir?",
    summary: "Tahliye davasının ne zaman ve nasıl açıldığı.",
    category: "Konut",
    categorySlug: "gayrimenkul-hukuku",
    categorySlug: "gayrimenkul-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Tahliye davası, kira sözleşmesinin sona ermesi veya feshi sonrası kiracının taşınmazı boşaltmaması halinde malik veya yeni malik tarafından kiracının çıkarılması için açılan davadır.",
    ],
  },
  {
    slug: "is-kazasi-nedir",
    title: "İş kazası nedir?",
    summary: "İş kazasının hukuki tanımı ve bildirimi.",
    category: "İş Hukuku",
    categorySlug: "is-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "İş kazası, işçinin işyerinde veya işin yürütümü sırasında geçirdiği ve bedenî veya ruhî zarara yol açan olaydır. İşveren kazayı Sosyal Güvenlik Kurumuna ve gerekirse yetkili makamlara bildirmekle yükümlüdür.",
    ],
  },
  {
    slug: "iscilik-alacaklari-nelerdir",
    title: "İşçilik alacakları nelerdir?",
    summary: "İşçinin talep edebileceği alacak türleri.",
    category: "İş Hukuku",
    categorySlug: "is-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "İşçilik alacakları, ücret, fazla mesai, yıllık izin ücreti, kıdem tazminatı, ihbar tazminatı ve benzeri iş sözleşmesinden doğan alacaklardır. İşçi bu alacakları için iş mahkemesinde dava açabilir.",
    ],
  },
  {
    slug: "kidem-tazminati-nedir",
    title: "Kıdem tazminatı nedir?",
    summary: "Kıdem tazminatına hak kazanma koşulları.",
    category: "İş Hukuku",
    categorySlug: "is-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Kıdem tazminatı, belirli süre (en az bir yıl) çalışmış işçinin iş sözleşmesinin kanunda sayılan hallerde sona ermesi durumunda işveren tarafından ödenen tazminattır. Hak ediş şartları İş Kanununda düzenlenir.",
    ],
  },
  {
    slug: "ihbar-tazminati-nedir",
    title: "İhbar tazminatı nedir?",
    summary: "İhbar tazminatının hesaplanması ve ödenmesi.",
    category: "İş Hukuku",
    categorySlug: "is-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "İhbar tazminatı, iş sözleşmesinin feshi halinde ihbar süresine uyulmaması durumunda ödenen tazminattır. İşçi veya işveren fesih bildiriminde bulunurken kanuni ihbar süresine uymak zorundadır; uyulmazsa karşı taraf ihbar tazminatı talep edebilir.",
    ],
  },
  {
    slug: "nafaka-nedir",
    title: "Nafaka nedir?",
    summary: "Nafaka türleri ve belirlenmesi.",
    category: "Aile Hukuku",
    categorySlug: "aile-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Nafaka, yasal olarak bir kişinin geçimini sağlamakla yükümlü olanın ödemesi gereken maddi destektir. Tedbir nafakası, yoksulluk nafakası, çocuk nafakası gibi türleri vardır; miktar ve süre mahkemece veya anlaşmayla belirlenir.",
    ],
  },
  {
    slug: "bosanma-davasi-nedir",
    title: "Boşanma davası nedir?",
    summary: "Boşanma davasının koşulları ve sonuçları.",
    category: "Aile Hukuku",
    categorySlug: "aile-hukuku",
    date: "2026-02-09",
    readTime: "2 dk",
    content: [
      "Boşanma davası, evlilik birliğinin mahkeme kararıyla sona erdirilmesi için eşlerden birinin veya her ikisinin açtığı davadır. Kanunda sayılan boşanma sebepleri veya ortak rıza ile açılabilir; mal paylaşımı, nafaka ve velayet gibi konular da davada çözümlenir.",
    ],
  },
];
