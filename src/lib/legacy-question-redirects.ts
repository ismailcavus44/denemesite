/**
 * Kaldırılan soru-cevap sisteminin eski adresleri → konuya en yakın rehber yazısı.
 * Hem /{kategori}/soru/{slug} hem /soru/{slug} için 308 (kalıcı) yönlendirme üretilir
 * (bkz. next.config.ts). Tabloda olmayan soru adresleri /rehber'e gider.
 */
const MURIS_MUVAZAASI = "/miras-hukuku/rehber/muris-muvazaasi-nedir";
const MIRAS_HUKUKU = "/miras-hukuku/rehber/miras-hukuku-nedir-kapsamli-rehber";
const MIRAS_PAYLASIMI = "/miras-hukuku/rehber/miras-nasil-bolunur-miras-paylasim-oranlari";
const ORTAKLIGIN_GIDERILMESI = "/miras-hukuku/rehber/izalei-suyu-ortakligin-giderilmesi-davasi-nedir";
const MIRASI_OGRENME = "/miras-hukuku/rehber/babamdan-kalan-mirasi-nasil-ogrenebilirim";
const REDDI_MIRAS = "/miras-hukuku/rehber/reddi-miras-nedir-ve-temel-sartlari-nelerdir";
const TENKIS = "/miras-hukuku/rehber/tenkis-davasi-nedir";
const SAKLI_PAY = "/miras-hukuku/rehber/baba-olmeden-mirasini-istedigi-evladina-verebilir-mi-hukukta-sakli-pay-ve-esin-haklari";
const ISKAT = "/miras-hukuku/rehber/mirastan-cikarma-iskat-nedir";
const MIRASTAN_YOKSUNLUK = "/miras-hukuku/rehber/kimler-mirasci-olamaz-mirastan-yoksunluk";
const ISCI_HAKLARI = "/is-hukuku/rehber/isten-cikarilan-iscinin-haklari-nelerdir";
const BOSANMA = "/aile-hukuku/rehber/bosanma-davasi-nasil-acilir-detayli-rehber";
const BOSANMA_FERAGAT = "/aile-hukuku/rehber/bosanma-davasinda-feragat-ve-hukuki-sonuclari";
const SANAL_OFIS = "/diger/rehber/sirket-kurulusunda-sanal-ofis-rehberi";
export const LEGACY_QUESTION_FALLBACK = "/rehber";

