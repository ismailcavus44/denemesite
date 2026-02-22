/** Rehber içeriği: paragraf, başlık veya madde listesi. Metinde *...* arası bold. */
export type ContentBlock =
  | { t: "p"; v: string }
  | { t: "h2"; v: string }
  | { t: "h3"; v: string }
  | { t: "ul"; v: string[] };

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
  /** Öne çıkan görsel (rehber detay sayfası). */
  image?: string;
  /** Anasayfa/rehber listesinde kartta kullanılacak görsel. Yoksa image kullanılır. */
  cardImage?: string;
  /** Arama için düz metin; contentBlocks varsa o render edilir. */
  content: string[];
  /** H2, H3, paragraf, liste ile zengin içerik (varsa kullanılır). */
  contentBlocks?: ContentBlock[];
  /** Sık sorulan sorular (accordion). */
  faq?: { question: string; answer: string }[];
  /** Özel meta başlık (yoksa title + site adı). */
  seoTitle?: string;
  /** Özel meta açıklama (yoksa summary). */
  seoDescription?: string;
};

/** Anasayfada "Rehber" bölümünde gösterilecek rehber slug'ları (en fazla 3, sırayla). */
export const HOMEPAGE_REHBER_SLUGS: string[] = [
  "muris-muvazaasi-nedir",
  "bosanma-davasinda-feragat-ve-hukuki-sonuclari",
];

export const blogPosts: BlogPost[] = [
  {
    slug: "muris-muvazaasi-nedir",
    title: "Muris Muvazaası Nedir?",
    summary:
      "Muris muvaazası, mirasçıyı miras hakkından yoksun bırakmak amacıyla yapılan, görünürde satış veya ölünceye kadar bakma sözleşmesi gibi gösterilen ancak aslen bağışlama amacı taşıyan danışıklı ve geçersiz hukuki işlemdir. Davanın şartları ve Yargıtay içtihatları.",
    category: "Miras ve Tapu",
    categorySlug: "miras-hukuku",
    authorSlug: "ismail-cavus",
    date: "2026-02-09",
    readTime: "8 dk",
    image: "/rehber/muris-muvaazasi-nedir.webp",
    cardImage: "/rehber/muris-muvazaasi-nedir-anasayfa.webp",
    seoTitle: "Muris Muvaazası Nedir? 2026 | YasalHaklarınız",
    seoDescription:
      "Muris muvaazası nedir? Yargıtay kararlarıyla mirasçıdan mal kaçırma davası şartları, zamanaşımı ve ispat yollarını uzman hukukçu gözüyle öğrenin.",
    content: [
      "Muris muvaazası, bir kimsenin mirasçısını miras hakkından yoksun bırakmak amacıyla yaptığı, gerçek iradesiyle örtüşmeyen, görünürde satış veya ölünceye kadar bakma sözleşmesi gibi gösterilen ancak aslen bağışlama amacı taşıyan danışıklı ve geçersiz hukuki işlemdir.",
    ],
    contentBlocks: [
      { t: "p", v: "*Muris muvaazası*, bir kimsenin mirasçısını miras hakkından yoksun bırakmak amacıyla yaptığı, gerçek iradesiyle örtüşmeyen, görünürde satış veya ölünceye kadar bakma sözleşmesi gibi gösterilen ancak aslen bağışlama amacı taşıyan danışıklı ve geçersiz hukuki işlemdir. Hukuk literatüründe mirasçıdan mal kaçırma olarak adlandırılan bu kavram, temelini 6098 sayılı Türk Borçlar Kanunu (TBK) m. 19 hükmünden alır. Muris muvaazasında mirasbırakan (muris), üçüncü bir kişiyle anlaşarak, aslında karşılıksız olarak devretmek istediği bir taşınmazı tapu dairesinde bedelini almış gibi \"satış\" göstererek devreder. Bu işlemin temel gayesi, diğer mirasçıların ileride açabileceği tenkis davalarının veya miras payı taleplerinin önüne geçerek terekedeki dengeleri hukuka aykırı şekilde değiştirmektir." },
      { t: "h2", v: "Muris Muvaazası Davası Açmanın Şartları Nelerdir?" },
      { t: "p", v: "*Muris muvaazası davası açmanın şartları*, mirasbırakanın sağlığında yaptığı bir devir işleminin hukuk düzeni tarafından geçersiz sayılabilmesi için kümülatif olarak bir arada bulunması gereken teknik unsurlardır. Yargıtay'ın yerleşik içtihatlarına göre, bu davanın dinlenebilmesi için sadece bir işlemin varlığı yeterli olmayıp, bu işlemin arka planındaki iradenin sakatlanmış olması gerekir. Temelde dört ana unsur üzerine inşa edilen bu şartlar dizisi, davacı mirasçının ispat yükünün de sınırlarını belirler. Bu davada zamanaşımı söz konusu olmadığı için, şartların varlığı on yıllar sonra bile ileri sürülebilir. Ancak mahkeme, bu şartların her birini 6100 sayılı Hukuk Muhakemeleri Kanunu (HMK) çerçevesinde, somut deliller ve hayatın olağan akışıyla test eder." },
      { t: "h3", v: "Görünürdeki İşlem - Satış Sözleşmesi veya Ölünceye Kadar Bakma Vaadi" },
      { t: "p", v: "Görünürdeki işlem, muris ile davalı (lehine mal kaçırılan kişi) arasındaki muvazaanın maskesi rolünü üstlenir. Bu işlem, tapu sicil memuru huzurunda resmi senetle gerçekleştirilen, dış dünyaya karşı hukuken geçerli bir mülkiyet nakli gibi sunulan sözleşmedir. Uygulamada en sık karşılaşılan türü taşınmaz satış sözleşmesidir. Burada muris, taşınmazını bir bedel karşılığında sattığını beyan eder. Ancak bu işlem, tarafların iç dünyasında hiçbir zaman bir satış sonucu doğurması amacıyla yapılmamıştır." },
      { t: "p", v: "İkinci yaygın tür ise ölünceye kadar bakma vaadi sözleşmesidir. Bu sözleşme türü, *muris muvaazasında* en çok tercih edilen kılıf işlemlerden biridir. Zira muris, ileride açılacak bir davaya karşı \"yaşlıydım, bakıma muhtaçtım, bu yüzden bana bakması şartıyla devrettim\" savunmasını önceden kurgular. Ancak Yargıtay, murisin bakım ihtiyacının olup olmadığını, yaşına, sağlık durumuna ve aile içindeki imkanlarına bakarak denetler. Eğer muris sağlıklıysa, malvarlığı genişse ve bakıma muhtaç değilken bu sözleşmeyi yapmışsa, görünürdeki bu bakım vaadi işleminin mirasçıdan mal kaçırma amacı taşıdığı kabul edilerek muvazaa nedeniyle iptali yoluna gidilir." },
      { t: "h3", v: "Muvazaa Anlaşması - Tarafların Gizli İradesi" },
      { t: "p", v: "Muvazaa anlaşması, muris ile sözleşmenin diğer tarafı olan kişi arasında yapılan ve görünürdeki işlemin hiçbir hukuki sonuç doğurmayacağı yönündeki gizli mutabakattır. Bu unsur, muvazaayı hata veya hileden ayıran temel farktır; zira burada taraflar bilinçli ve iradeli bir şekilde üçüncü kişileri (diğer mirasçıları) aldatma konusunda birleşmişlerdir. Muvazaa anlaşması yazılı olmak zorunda değildir; genellikle şifahi (sözlü) olarak yapılır ve davanın en zor ispat edilen kısmını oluşturur." },
      { t: "p", v: "Hukuki açıdan bu anlaşma, görünürdeki satışın bir oyun olduğunu tescil eder. Örneğin, tapuda satış bedeli ödendiği beyan edilse de taraflar kendi aralarında bu paranın aslında ödenmeyeceği veya ödendikten hemen sonra elden iade edileceği konusunda anlaşmışlardır. 6098 sayılı Türk Borçlar Kanunu çerçevesinde, tarafların gerçek iradeleri satış değil de başka bir yönde birleştiği için, görünürdeki işlem irade eksikliği nedeniyle başından itibaren hükümsüzdür. Mahkeme, bu gizli anlaşmanın varlığını doğrudan ispatlayamasa bile, yan deliller (banka kayıtlarının olmayışı, tarafların ekonomik durumu vb.) üzerinden bu sonuca varır." },
      { t: "h3", v: "Gizli İşlem - Asıl Yapılmak İstenen Bağışlama" },
      { t: "p", v: "*Muris muvaazasının* temelindeki gerçek hukuki işlem bağışlamadır. Muris, mülkiyetindeki bir malı mirasçılarından birine veya üçüncü bir kişiye bedelsiz (ivazsız) olarak devretmek istemektedir. Ancak bağışlama işleminin doğrudan yapılması halinde, diğer saklı paylı mirasçıların ölümü müteakip tenkis davası açarak bu malın belirli bir kısmını geri alabileceklerini bilmektedir. İşte bu hukuki sonuçtan kaçınmak için taraflar, bağışlama iradesini bir satış maskesinin altına gizlerler." },
      { t: "p", v: "Gizli işlemin hukuki kaderi, görünürdeki işlemden farklıdır. Görünürdeki satış işlemi muvazaa nedeniyle geçersizken, gizli olan bağışlama işlemi şekil noksanlığı nedeniyle geçersizdir. TMK m. 706 ve Tapu Kanunu m. 26 uyarınca, taşınmaz mülkiyetini devreden sözleşmelerin resmi senetle ve tarafların gerçek iradelerini (bağışlama) yansıtacak şekilde yapılması emredici bir kuraldır. Tapu dairesinde memur huzurunda satış olarak zapta geçen bir işlem, arka plandaki bağışlama iradesini yasal olarak taşıyamaz. Sonuç olarak, asıl istenen işlem olan bağışlama, kanunun öngördüğü resmi şekil şartına uygun yapılmadığı için hukuk aleminde geçerlilik kazanamaz." },
      { t: "h3", v: "Mirasçıdan Mal Kaçırma Kastı" },
      { t: "p", v: "Yargıtay 1. Hukuk Dairesi'nin istikrarlı kararlarında vurgulandığı üzere, her muvazaalı işlem muris muvaazası davasına konu olamaz; işlemin mutlaka mirasçıdan mal kaçırma kastı (animus fraudandi) ile yapılması gerekir. Bu kast, murisin sağlığında yaptığı devrin ana motivasyonunun, bir veya birkaç mirasçısını miras payından yoksun bırakmak olmasıdır. Eğer devir işleminin altında mal kaçırma kastı değil de, haklı ve makul bir sebep varsa muvazaadan söz edilemez." },
      { t: "p", v: "*Mal kaçırma kastının tespitinde mahkemenin baktığı temel kriterler şunlardır:*" },
      { t: "ul", v: [
        "Ekonomik Gereklilik: Murisin o dönemde paraya ihtiyacı olup olmadığı. (Örneğin; ağır bir hastalık, yüksek bir borç veya yeni bir yatırım ihtiyacı var mı?)",
        "Sosyal Durum ve Gelenekler: Toplumda sıkça rastlanan \"kız çocuktan mal kaçırıp erkek çocuğa verme\" veya \"ikinci eşten mal kaçırma\" gibi yaygın saikler.",
        "Paylaştırma (Denkleştirme) İradesi: Murisin sağlığında tüm mirasçılarına makul ve dengeli paylar verip vermediği. Eğer muris bir çocuğuna ev verip diğerlerine de benzer değerde mallar bırakmışsa, buradaki devir mal kaçırma değil, bir paylaştırma olarak kabul edilir ve dava reddedilir.",
        "Beşeri İlişkiler: Muris ile lehine devir yapılan kişi arasındaki yakınlık ve diğer mirasçılarla olan husumet durumu.",
      ] },
      { t: "p", v: "Mal kaçırma kastı, dış dünyada somutlaşan belirtilerle ispatlanır. Örneğin; muris malı sattıktan sonra o malda oturmaya devam ediyorsa (zilyetliğin devredilmemesi), satış bedeli ile rayiç değer arasında uçurum varsa ve bu bedelin murisin hesabına girmediği sabitse, mahkeme karine yoluyla mal kaçırma kastının varlığına hükmeder. Bu unsur, davanın olmazsa olmazıdır." },
      { t: "h2", v: "Mirasçıdan Mal Kaçırma Nasıl Anlaşılır?" },
      { t: "p", v: "Miras hukukunda bir işlemin gerçek bir satış mı yoksa mirasçılardan mal kaçırma amacı taşıyan bir muvazaa mı olduğunu tespit etmek, çoğu zaman doğrudan delillerden ziyade fiili karineler ve yaşamın olağan akışı ile mümkündür. Yargıtay, on yıllardır süregelen istikrarlı kararlarıyla, dış dünyadan gizlenen gerçek iradeyi gün yüzüne çıkaracak belirli objektif kriterler geliştirmiştir. Bir davanın kazanılması veya kaybedilmesi, genellikle bu kriterlerin somut olayda ne ölçüde ispatlanabildiğine bağlıdır. Mahkeme, dosyayı incelerken sadece kağıt üzerindeki resmi senetlere bakmaz; murisin ekonomik gücünden, aile içindeki huzursuzluklara, yerel geleneklerden, devir sonrası taşınmazın kim tarafından kullanıldığına kadar geniş bir yelpazeyi sorgular." },
      { t: "h3", v: "Satış Bedeli ile Gerçek Değer Arasındaki Fahiş Fark" },
      { t: "p", v: "*Mirasçıdan mal kaçırma* iddialarında mahkemenin ilk ve en somut inceleme noktası, tapuda gösterilen satış bedeli ile taşınmazın devir tarihindeki gerçek rayiç değeri (semen-i misil) arasındaki dengesizliktir. Eğer bir taşınmaz, piyasa değerinin çok altında, sembolik bir bedelle devredilmişse, bu durum muvazaanın en güçlü emarelerinden biri kabul edilir. Ancak Yargıtay'ın bu konudaki yaklaşımı salt matematiksel bir kıyaslamadan ibaret değildir. Tek başına bedel farkı muvazaanın kanıtı sayılmasa da diğer yan delillerle desteklendiğinde hakimin kanaatini doğrudan belirler." },
      { t: "p", v: "İnceleme sırasında mahkeme, konusunda uzman bilirkişilerden rapor alarak taşınmazın devir tarihindeki metrekare birim fiyatını, konumunu ve emsallerini belirler. Eğer tapu harcını az ödemek gibi vergi odaklı bir gerekçe sunulamıyorsa ve bedeller arasında fahiş (aşırı) bir fark varsa, bu işlem bağışlama olarak yorumlanır. Ayrıca, tapuda belirtilen bedelin murisin banka hesaplarına girip girmediği, girmişse bu paranın akıbeti (murisin bu parayı harcayıp harcamadığı veya kısa süre sonra alıcıya iade edip etmediği) titizlikle araştırılır. Bedelin hiç ödenmediğinin ispatı, işlemi doğrudan geçersiz kılar." },
      { t: "h3", v: "Murisin Mal Satmaya İhtiyacı Olup Olmadığının Tespiti" },
      { t: "p", v: "Bir kimsenin sahip olduğu taşınmazı satması için mantıklı bir sebebinin olması gerekir. Yargıtay, murisin mal satmaya ihtiyacı olup olmadığı kriterini, muvazaanın tespitinde en önemli sübut vasıtalarından biri olarak görür. Eğer muris; düzenli emekli maaşı olan, bankada birikmiş parası bulunan, kira gelirleri ile müreffeh bir hayat süren ve ciddi bir sağlık harcaması ya da borç baskısı altında olmayan biriyse, en değerli taşınmazını elden çıkarması hayatın olağan akışına aykırı bulunur." },
      { t: "p", v: "Mahkeme bu aşamada murisin sosyal ve ekonomik durum araştırmasını (SED) yapar. Murisin yaşam standardı ile yaptığı devir işlemi arasında bir rasyonalite aranır. Örneğin, 80 yaşında, tüm ihtiyaçları çocukları tarafından karşılanan ve nakit paraya ihtiyacı olmayan bir mirasbırakanın, tek evini en yakınındaki bir mirasçıya satması, aslında bir satış değil, mal kaçırma kastıyla yapılan bir bağışlamadır. Buna karşılık, murisin ciddi bir tedavi süreci için paraya ihtiyacı olduğu veya yüksek miktarlı bir borcu ödemek için piyasa değerine yakın bir bedelle satış yaptığı kanıtlanırsa, muvazaa iddiası çökecektir." },
      { t: "h3", v: "Aile İçi Gelenekler ve Haklı Sebeplerin Varlığı" },
      { t: "p", v: "Miras hukukunun sosyolojik boyutu, muvazaa davalarında sıklıkla karşımıza çıkar. Yargıtay, özellikle Anadolu'nun pek çok yerinde halen devam eden \"erkek çocukları kayırma\" veya \"kız çocuklarını mirastan mahrum bırakma\" gibi yerel gelenekleri, mal kaçırma kastının bir karinesi olarak değerlendirmektedir. Keza, murisin ikinci bir evlilik yapması durumunda ilk eşinden olan çocuklarından mal kaçırması veya tam tersi, ikinci eşini koruma altına almak amacıyla diğer mirasçıların saklı paylarını ihlal etmesi sık rastlanan senaryolardır." },
      { t: "p", v: "Öte yandan, her devir mal kaçırma amacı taşımaz; bazen ortada haklı bir sebep bulunabilir. Örneğin muris, kendisine yıllarca bakan, diğer mirasçıların arayıp sormadığı bir evladına minnet duygusuyla makul sınırlar içinde bir mal devretmiş olabilir. Ancak burada sınır paylaştırma kastı ile mal kaçırma kastı arasındaki ince çizgidir. Eğer muris sağlığında mirasçıları arasında adaletli bir paylaştırma yapmış (denkleştirme), yani her birine gücü nispetinde bir şeyler bırakmışsa, tek bir taşınmazın satışındaki pürüzler muvazaa olarak nitelendirilmeyebilir. Mahkeme, murisin tüm mirasçılarına karşı olan tutumunu, aralarındaki husumetleri ve sevgi bağlarını bir bütün olarak analiz ederek kararını verir." },
      { t: "h2", v: "Muris Muvaazası Davasını Kimler Açabilir?" },
      { t: "p", v: "*Muris muvaazası davasında davacı* sıfatı, miras hakkı çiğnenen kişilere tanınmış hukuki bir imkandır. Bu dava, temelini miras bırakanın muvazaalı işlemiyle terekeden eksiltilen malın geri kazandırılması amacından aldığı için, aktif dava ehliyeti doğrudan mirasçılık sıfatına bağlanmıştır. Yargıtay içtihatlarında, bu konuda kimlerin dava açabileceğine dair sınırlar net bir şekilde çizilmiştir. Buna göre; mirasbırakanın sağlığında yaptığı muvazaalı devirlerle miras hakkı zedelenen her mirasçı, bu davayı açma hakkına sahiptir." },
      { t: "p", v: "Burada dikkat edilmesi gereken en kritik husus, davanın açılabilmesi için mirasbırakanın vefat etmiş olması gerekliliğidir. Muris sağ iken, mirasçılar müstakbel miras haklarına dayanarak bu davayı ikame edemezler. Mirasın açılmasıyla birlikte (ölüm anı), muvazaalı işlemin geçersizliğini ileri sürme hakkı her bir mirasçıya bağımsız olarak geçer. Mirasçılar, kendi miras payları oranında tapu iptal ve tescil talebinde bulunabilecekleri gibi, terekeye iade talepli olarak da süreci yürütebilirler." },
      { t: "h3", v: "Saklı Paylı Mirasçılar Dışındaki Mirasçıların Durumu" },
      { t: "p", v: "*Muris muvaazası davasının*, tenkis davası ile karıştırıldığı en temel nokta saklı pay (mahfuz hisse) meselesidir. Tenkis davasını sadece saklı payı ihlal edilen mirasçılar açabilirken, muris muvaazası davasını saklı payı olsun veya olmasın tüm yasal mirasçılar açabilir. Bu durum, muvazaalı işlemin mutlak butlan (kesin hükümsüzlük) ile malul olmasından kaynaklanır. İşlem başından itibaren geçersiz olduğu için, mirasbırakanın altsoyu, ana-babası, kardeşi ve hatta atanmış mirasçıları dahi bu davanın davacısı olabilir." },
      { t: "p", v: "Örneğin; bir kimsenin hiç çocuğu yoksa ve tüm malvarlığını muvazaalı bir şekilde bir arkadaşına devretmişse, murisin yasal mirasçısı olan kardeşleri, saklı payları bulunmamasına rağmen bu davanın aktif süjesi olabilirler. Yargıtay, bu noktada mirasçının saklı payının olup olmadığını değil, mirasçı sıfatının bulunup bulunmadığını denetler. Eğer davacı, mirasbırakanın vefatı anında geçerli bir mirasçılık belgesine (veraset ilamı) sahipse ve yapılan devir ile miras payı azalmışsa, dava açma hakkı hukuken korunur." },
      { t: "h3", v: "Mirasçı Olmayan Kişilerin Dava Ehliyeti Var mıdır?" },
      { t: "p", v: "Hukuk sistemimizde *muris muvaazası davası*, miras hukukuna özgü bir butlan davası olarak kurgulanmıştır. Bu nedenle, mirasçı sıfatına sahip olmayan kişilerin bu davayı açma yetkisi yoktur. Mirasbırakanın alacaklıları veya vasiyetname ile kendisine belirli bir mal vasiyet edilen (musaleh) kişiler, muvazaa nedeniyle tapu iptal davası açamazlar. Alacaklıların durumu, 6098 sayılı Türk Borçlar Kanunu kapsamında genel muvazaa veya İcra İflas Kanunu uyarınca tasarrufun iptali davası çerçevesinde değerlendirilir; ancak muris muvaazası özel hukuksal zemininde bir hak iddia edemezler." },
      { t: "p", v: "Ayrıca, mirasçılıktan çıkarılan (ıskat edilen) veya mirastan yoksun bırakılan kişilerin de dava ehliyeti bulunmamaktadır. Zira bu kişilerin muris ile olan miras bağı kopmuştur. Ancak mirasçılıktan çıkarılma işleminin iptali için bir dava açılmış ve kazanılmışsa, kişi yeniden mirasçı sıfatını kazanacağı için muvazaa davası açma hakkına da kavuşacaktır. Özetle; dava açıldığı tarihte davacının geçerli bir mirasçılık hakkının bulunması, davanın esasına girilebilmesi için bir dava şartıdır." },
      { t: "h3", v: "Mirasın Reddi Durumunda Dava Hakkı" },
      { t: "p", v: "Mirasın reddi (redd-i miras), mirasçının muristen kalan hem borçlardan hem de haklardan vazgeçmesi anlamına gelen iradi bir beyandır. TMK m. 605 ve devamı maddeleri uyarınca mirası reddeden bir mirasçı, sanki muristen önce ölmüş gibi miras dışı kalır. Bu durumun doğal sonucu olarak; mirası reddeden mirasçının, mirasbırakanın yaptığı muvazaalı işlemlere karşı dava açma hakkı ortadan kalkar. Kişi mirası reddederek tereke üzerindeki tüm mülkiyet iddialarından vazgeçtiği için, artık \"miras hakkı çiğnenen kişi\" sıfatını taşıyamaz." },
      { t: "p", v: "Ancak burada ince bir hukuki nüans mevcuttur: Eğer mirasçı, mirası reddetmeden önce bu davayı açmış ve dava süreci devam ederken mirası reddetmişse, mahkeme davanın ehliyet yokluğu nedeniyle reddine karar verir. Buna karşın, murisin diğer mirasçıları muvazaa davasına devam edebilirler. Mirasın reddi durumunda, reddeden mirasçının payı varsa onun altsoyuna, yoksa diğer mirasçılara geçer. Bu yeni hak sahipleri, mirasçı sıfatını kazandıkları andan itibaren muvazaalı işleme karşı dava açma yetkisini de kendiliğinden devralmış olurlar." },
      { t: "h2", v: "Muris Muvaazası Davasında Zamanaşımı ve Hak Düşürücü Süre" },
      { t: "p", v: "Miras hukukunun en avantajlı düzenlemelerinden biri, muris muvaazası davasının herhangi bir zamanaşımı süresine veya hak düşürücü süreye tabi olmamasıdır. İnternet üzerinde yer alan pek çok hatalı yazıda bu davanın 1, 5 veya 10 yıllık sürelere tabi olduğu yönünde yanıltıcı ibareler bulunsa da, Türk hukuk sistemi ve yerleşik Yargıtay içtihatları bu konuda nettir: Muris muvaazasına dayalı tapu iptal ve tescil davası, mirasbırakanın ölümünden sonra her zaman açılabilir. Bu davanın zamanaşımına tabi olmamasının temel nedeni, muvazaalı işlemin mutlak butlan (kesin hükümsüzlük) ile malul olmasıdır. Hukuken geçersiz olan, yani hiç doğmamış kabul edilen bir işlem, üzerinden ne kadar zaman geçerse geçsin geçerli hale gelmez." },
      { t: "p", v: "Muvazaalı bir işlemle mirasçıdan mal kaçırıldığında, yapılan tescil işlemi yolsuz tescil niteliğindedir. 4721 sayılı Türk Medeni Kanunu (TMK) çerçevesinde yolsuz tescillere karşı açılan davalar, mülkiyet hakkının korunması esasına dayandığı için süre sınırı tanımaz. Dolayısıyla mirasbırakanın vefatının üzerinden 20, 30 hatta 50 yıl geçmiş olsa dahi, eğer muvazaa unsurları ispat edilebiliyorsa dava ikame edilebilir. Bu durum, özellikle mirasın açılmasından yıllar sonra ortaya çıkan gizli devirler veya sonradan fark edilen danışıklı işlemler için mirasçılara sarsılmaz bir hukuki güvence sağlar." },
      { t: "p", v: "Zamanaşımı konusundaki bu süre sınırı olmaması kuralı, davanın niteliği gereği hem yasal mirasçılar hem de atanmış mirasçılar için geçerlidir. Ancak burada stratejik bir ayrım yapmak gerekir: Her ne kadar dava açmak için bir süre sınırı bulunmasa da, ispat araçlarının korunması ve delillerin kaybolmaması adına davanın makul bir sürede açılması hukuki pratik açısından tavsiye edilir. Yıllar geçtikçe tanıkların vefat etmesi, banka kayıtlarına ulaşımın zorlaşması veya taşınmazın üçüncü, dördüncü kişilere devredilmesi süreci zorlaştırabilir. Yine de hukuki açıdan, \"süre geçtiği için dava hakkım bitti\" düşüncesi bu dava türü için tamamen geçersiz bir yanılgıdır." },
      { t: "p", v: "Yargıtay 1. Hukuk Dairesi ve Hukuk Genel Kurulu kararlarında defaatle vurgulandığı üzere; \"Muvazaa iddiasına dayalı davalar, hakkın özü ile ilgili olup tescilin dayanağı olan işlemin geçersizliğine dayandığından, bu davaların açılması herhangi bir süreye bağlı değildir.\" Ancak bu durumun tek bir pratik engeli olabilir: TMK m. 1023 uyarınca taşınmazı muvazaalı kişiden devralan iyiniyetli üçüncü kişilerin hakları. Eğer taşınmaz muvazaalı işlemden sonra iyiniyetli (muvazaayı bilmeyen) bir üçüncü kişiye satılmışsa, artık o kişiye karşı tapu iptali istenemez; ancak bu durumda da muvazaalı devralan kişiye karşı bedel tazminatı davası yine zamanaşımına takılmadan açılabilir." },
      { t: "h2", v: "Muris Muvaazası ile Tenkis Davası Arasındaki Farklar Nelerdir?" },
      { t: "p", v: "Miras hukukunda en sık düşülen hatalardan biri, *muris muvaazası davası* ile tenkis davasının aynı hukuki mekanizmalar olduğu yanılgısıdır. Oysa bu iki dava; dayandıkları kanun maddeleri, ispat kuralları ve doğurduğu sonuçlar bakımından birbirinden tamamen farklıdır. Bir müvekkilin hakkını hangi dava türüyle araması gerektiğini belirlemek, davanın usulden reddedilmemesi için hayati bir öneme sahiptir. Muris muvaazası bir geçersizlik (butlan) iddiasıyken, tenkis davası mirasbırakanın tasarruf özgürlüğünü aşarak saklı payları ihlal etmesi durumunda açılan bir indirim davasıdır." },
      { t: "p", v: "Aşağıdaki maddeler ve karşılaştırmalı analiz, bu iki teknik dava türü arasındaki temel uçurumları ortaya koymaktadır:" },
      { t: "ul", v: [
        "Hukuki Temel ve İşlemin Niteliği: Muris muvaazası davası, işlemin en başından itibaren sahte ve geçersiz olduğu iddiasına dayanır (TBK m. 19). Burada taraflar aslında satış yapmak istememiş, bağış iradelerini gizlemişlerdir. Tenkis davasında ise işlem (bağışlama veya vasiyetname) görünürde ve esasta gerçektir; ancak bu gerçek işlem mirasçıların saklı payına (kanuni alt sınırına) tecavüz ettiği için TMK m. 560 uyarınca yasal sınıra çekilmesi istenir.",
        "Dava Açma Süreleri (Zamanaşımı): Önceki bölümde de vurguladığımız üzere muris muvaazası davası hiçbir süre sınırına tabi değildir. Buna karşın tenkis davası, hak düşürücü sürelere tabidir. Mirasçılar, saklı paylarının zedelendiğini öğrendikleri tarihten itibaren 1 yıl ve her halükarda mirasın açılmasından (veya vasiyetnamenin açılmasından) itibaren 10 yıl içinde bu davayı açmak zorundadırlar.",
        "Aktif Husumet (Davacı Sıfatı): Muris muvaazası davasını, saklı pay sahibi olsun ya da olmasın tüm yasal mirasçılar açabilir. Tenkis davasını ise münhasıran saklı paylı mirasçılar (altsoy, anne-baba veya sağ kalan eş) açabilir. Saklı payı bulunmayan bir kardeş veya atanmış mirasçı tenkis davası açamazken, muvazaa davası açma hakkına sahiptir.",
        "Davanın Sonucu ve Etkisi: Muvazaa davası kazanıldığında, mahkeme işlemin tamamen iptaline ve malın sanki hiç devredilmemiş gibi terekeye geri dönmesine (veya pay oranında tesciline) karar verir. Tenkis davasında ise işlem iptal edilmez; sadece saklı payı aşan kısım kadar nakdi bir tazminata veya malın bir kısmının iadesine karar verilir.",
      ] },
      { t: "p", v: "Yargıtay, davacının dava dilekçesinde hukuki nitelemeyi yanlış yapmasını bir ret sebebi saymaz. Hakim, \"Hâkim, Türk hukukunu resen uygular\" (HMK m. 33) ilkesi gereği, davacının anlattığı olayların özüne bakar. Eğer davacı \"babam mal kaçırdı, tapunun iptalini istiyorum\" diyorsa, hakim bunu muvazaa davası olarak görür. Ancak talebin netleştirilmesi ve doğru stratejinin kurulması için alanında uzman bir avukat desteği, özellikle tenkis davasının süre sınırına takılmamak adına hayati önemdedir." },
      { t: "h2", v: "Muvazaalı Taşınmazın Üçüncü Kişilere Devri Durumunda Ne Olur?" },
      { t: "p", v: "Muris muvaazası davalarında en karmaşık ve riskli senaryo, mirasçıdan mal kaçırmak amacıyla devredilen taşınmazın, davalı tarafından dava açılmadan önce veya dava sürerken bir başkasına satılmasıdır. Bu durum, davanın sadece taraflarını değil, taşınmazın mülkiyet güvenliğini de doğrudan ilgilendiren teknik bir boyuta sahiptir. Hukukumuzda tapu siciline güven ilkesi asıldır; ancak bu ilke, muvazaalı bir işlemin sonuçlarını temizlemek için her zaman yeterli olmaz. Mirasçılar, taşınmazın el değiştirdiğini fark ettikleri anda hukuki stratejilerini aynen iade (tapu iptali) veya bedel tazminatı seçeneklerinden hangisinin mümkün olduğuna göre revize etmek zorundadırlar." },
      { t: "p", v: "Eğer taşınmaz üçüncü bir kişiye devredilmişse, davanın akıbeti tamamen bu yeni alıcının iyiniyetli olup olmadığına bağlıdır. Taşınmazı devralan kişi, eğer muris ile ilk alıcı arasındaki danışıklı işlemi biliyorsa veya bilebilecek durumdaysa, mülkiyet hakkı korunmaz. Ancak piyasa koşullarında, muvazaadan habersiz bir şekilde tapu kaydına güvenerek taşınmazı satın alan kişinin hakkı hukuk düzeni tarafından kutsal kabul edilir. Bu noktada mirasçıların, taşınmazın mülkiyetini geri alıp alamayacakları veya bunun yerine nakdi bir bedel talep edip edemeyecekleri sorusu gündeme gelir." },
      { t: "h3", v: "İyiniyetli Üçüncü Kişilerin Korunması (TMK 1023)" },
      { t: "p", v: "Türk Medeni Kanunu'nun temel direklerinden biri olan TMK m. 1023, tapu kütüğündeki tescile iyiniyetle dayanarak mülkiyet veya bir başka ayni hak kazanan üçüncü kişinin bu kazanımının geçerli olacağını hükme bağlar. *Muris muvaazası* özelinde bu madde, yolsuz tescil ile mülkiyeti alan kişiden taşınmazı devralan iyiniyetli üçüncü kişileri koruma kalkanı altına alır. Eğer üçüncü kişi, taşınmazı satın alırken murisin diğer mirasçılardan mal kaçırdığını bilmiyorsa ve bilmesi de kendisinden beklenemiyorsa (örneğin taraflarla hiçbir akrabalık veya iş ilişkisi yoksa), artık o kişiye karşı açılacak tapu iptal ve tescil davası reddedilecektir." },
      { t: "p", v: "İyiniyetin varlığı, taşınmazın satın alınma tarihindeki koşullara göre belirlenir. Yargıtay, iyiniyet iddiasını incelerken alıcının; taşınmazın gerçek değerini ödeyip ödemediğine, taraflar arasındaki yakınlık derecesine ve tapu sicili dışındaki emarelere bakıp bakmadığına dikkat eder. Eğer üçüncü kişi iyiniyetliyse, mirasçılar için aynen iade yolu kapanmış olur. Bu aşamada mülkiyet hakkı, tapu sicilinin açıklığı ve güvenilirliği ilkesi gereği korunur ve tapu kaydı hukuken temizlenmiş kabul edilir. Ancak bu durum, mirasçıların hak arama özgürlüğünün sona erdiği anlamına gelmez; sadece hakkın yönü mülkiyetten tazminata evrilir." },
      { t: "h3", v: "Kötüniyetli Devirlerde Bedel Tazminatı" },
      { t: "p", v: "Eğer taşınmazı devralan üçüncü kişi, muvazaalı işlemi biliyorsa (örneğin murisin diğer oğluysa, yakın bir dostuysa, murisin çalışanıysa veya danışıklı işlemi kurgulayan taraflardan biriyse), TMK m. 1024 uyarınca bu kişinin iyiniyeti korunmaz ve tapu kaydı ona karşı da iptal edilebilir. Ancak üçüncü kişinin iyiniyetli olduğu ve tapu iptalinin mümkün olmadığı durumlarda mirasçılar, muvazaalı işlemi yapan asıl davalıya (murisin malı ilk devrettiği kişiye) karşı bedel tazminatı davası açarlar. Bu dava, mülkiyetin geri getirilmesi imkansızlaştığı için, mirasçının uğradığı ekonomik kaybın nakden telafi edilmesini amaçlar." },
      { t: "p", v: "Bedel tazminatında hesaplama, taşınmazın devir tarihindeki bedeli üzerinden değil, dava tarihindeki güncel rayiç değeri üzerinden yapılır. Mirasçı, kendi miras payı oranında, taşınmazın güncel piyasa değerinden hissesine düşen paranın kendisine ödenmesini talep eder. Yargıtay'ın yerleşik kararları uyarınca, kötüniyetli ilk elin (muvazaalı alıcının) malı elden çıkarmış olması onu sorumluluktan kurtarmaz; aksine sebepsiz zenginleşme ve haksız fiil hükümleri uyarınca mirasçıların zararını tazmin etmekle yükümlü kılınır. Bu hukuki yol, mülkiyetin iyiniyetli kişiye geçmesiyle oluşan mağduriyeti gidermek için en etkili ispat ve tahsilat mekanizmasıdır." },
      { t: "h2", v: "Görevli ve Yetkili Mahkeme Hangisidir?" },
      { t: "p", v: "*Muris muvaazası* davasında usul hukuku kuralları, en az davanın esası kadar kritiktir. Yanlış mahkemede açılan bir dava, aylar hatta yıllar süren bir yargılamanın sonunda görevsizlik veya yetkisizlik kararıyla sonuçlanarak ciddi hak kayıplarına ve ek yargılama giderlerine yol açabilir. Bu dava türü, doğası gereği malvarlığı haklarına ilişkin olduğu ve bir taşınmazın aynını (mülkiyetini) ilgilendirdiği için, 6100 sayılı Hukuk Muhakemeleri Kanunu (HMK) hükümlerine göre belirlenen özel ve kesin kurallara tabidir." },
      { t: "p", v: "Mahkemenin belirlenmesinde uyuşmazlığın değeri ne olursa olsun, yasa koyucu tarafından belirlenmiş sabit bir görevli mahkeme tayin edilmiştir. Ayrıca, taşınmaz mülkiyetine ilişkin uyuşmazlıklarda kamu düzenini ilgilendiren kesin bir yetki kuralı mevcuttur. Bu nedenle davacı mirasçıların, dilekçelerini hazırlarken davanın açılacağı yargı çevresini ve mahkeme sıfatını hatasız belirlemeleri hukuki sürecin selameti açısından bir zorunluluktur." },
      { t: "h3", v: "Asliye Hukuk Mahkemeleri ve Taşınmazın Bulunduğu Yer Yetkisi" },
      { t: "p", v: "Muris muvaazası nedenine dayalı tapu iptal ve tescil davalarında görevli mahkeme Asliye Hukuk Mahkemesi'dir. HMK m. 2 uyarınca, dava konusunun değer ve miktarına bakılmaksızın malvarlığı haklarına ilişkin tüm davalarda, aksine bir düzenleme bulunmadığı sürece Asliye Hukuk Mahkemeleri genel görevlidir. Miras hukukundan doğan bazı uyuşmazlıklar (örneğin veraset ilamı alınması veya tereke tespiti) Sulh Hukuk Mahkemelerinde görülse de, işin içine tapu iptali ve muvazaa iddiası girdiğinde mutlak görevli mercii Asliye Hukuk Mahkemesidir." },
      { t: "p", v: "Yetkili mahkeme hususunda ise hukukumuzda oldukça sert bir kural uygulanır: Taşınmazın aynına (mülkiyetine) ilişkin davalarda kesin yetki kuralı geçerlidir. HMK m. 12/1 uyarınca; taşınmaz üzerindeki ayni hakka ilişkin davalar, taşınmazın bulunduğu yer mahkemesinde açılmak zorundadır. Bu yetki kuralı kamu düzeninden olup, taraflar aralarında anlaşarak (yetki sözleşmesi ile) davayı başka bir ildeki mahkemeye taşıyamazlar. Hakim, davanın yetkili yerde açılıp açılmadığını davanın her aşamasında re'sen (kendiliğinden) incelemekle yükümlüdür." },
      { t: "p", v: "Eğer dava konusu birden fazla taşınmaz ise ve bu taşınmazlar farklı illerde bulunuyorsa, HMK m. 12/3 uyarınca dava, taşınmazlardan birinin bulunduğu yer mahkemesinde açılabilir. Ancak bu durumda, taşınmazların hepsinin aynı muris tarafından aynı muvazaalı plan dahilinde devredilmiş olması ispat kolaylığı sağlar. Özetle; Ankara'da oturan bir mirasçı, vefat eden babasının Malatya'daki evi için dava açacaksa, davayı mutlaka Malatya Asliye Hukuk Mahkemelerinde ikame etmelidir." },
    ],
    faq: [
      { question: "Babam sağlığında evi kardeşime sattı, dava açabilir miyim?", answer: "Evet, açabilirsiniz. Babanızın sağlığında yaptığı satış işlemi, eğer diğer mirasçılardan mal kaçırmak amacıyla yapılmış bir danışıklı (muvazaalı) işlem ise, babanızın vefatından sonra bu işlemin iptali için dava açma hakkınız doğar. Bu tür durumlarda mahkeme; kardeşinizin o tarihteki alım gücünü, babanızın paraya ihtiyacı olup olmadığını ve paranın banka üzerinden ödenip ödenmediğini inceleyerek, işlemin gerçek bir satış mı yoksa gizli bir bağış mı olduğuna karar verir." },
      { question: "Muris muvaazası davası ne kadar sürer?", answer: "Muris muvaazası davaları, ispat süreci titizlik gerektiren kapsamlı dosyalardır. Yerel mahkeme aşaması, delillerin toplanması (tapu kayıtları, banka ekstreleri, tanık dinletilmesi) ve bilirkişi incelemeleriyle birlikte ortalama 1.5 ila 3 yıl arasında sürmektedir. Ancak davanın istinaf (Bölge Adliye Mahkemesi) ve Yargıtay süreçleri de göz önüne alındığında, kesin bir sonuca ulaşmak 4-6 yılı bulabilmektedir. Davanın bir avukat aracılığıyla takip edilmesi, usuli hatalardan kaynaklanan gecikmeleri önlemek adına kritiktir." },
      { question: "Tapu iptal davası açmak için mirasın açılması (ölüm) şart mı?", answer: "Evet, bu davanın açılabilmesi için mirasbırakanın vefat etmiş olması hukuki bir zorunluluktur. Mirasbırakan hayattayken, mirasçıların gelecekteki miras haklarını korumak amacıyla muvazaa davası açma yetkileri yoktur. Çünkü hukukumuza göre hiç kimse hayattayken kendi malvarlığı üzerindeki tasarrufları nedeniyle (vesayet altına alınmadığı sürece) mirasçılarına karşı sorumlu tutulamaz. Dava açma hakkı, mirasın açıldığı yani ölümün gerçekleştiği an doğar." },
      { question: "Davayı kazanırsam tapu doğrudan adıma mı geçer?", answer: "Bu durum, dava dilekçesinde sunduğunuz talebe göre değişir. Eğer davayı kendi miras payınız oranında iptal ve tescil istemli açtıysanız, mahkeme taşınmazın tamamını değil, sadece sizin miras hissenize düşen kısmını iptal ederek adınıza tescil eder. Geri kalan kısım, davalı üzerinde kalmaya devam eder. Ancak davanın terekeye iade şeklinde açılması veya diğer mirasçıların da davaya katılması durumunda tapu kaydı eski haline (murisin adına) döndürülebilir veya tüm mirasçılar adına elbirliği mülkiyeti şeklinde tescil edilebilir." },
      { question: "Muris muvaazası davasında avukat tutmak zorunlu mu?", answer: "Türk hukuk sisteminde, ceza davalarındaki bazı istisnalar dışında (Müdafii eşliğinde ifade alma zorunluluğu), şahısların avukat tutma zorunluluğu bulunmamaktadır; davayı kendiniz de açabilirsiniz. Ancak muris muvaazası davaları, ispat yükü ve teknik usul kuralları bakımından en zorlu dava türlerinden biridir. Yanlış bir delil sunulması, tanıkların yanlış yönlendirilmesi veya sürelere uyulmaması davanın reddine ve yüksek yargılama giderlerine yol açabilir. Bu nedenle, davanın alanında yetkin bir miras avukatı ile yürütülmesi hak kaybına uğramamanız için şiddetle tavsiye edilir." },
    ],
  },
  {
    slug: "bosanma-davasinda-feragat-ve-hukuki-sonuclari",
    title: "Boşanma Davasında Feragat ve Hukuki Sonuçları",
    summary:
      "Boşanma davasından feragat nedir, şartları nelerdir, feragatin hukuki sonuçları ve Yargıtay içtihatları. Feragatten dönme, tazminat ve nafaka etkisi, mahkeme masrafları.",
    category: "Aile Hukuku",
    categorySlug: "aile-hukuku",
    authorSlug: "ismail-cavus",
    date: "2026-02-09",
    readTime: "12 dk",
    seoTitle: "Boşanma Davasında Feragat ve Hukuki Sonuçları | YasalHaklarınız",
    seoDescription:
      "Boşanma davasından feragat nedir? HMK 307–312, feragatin şartları, affetme kuralı, tazminat ve nafaka etkisi. Yargıtay kararlarıyla feragatten dönme ve masraflar.",
    content: [
      "Boşanma davasından feragat, davacının açtığı davadan ve taleplerinden tek taraflı, kayıtsız şartsız vazgeçmesidir. Feragatin şartları, hukuki sonuçları ve Yargıtay içtihatları.",
    ],
    contentBlocks: [
      { t: "h2", v: "Boşanma Davasından Feragat Nedir?" },
      {
        t: "p",
        v: "*Boşanma davasından feragat*, boşanma davası açan eşin (davacının), mahkemeye sunacağı yazılı bir dilekçe veya duruşma esnasında tutanağa geçirilecek sözlü bir beyan ile, açmış olduğu davadan ve dava konusu taleplerinden tek taraflı, kayıtsız ve şartsız olarak vazgeçmesi işlemidir. 6100 sayılı Hukuk Muhakemeleri Kanunu (HMK) Madde 307 uyarınca feragat, davacının talep sonucundan kısmen veya tamamen vazgeçmesidir ve yapıldığı andan itibaren davanın esastan reddine dair kesin hüküm sonuçları doğurur. Kısacası feragat, mahkemeden istenen hukuki korumadan kendi rızasıyla bütünüyle geri adım atmaktır.",
      },
      {
        t: "p",
        v: "Türk hukuk sisteminde feragat, mahiyeti itibarıyla bozucu yenilik doğuran tek taraflı bir hukuki işlemdir. Bu tanımın uygulamadaki karşılığı oldukça keskindir: Feragat işleminin geçerli olabilmesi ve hukuki sonuçlarını doğurabilmesi için karşı tarafın (davalının) rızasına, kabulüne veya aile mahkemesi hakiminin onayına kesinlikle ihtiyaç yoktur. Davacı eş, feragat iradesini kanuna uygun şekilde mahkemeye ulaştırdığı saniye işlem tamamlanır ve dava esastan sona erer.",
      },
      {
        t: "p",
        v: "Bir boşanma davasında feragatin usulüne uygun şekilde yapılabilmesi ve geçerli sayılabilmesi için kanunun aradığı çok katı kurallar ve şekil şartları bulunmaktadır. Hukuki sürecin hatasız yürümesi adına bu şartları şu şekilde sıralayabiliriz:",
      },
      {
        t: "ul",
        v: [
          "*Şarta Bağlılık Yasağı:* HMK Madde 309/4 gereğince feragat, kayıtsız ve şartsız yapılmalıdır. Aile mahkemesine sunulan dilekçede, \"Eşim bana ait olan ziynet eşyalarını iade ederse davadan vazgeçiyorum\", \"Müşterek çocuğun velayetini bana bırakması şartıyla feragat ediyorum\" veya \"Bir daha bana şiddet uygulamayacağına dair söz verdiği için davadan feragat ediyorum\" gibi şarta bağlanmış beyanlar hukuken geçersizdir. Mahkeme, şarta bağlı bir feragat dilekçesine dayanarak davanın reddine karar veremez; yargılamaya devam etmek zorundadır.",
          "*Şekil Şartı:* Feragat, davanın görüldüğü mahkemeye verilecek ıslak imzalı bir fiziki dilekçe ile yapılabileceği gibi UYAP Vatandaş Portalı üzerinden e-imza veya mobil imza kullanılarak da dosyaya gönderilebilir. Eğer duruşma esnasında taraflar barışmışsa, davacı sözlü olarak feragat ettiğini beyan edebilir; ancak bu beyanın mutlaka duruşma tutanağına geçirilmesi ve altının davacı tarafından bizzat imzalanması emredici bir kuraldır.",
          "*Avukatın Özel Yetkisi:* Davayı davacı asil değil de vekili (avukatı) takip ediyorsa, avukatın müvekkili adına davadan feragat edebilmesi için vekaletnamesinde feragat etme yetkisini barındıran özel yetki bulunması zorunludur. Genel dava vekaletnamesi ile bir avukat müvekkilinin boşanma davasından feragat edemez; ederse bu işlem müvekkili bağlamaz.",
        ],
      },
      { t: "h3", v: "Davayı Geri Alma ile Karıştırılmamalıdır" },
      {
        t: "p",
        v: "Hukuk dilinde ve vatandaşlar arasında davadan vazgeçme ifadesi sıklıkla yanlış kullanılır. HMK sistematiğinde *boşanma davasından feragat* (HMK m. 307) ile davayı geri alma (HMK m. 123) tamamen farklı hukuki müesseselerdir. Feragat, hakkın özünden vazgeçmektir ve yukarıda belirttiğimiz gibi geçmiş olayları affetme sonucunu doğurur; davalının rızası aranmaz. Davayı geri alma ise, mevcut davanın o an için görülmesinden vazgeçmektir; ancak hakkın özü saklı kalır. Davayı geri alabilmek için davalının açık rızası şarttır. Davasını usulüne uygun şekilde geri alan eş, ileride aynı olaylara ve delillere dayanarak yeniden dava açma hakkını korur. Bu ince hukuki ayrım, vatandaşların hak kaybına uğramaması adına hayati derecede önemlidir.",
      },
      { t: "h2", v: "Feragatten Rücu (Dönme) Mümkün Müdür?" },
      {
        t: "p",
        v: "Vatandaşların en çok tereddüt yaşadığı noktalardan biri de dilekçeyi verdim ama pişman oldum, geri alabilir miyim? sorusudur. HMK Madde 311 gayet açıktır: Feragat, kesin hüküm gibi hukuki sonuç doğurur ve kural olarak feragatten dönülemez (rücu edilemez). Feragat dilekçesi mahkeme kayıtlarına girdiği an dava esastan bitmiş sayılır, hakimin ayrıca bir karar vermesi veya kararın kesinleşme şerhi alması beklenmez. Ancak kanun koyucu bu sert kurala tek bir istisna getirmiştir: İrade bozukluğu halleri. Eğer davacı eş; ağır bir tehdit (ikrah), hile veya esaslı bir hata altında feragat dilekçesi imzalamaya zorlanmışsa, Borçlar Kanunu'nun irade sakatlığına ilişkin hükümlerine dayanarak, feragatin iptali için aynı dosya içerisinde veya ayrı bir dava açarak bu durumu ispatlamak şartıyla süreci geri çevirebilir. Fakat bu durumun ispat yükü oldukça ağırdır ve somut delillerle; örneğin silahla tehdit edildiğine dair kamera kaydı veya tanık beyanı ile desteklenmesi şarttır. Sadece \"o anki psikolojim iyi değildi\" veya \"barışırız sanmıştım ama barışmadık\" şeklindeki beyanlar, irade sakatlığı kapsamında değerlendirilmez ve feragat işlemini geçersiz kılmaz.",
      },
      { t: "h2", v: "Boşanma Davasında Feragatin Şartları Nelerdir?" },
      {
        t: "p",
        v: "Boşanma davasında feragatin hukuken geçerli olabilmesi ve davanın reddi sonucunu doğurabilmesi için Hukuk Muhakemeleri Kanunu (HMK) madde 307 ve devamında düzenlenen usul kurallarına eksiksiz uyulması şarttır. Bu şartlar; feragat iradesinin mahkemeye yazılı dilekçe veya duruşmada tutanağa geçirilecek sözlü beyanla açık ve net olarak bildirilmesi, beyanın kayıtsız ve şartsız olması, işlemin davanın açıldığı tarihten kararın kesinleşmesine kadar olan zaman diliminde yapılması ve davayı avukat yürütüyorsa vekaletnamede muhakkak özel feragat yetkisinin bulunmasıdır. Bu yasal şartlardan herhangi birini taşımayan feragat beyanı, mahkeme nezdinde yok hükmündedir ve boşanma yargılaması kaldığı yerden devam eder.",
      },
      {
        t: "p",
        v: "Hukuki sürecin ciddiyeti göz önüne alındığında, bu şartların her birinin kendi içinde barındırdığı istisnaları ve Yargıtay uygulamalarını derinlemesine incelemek hak kayıplarını önlemek adına hayati önem taşır.",
      },
      { t: "h3", v: "Feragat Ne Zamana Kadar Yapılabilir?" },
      {
        t: "p",
        v: "*Boşanma davasında feragat*, vatandaşlar tarafından en çok karıştırılan usul kurallarından biridir. HMK Madde 310, feragatin zamanını çok net bir sınırla çizmiştir: Feragat ve kabul, hüküm kesinleşinceye kadar her zaman yapılabilir. Bu kuralın uygulamadaki yansımalarını yargılama aşamalarına göre şu şekilde detaylandırabiliriz:",
      },
      {
        t: "ul",
        v: [
          "*Yerel Mahkeme (İlk Derece) Aşamasında:* Dava dilekçesinin mahkemeye sunulduğu an ile Aile Mahkemesi hakiminin gerekçeli kararı yazıp taraflara tebliğ ettiği sürece kadar feragat edilebilir. Bu aşamada verilen dilekçe üzerine mahkeme, davanın feragat nedeniyle reddine karar verir.",
          "*İstinaf ve Temyiz (Yargıtay) Aşamasında Feragat:* Boşanma kararı verilmiş ancak taraflardan biri karara itiraz ederek dosyayı Bölge Adliye Mahkemesi'ne (İstinaf) veya Yargıtay'a taşımış olabilir. Dosya üst mahkemedeyken eşler barışırsa, karar henüz kesinleşmediği için davacı davasından feragat edebilir.",
          "*Üst Mahkeme Aşamasındaki Prosedür (HMK m. 310/2-3):* Yakın zamanda usul hukukumuza giren ve yargılamayı hızlandıran kurala göre; dosya İstinaf veya Yargıtay incelemesindeyken feragat dilekçesi verilirse, üst mahkeme artık dosyayı incelemez. Üst mahkeme, feragat hakkında bir ek karar verilmek üzere dosyayı doğrudan kararı veren ilk derece mahkemesine geri gönderir. Yerel mahkeme de önceki verdiği boşanma kararını kaldırarak feragat nedeniyle davanın reddine karar verir.",
          "*Kesinleşme Şerhi Sonrası Feragat Yasağı:* Aile Mahkemesi kararı vermiş, taraflar itiraz etmemiş (veya üst mahkeme yolları tükenmiş) ve karara kesinleşme şerhi düşülmüşse, artık *boşanma davasından feragat* edilemez. Çünkü ortada hukuken devam eden bir dava kalmamış, evlilik birliği resmen ve kesin olarak sona ermiştir. Bu aşamadan sonra barışan eşlerin tek hukuki yolu, belediyeye başvurarak yeniden evlenmektir.",
        ],
      },
      { t: "h3", v: "Karşı Tarafın (Davalının) Kabulü Gerekir mi?" },
      {
        t: "p",
        v: "Boşanma davasından feragat, usul hukuku dogmatiğinde tek taraflı ve muhatabına ulaşmasıyla sonuç doğuran bir irade beyanıdır. HMK Madde 309/2'nin emredici hükmü gereği; feragatin geçerliliği, karşı tarafın davalının veya mahkemenin kabulüne bağlı değildir.",
      },
      {
        t: "p",
        v: "Yargıtay uygulaması pratiğinde ise bir davacı feragat dilekçesini Aile Mahkemesi kalemine sunduğu saniye işlem tamamlanır. Davalı eş mahkemeye gelip, \"Ben feragati kabul etmiyorum, eşim yalan söylüyor, bu dava devam etsin, benim haklılığım ortaya çıksın\" diyemez. Davalının rızasının veya itirazının feragat işlemi üzerinde hiçbir hukuki geçerliliği veya durdurucu etkisi yoktur. Hakim, davalının onayını aramaksızın doğrudan feragat nedeniyle davanın reddi kararı vermek zorundadır. Davalının kabulüne ihtiyaç duyulmaması kuralının uygulamada çok tehlikeli bir istisnası vardır: Karşı Dava, buna göre;",
      },
      {
        t: "ul",
        v: [
          "Eğer davalı eş, size karşı süresi içinde bir karşı boşanma davası açmışsa, sizin kendi davanızdan feragat etmeniz sadece sizin açtığınız davayı düşürür.",
          "Karşı tarafın davası (eğer o da feragat etmezse) aynen devam eder.",
          "Bu durumda kendi davanızdan vazgeçtiğiniz için iddialarınızı geri çekmiş ve eski olayları affetmiş sayılırken, davalı eşin size yönelttiği karşı dava üzerinden yargılanmaya devam edersiniz. Bu tablo, stratejik olarak bir avukat eşliğinde yönetilmediğinde davacı için telafisi güç maddi ve manevi tazminat yükümlülükleri doğurabilir.",
        ],
      },
      { t: "h3", v: "Şarta Bağlı Feragat Geçerli Midir?" },
      {
        t: "p",
        v: "Hukuk Muhakemeleri Kanunu Madde 309/4, şarta bağlı feragati kesin bir dille yasaklamıştır: Feragat ve kabul, kayıtsız ve şartsız olmalıdır. Boşanma davaları, yüksek duygusal gerilimin olduğu ve eşlerin birbirleriyle kıyasıya pazarlık yaptığı süreçlerdir. Vatandaşlar genellikle haklarını garanti altına almak adına mahkemeye \"Eğer şu şartlar yerine gelirse davamdan vazgeçerim\" şeklinde dilekçeler sunma eğilimindedir. Ancak bu durum hukuken bir hata olarak nitelendirilir.",
      },
      {
        t: "p",
        v: "Hakim, şarta bağlanan konuları (velayet, tazminat) yerine getirmeye zorlayacak bir ara karar da kuramaz. Şarta bağlı feragat dilekçesi dosyada hiç yokmuş gibi yargılamaya devam edilir. Eşler arasında mal paylaşımı, nafaka veya tazminat gibi konularda bir uzlaşma var ise; bunun yolu şarta bağlı feragat dilekçesi vermek değil, şartların açıkça yazıldığı bir Anlaşmalı Boşanma Protokolü hazırlayarak davayı anlaşmalı boşanmaya çevirmektir.",
      },
      { t: "h2", v: "Boşanma Davasından Feragat Etmenin Hukuki Sonuçları" },
      {
        t: "p",
        v: "*Boşanma davasından feragat sonuçları*; açılan davanın esastan reddedilmesi, feragat eden eşin dava dilekçesinde karşı tarafa yüklediği tüm kusurlu hareketleri (aldatma, şiddet, hakaret vb.) hukuken affetmiş veya hoşgörüyle karşılamış sayılması ve davasından vazgeçen tarafın tüm yargılama giderleri ile karşı tarafın avukatlık ücretini ödemekle yükümlü tutulmasıdır. Feragat işlemi kesin hüküm niteliğinde olduğundan, mahkemece davanın reddine karar verilir ve taraflar aynı olaylara, aynı delillere dayanarak yeniden boşanma davası açamaz veya bu geçmiş olaylar üzerinden maddi ve manevi tazminat talebinde bulunamazlar.",
      },
      {
        t: "p",
        v: "Bir boşanma davasından feragat etmek, adliye koridorlarında sıradan bir dilekçe vermek değil, evliliğin hukuki zeminini tamamen sıfırlamak anlamına gelir. Hukuk Muhakemeleri Kanunu (HMK) ve Türk Medeni Kanunu (TMK) çerçevesinde, bu tek taraflı irade beyanının doğurduğu sonuçlar telafisi imkansız hak kayıplarına yol açabilir. Bu nedenle, feragatin sonuçlarının her bir alt başlıkta derinlemesine incelenmesi şarttır.",
      },
      { t: "h3", v: "Yargıtay'ın \"Affetme ve Hoşgörü\" Kuralı" },
      {
        t: "p",
        v: "Boşanma davasından feragatin en yıkıcı ve en kritik hukuki sonucu, Yargıtay'ın yerleşik içtihatlarıyla şekillenen affetme ve hoşgörü kuralıdır. Yargıtay 2. Hukuk Dairesi ve Hukuk Genel Kurulu kararlarında istikrarlı bir şekilde vurgulandığı üzere; davasından feragat eden eş, o davaya konu ettiği ve evlilik birliğinin temelinden sarsılmasına neden olan tüm vakıaları affetmiş, en azından hoşgörü ile karşılamış kabul edilir. Türk hukuk sisteminde, affedilen veya hoşgörülen olaylara dayanılarak karşı tarafa kusur atfedilemez ve boşanma kararı verilemez.",
      },
      {
        t: "p",
        v: "Diyelim ki eşinizin size fiziksel şiddet uyguladığını ve aldatma (zina) eyleminde bulunduğunu ispatlayan kesin delillerle (darp raporu, otel kayıtları, mesajlar) çok güçlü bir boşanma davası açtınız. Dava devam ederken eşiniz pişmanlık gösterdi, ortak hayatın yeniden kurulması adına sizden bir şans daha istedi ve siz de mahkemeye feragat dilekçesi sundunuz. Yargıtay içtihatlarına göre bu imza atıldığı an, geçmişteki o şiddet ve aldatma olaylarının hukuki geçerliliği sıfırlanır.",
      },
      {
        t: "ul",
        v: [
          "*Eski Olaylara Dayanma Yasağı:* Eğer bir ay sonra eşiniz tekrar eski davranışlarına dönerse ve siz yeniden boşanma davası açmak zorunda kalırsanız, feragat ettiğiniz önceki davadaki aldatma ve şiddet olaylarını yeni davanızda gerekçe olarak gösteremezsiniz. Mahkeme, o olayları affedilmiş olaylar listesine alır ve kusur tespiti yaparken dikkate almaz.",
          "*Yeni Vakıalara Dayanarak Dava Açma Hakkı:* Feragat ettikten sonra yeniden boşanma davası açmanın tek yolu, feragat tarihinden sonra gerçekleşen yeni vakıalara dayanmaktır. Feragatten sonra eşiniz size hakaret ederse veya evi terk ederse, yalnızca bu yeni eylemler üzerinden evlilik birliğinin temelinden sarsılması (TMK 166) nedenine dayalı dava açabilirsiniz.",
        ],
      },
      {
        t: "p",
        v: "Örnek bir somut olaya göre; Davacı kadın, kocasının aşırı alkol alıp evi geçindirmemesi sebebiyle dava açmış, sonrasında kocasının tedavi olacağı sözü üzerine davasından feragat etmiştir. Koca tedavi olmaz ve aynı davranışlara devam ederse; kadın açacağı ikinci davada yalnızca feragat tarihinden sonraki alkol ve evi ihmal eylemlerini ispatlamak zorundadır. Önceki olaylar kusur incelemesinde erimiştir.",
      },
      { t: "h3", v: "Tazminat, Nafaka ve Velayet Taleplerine Etkisi" },
      {
        t: "p",
        v: "*Boşanma davasından feragat*, sadece boşanma talebini değil, boşanmanın ferisi niteliğindeki tüm hukuki talepleri de doğrudan ve geri dönülemez biçimde etkiler.",
      },
      {
        t: "ul",
        v: [
          "*Maddi ve Manevi Tazminat Hakları:* TMK madde 174 uyarınca maddi ve manevi tazminat talep edilebilmesi için, karşı tarafın kusurlu olması şarttır. Feragat işlemiyle birlikte geçmişteki eylemler affedilmiş sayıldığından, ortada hukuken tazminat gerektirecek bir kusur kalmaz. Dolayısıyla davasından vazgeçen taraf, feragat ettiği dosyadaki olaylara dayanarak hiçbir şekilde maddi veya manevi tazminat alamaz.",
          "*Tedbir Nafakası ve Yoksulluk Nafakası:* Dava açıldığı an, eşin ve çocukların geçimi için hakimin resen hükmettiği veya talep üzerine verilen tedbir nafakası, feragat nedeniyle davanın reddedilip kararın kesinleştiği tarihte kendiliğinden ortadan kalkar. Aynı şekilde, boşanma yüzünden yoksulluğa düşecek eşin talep ettiği yoksulluk nafakası da boşanma gerçekleşmediği için reddedilir.",
          "*Müşterek Çocuğun Velayeti:* Evlilik birliği hukuken devam ettiğine göre, feragat kararıyla birlikte eşlerin çocuklar üzerindeki ortak velayet hakkı aynen sürmeye devam eder. Mahkeme tarafından dava süresince geçici velayet kararı verilmişse bile, davanın feragatle reddedilmesi sonucu bu geçici kararlar hükümsüz kalır ve anne-baba çocuğun bakım ve gözetimini ortaklaşa yürütmekle yükümlü olmaya geri döner.",
        ],
      },
      { t: "h3", v: "Mahkeme Masrafları ve Avukatlık Ücretini Kim Öder?" },
      {
        t: "p",
        v: "Hukuk davalarında maliyetlerin kime yükleneceği, davada haksız çıkma prensibine göre belirlenir. HMK Madde 312 çok net bir kural koyar: Feragat veya kabul beyanında bulunan taraf, davada aleyhine hüküm verilmiş gibi yargılama giderlerini ödemeye mahkûm edilir.",
      },
      {
        t: "p",
        v: "Bu emredici kuralın boşanma davalarındaki pratik sonuçları şunlardır:",
      },
      {
        t: "ul",
        v: [
          "*Yargılama Giderleri Davacıda Kalır:* Dava açarken yatırılan başvurma harcı, peşin harç, bilirkişi ücretleri, tebligat giderleri ve pedagog için ödenen tüm masraflar feragat eden tarafın üzerinde kalır. Devletten veya karşı taraftan bu masrafların iadesi talep edilemez.",
          "*Karşı Taraf Vekalet Ücreti:* Eğer davalı eş, dosyada kendisini bir avukat ile temsil ettirmişse, en ağır mali yük burada ortaya çıkar. Feragat eden taraf, sanki davayı esastan kaybetmiş gibi, davalı eşin avukatına maktu vekalet ücretini ödemek zorundadır. Mahkeme bu ücreti kararında resen hüküm altına alır.",
          "Eğer taraflar dışarıda barışmış ve aralarında anlaştıkları için davacı feragat ediyorsa; davalı tarafın mahkemeye sunacağı bir dilekçe ile \"Yargılama gideri ve vekalet ücreti talebim yoktur\" şeklinde açık beyanda bulunması mümkündür. Davalı eş bu hakkından açıkça vazgeçerse, mahkeme feragat eden davacı aleyhine vekalet ücretine hükmetmez. Ancak böyle bir beyan yoksa, hakim kanun gereği masrafları ve avukatlık ücretini feragat eden eşe yüklemek zorundadır.",
        ],
      },
    ],
  },
];