export const LEGACY_QUESTION_REDIRECTS: Record<string, string> = {
  // aile-hukuku
  "annem-mallari-abime-devretti-abim-geri-vermiyor": MURIS_MUVAZAASI,
  "evlenmeden-onceki-evde-kadin-hakki": BOSANMA,
  "feragat-sonrasi-bosanma-davasi-yeniden-acilabilir-mi": BOSANMA_FERAGAT,
  "gurcistan-dogumlu-yetiskin-cocuk-nufus": LEGACY_QUESTION_FALLBACK,
  "ozbekistan-evliligi-turkiyede-tescil-sorunu": LEGACY_QUESTION_FALLBACK,
  // diger
  "alt-komsunun-tavana-vurmasi-suc-mudur": LEGACY_QUESTION_FALLBACK,
  "ayipli-mal-degisiminde-model-yili-farki": LEGACY_QUESTION_FALLBACK,
  "ayni-isimli-ogula-tapu-tespiti-davasi": MIRAS_HUKUKU,
  "babaannemin-maas-kartini-amcam-vermiyor": LEGACY_QUESTION_FALLBACK,
  "engelli-cocugun-aracini-geri-alma": LEGACY_QUESTION_FALLBACK,
  "khk-ihrac-memur-emekli-ikramiyesi": LEGACY_QUESTION_FALLBACK,
  "komsu-dogalgaz-yakmiyor-sikayet": LEGACY_QUESTION_FALLBACK,
  "sanal-ofis-kullanmak-yasal-mi": SANAL_OFIS,
  // gayrimenkul-hukuku
  "aile-konutu-nedeniyle-tapu-iptali-magduriyeti": LEGACY_QUESTION_FALLBACK,
  "annemin-arsasina-kardesim-ev-yapiyor": ORTAKLIGIN_GIDERILMESI,
  "babadan-devralinan-tapulu-evi-satmak": MURIS_MUVAZAASI,
  "babamin-parasiyla-alinan-arsayi-geri-alma": MURIS_MUVAZAASI,
  "baska-sehirdeki-miras-davasina-katilma": MIRASI_OGRENME,
  "bina-guclendirme-masrafi-odemeyen-komsu": LEGACY_QUESTION_FALLBACK,
  "dedemin-ortak-arsasinda-hisse-satisi": ORTAKLIGIN_GIDERILMESI,
  "esime-ev-devri-ve-satisi-engelleme": LEGACY_QUESTION_FALLBACK,
  "hazine-arazisindeki-evde-miras-uyusmazligi": ORTAKLIGIN_GIDERILMESI,
  "kentsel-donusum-habersiz-hisse-satisi": ORTAKLIGIN_GIDERILMESI,
  "ust-hakki-tapu-degisikligi-itiraz": LEGACY_QUESTION_FALLBACK,
  // icra-hukuku
  "kredi-karti-borcu-taahhudu-ihlal-hapsi": LEGACY_QUESTION_FALLBACK,
  // is-hukuku
  "18-yillik-calisan-isten-cikarma-haklari": ISCI_HAKLARI,
  "ayni-kurumdaki-eslerin-vardiya-sorunu": LEGACY_QUESTION_FALLBACK,
  "engelli-emekli-saglik-nedeniyle-tazminat": ISCI_HAKLARI,
  "market-calisani-mobbing-zorunlu-sube-degisikligi": ISCI_HAKLARI,
  // miras-hukuku
  "abimlere-yapilan-kooperatif-evi-hakki": MURIS_MUVAZAASI,
  "abiye-devredilip-kacirilan-evin-tapusu": MURIS_MUVAZAASI,
  "annemi-kandirip-mirasini-aldilar-ne-yapabilirim": MURIS_MUVAZAASI,
  "baba-evine-cikilan-katin-tapusu": MIRAS_PAYLASIMI,
  "baba-hayattayken-evini-diger-ogluna-yapti": SAKLI_PAY,
  "babadan-kalan-mirasin-kiz-kardeslere-devri": MURIS_MUVAZAASI,
  "babam-mallarini-kardesime-devretti-ne-yapabilirim": MURIS_MUVAZAASI,
  "babam-mallarini-kardeslerime-devretmis": MURIS_MUVAZAASI,
  "babamin-2b-tarlasini-kardeslerim-uzerine-aldi": MURIS_MUVAZAASI,
  "babanin-mirasi-satilip-kardese-verildi": MURIS_MUVAZAASI,
  "bakma-karsiligi-ev-devri-ve-miras-hakki": MURIS_MUVAZAASI,
  "baskiyla-devredilen-sirket-hissesi-ve-miras": MIRAS_HUKUKU,
  "borc-yuzunden-hisseli-evin-satisi": ORTAKLIGIN_GIDERILMESI,
  "cok-hissedarli-miras-ihale-satis-bedeli": ORTAKLIGIN_GIDERILMESI,
  "dededen-kalan-tek-tapu-nasil-paylasilir": ORTAKLIGIN_GIDERILMESI,
  "dolayli-yoldan-mal-kacirma-miras": MURIS_MUVAZAASI,
  "erkek-kardesin-vermedigi-miras-hakkini-alma": MIRAS_PAYLASIMI,
  "esim-mallarini-ilk-esinden-cocuklarina-verdi": TENKIS,
  "esimin-vefatindan-sonra-miras-islemleri-icin-ne-yapmaliyim": MIRASI_OGRENME,
  "evlenip-bosanan-cocugun-miras-hakki": MIRAS_PAYLASIMI,
  "imam-nikahli-anne-baba-miras-davasi": MIRAS_PAYLASIMI,
  "kadastro-tespiti-miras-hakki-itirazi": MURIS_MUVAZAASI,
  "kandirilarak-miras-hakkindan-vazgecmek": MIRAS_HUKUKU,
  "kardesim-iki-evden-pay-aliyor-dava-acabilir-miyim": TENKIS,
  "kendisini-aramayan-kizini-mirastan-men": ISKAT,
  "miras-devlet-satisi-deger-itirazi": ORTAKLIGIN_GIDERILMESI,
  "miras-hakkimi-abim-kandirarak-aldi": MIRAS_HUKUKU,
  "miras-icin-cinayet-anneanne-hakki": MIRASTAN_YOKSUNLUK,
  "mirasta-erkek-cocuklara-ayrimcilik": MURIS_MUVAZAASI,
  "mirasta-müteahhit-anlasmazligi-ve-haklar": ORTAKLIGIN_GIDERILMESI,
  "noter-kagidiyla-miras-payi-engelleme": MIRAS_HUKUKU,
  "olen-amcanin-borcu-hisseli-tapu": REDDI_MIRAS,
  "reddi-miras-sonrasi-devredilen-ev-geri-alinir-mi": REDDI_MIRAS,
  "reddi-miras-sonrasi-tapu-satisi": REDDI_MIRAS,
  "sagliginda-mal-kacirma-ve-miras-haklari": MURIS_MUVAZAASI,
  "tek-kardesin-miras-davasi-acmasi": MIRAS_HUKUKU,
  "uvey-anneye-kayit-ve-miras-kacirma": MURIS_MUVAZAASI,
  "vefat-oncesi-hisse-devri-ve-satis": MURIS_MUVAZAASI,
  "veraset-ilaminda-eksik-mirasci-tapu-duzeltme": MIRASI_OGRENME,
  "vergi-borcu-mirastan-vazgecme": MIRAS_HUKUKU,
  "yeniden-evlenen-esin-miras-hakki": MIRAS_PAYLASIMI,
};
