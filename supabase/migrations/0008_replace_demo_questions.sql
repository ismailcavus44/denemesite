-- Eski demo soruları ve cevaplarını sil
delete from answers where question_id in (
  select id from questions where slug in (
    'annemden-kalan-arsaya-abim-ev-yapti',
    'ortak-tapulu-arsada-izinsiz-ev',
    'hisseli-tarlaya-ev-dava-acabilir-miyim',
    'miras-arsaya-ev-yapti-satmak-istiyor',
    'ortak-tapulu-arsada-ev-yikilir-mi'
  )
);
delete from questions where slug in (
  'annemden-kalan-arsaya-abim-ev-yapti',
  'ortak-tapulu-arsada-izinsiz-ev',
  'hisseli-tarlaya-ev-dava-acabilir-miyim',
  'miras-arsaya-ev-yapti-satmak-istiyor',
  'ortak-tapulu-arsada-ev-yikilir-mi'
);

-- Yeni sorular için kategori
insert into categories (slug, name)
values ('hukuk-rehberi', 'Hukuk Rehberi')
on conflict (slug) do update set name = excluded.name;

-- 20 yeni soru ve cevap
with cat as (
  select id from categories where slug = 'hukuk-rehberi' limit 1
),
qs as (
  insert into questions (title, body, slug, category_id, status, created_at, published_at)
  select title, body, slug, cat.id, 'published', now(), now()
  from cat
  cross join (values
    (1, 'Ev sahibim evi satıyor dedi, beni hemen çıkarabilir mi?', 'Ev sahibim evi satıyor dedi, beni hemen çıkarabilir mi?', 'ev-sahibim-evi-satiyor-dedi-beni-hemen-cikarabilir-mi'),
    (2, 'Kardeşim babamdan kalan evi kendi üstüne almak istiyor, buna engel olabilir miyim?', 'Kardeşim babamdan kalan evi kendi üstüne almak istiyor, buna engel olabilir miyim?', 'kardesim-babamdan-kalan-evi-kendi-ustune-almak-istiyor'),
    (3, 'İşimden çıkarıldım ama bana hiçbir tazminat ödemediler, bu normal mi?', 'İşimden çıkarıldım ama bana hiçbir tazminat ödemediler, bu normal mi?', 'isimden-cikarildim-tazminat-odemediler'),
    (4, 'Borç yüzünden maaşıma haciz geldi, tamamını kesebilirler mi?', 'Borç yüzünden maaşıma haciz geldi, tamamını kesebilirler mi?', 'borc-yuzunden-maasima-haciz-geldi'),
    (5, 'Ortak tapulu arsaya diğer hissedar ev yaptı, benim hakkım ne olacak?', 'Ortak tapulu arsaya diğer hissedar ev yaptı, benim hakkım ne olacak?', 'ortak-tapulu-arsaya-diger-hissedar-ev-yapti'),
    (6, 'Banka borcumu ödedim ama hesaplarım hâlâ bloke, ne yapmalıyım?', 'Banka borcumu ödedim ama hesaplarım hâlâ bloke, ne yapmalıyım?', 'banka-borcumu-odedim-hesaplarim-hala-bloke'),
    (7, 'Eşim beni terk etti, boşanma davası açabilir miyim?', 'Eşim beni terk etti, boşanma davası açabilir miyim?', 'esim-beni-terk-etti-bosanma-davasi-acabilir-miyim'),
    (8, 'İnternetten aldığım ürünü iade etmek istiyorum, satıcı kabul etmiyor. Ne yapabilirim?', 'İnternetten aldığım ürünü iade etmek istiyorum, satıcı kabul etmiyor. Ne yapabilirim?', 'internetten-aldigim-urunu-iade-satici-kabul-etmiyor'),
    (9, 'Kredi kartım başkası tarafından kullanılmış, borç bana mı ait?', 'Kredi kartım başkası tarafından kullanılmış, borç bana mı ait?', 'kredi-kartim-baskasi-tarafindan-kullanilmis'),
    (10, 'Komşum sürekli gürültü yapıyor, şikâyet etsem sonuç alır mıyım?', 'Komşum sürekli gürültü yapıyor, şikâyet etsem sonuç alır mıyım?', 'komsum-surekli-gurultu-yapiyor'),
    (11, 'Sigortasız çalıştırıldım, hakkımı alabilir miyim?', 'Sigortasız çalıştırıldım, hakkımı alabilir miyim?', 'sigortasiz-calistirildim'),
    (12, 'Tapuda satış gösterdik ama aslında bağıştı, sorun olur mu?', 'Tapuda satış gösterdik ama aslında bağıştı, sorun olur mu?', 'tapuda-satis-gosterdik-aslinda-bagis'),
    (13, 'İcra borcum var diye evime hemen haciz gelir mi?', 'İcra borcum var diye evime hemen haciz gelir mi?', 'icra-borcum-var-evine-hemen-haciz-gelir-mi'),
    (14, 'İş kazası geçirdim ama işveren kabul etmiyor, ne yapabilirim?', 'İş kazası geçirdim ama işveren kabul etmiyor, ne yapabilirim?', 'is-kazasi-gecirdim-isveren-kabul-etmiyor'),
    (15, 'Kefil oldum, borçlu ödemiyor. Borç benden mi istenir?', 'Kefil oldum, borçlu ödemiyor. Borç benden mi istenir?', 'kefil-oldum-borclu-odemedi'),
    (16, 'Aracımı sattım ama ceza hâlâ bana geliyor, neden?', 'Aracımı sattım ama ceza hâlâ bana geliyor, neden?', 'aracimi-sattim-ceza-hala-bana-geliyor'),
    (17, 'Kira sözleşmem bitmeden evden çıkarsam ceza öder miyim?', 'Kira sözleşmem bitmeden evden çıkarsam ceza öder miyim?', 'kira-sozlesmem-bitmeden-evden-cikarsam'),
    (18, 'İnşaata para verdim ama ev teslim edilmedi, ne yapabilirim?', 'İnşaata para verdim ama ev teslim edilmedi, ne yapabilirim?', 'insaata-para-verdim-ev-teslim-edilmedi'),
    (19, 'Boşandıktan sonra nafaka ne kadar süre ödenir?', 'Boşandıktan sonra nafaka ne kadar süre ödenir?', 'bosandiktan-sonra-nafaka-ne-kadar-sure'),
    (20, 'Biri benim adıma sahte imza atmış, sorumlu olur muyum?', 'Biri benim adıma sahte imza atmış, sorumlu olur muyum?', 'biri-benim-adima-sahte-imza-atmis')
  ) as v(ord, title, body, slug)
  order by v.ord
  returning id, slug
),
ans as (
  select * from (values
    ('ev-sahibim-evi-satiyor-dedi-beni-hemen-cikarabilir-mi', 'Ev sahibinin evi satması, kiracının hemen çıkarılacağı anlamına gelmez. Yeni malik, kira sözleşmesine uymak zorundadır. Tahliye için belirli şartların oluşması ve yasal sürelere uyulması gerekir. Aksi halde kiracı evden çıkarılamaz.'),
    ('kardesim-babamdan-kalan-evi-kendi-ustune-almak-istiyor', 'Miras kalan taşınmazlarda tüm mirasçıların payı vardır. Kardeşinizin tek başına evi üzerine alabilmesi için diğer mirasçıların rızası gerekir. Rıza yoksa paylı mülkiyet devam eder ve hukuki yollarla paylaşım talep edilebilir.'),
    ('isimden-cikarildim-tazminat-odemediler', 'İşten çıkarılan bir işçi, çalıştığı süreye ve fesih şekline göre kıdem ve ihbar tazminatına hak kazanabilir. Haklı bir neden yoksa tazminatsız çıkarma hukuka aykırı olabilir. Bu durumda işçilik alacakları talep edilebilir.'),
    ('borc-yuzunden-maasima-haciz-geldi', 'Maaş haczinde, maaşın tamamı kesilemez. Yasal olarak maaşın sadece belli bir kısmına haciz konulabilir. Geçim şartları göz önünde bulundurularak sınırlama yapılır.'),
    ('ortak-tapulu-arsaya-diger-hissedar-ev-yapti', 'Ortak tapulu taşınmazda bir hissedarın tek başına ev yapması, diğer hissedarların hakkını ortadan kaldırmaz. Yapılan yapı bazı durumlarda muhdesat olarak değerlendirilir. Hak kaybı yaşanmaması için hukuki durumun netleştirilmesi gerekir.'),
    ('banka-borcumu-odedim-hesaplarim-hala-bloke', 'Borç ödendikten sonra hacizlerin kaldırılması gerekir. Ancak bazı durumlarda banka veya icra dairesi işlem yapmayabilir. Bu durumda haczin kaldırılması için ayrıca başvuru yapılması gerekebilir.'),
    ('esim-beni-terk-etti-bosanma-davasi-acabilir-miyim', 'Eşin evi terk etmesi, belirli şartlar altında boşanma sebebi sayılabilir. Terk süresinin dolması ve gerekli işlemlerin yapılması halinde boşanma davası açılabilir.'),
    ('internetten-aldigim-urunu-iade-satici-kabul-etmiyor', 'Mesafeli satışlarda tüketicinin cayma hakkı vardır. Belirli süre içinde yapılan iadelerde satıcı ürünü geri almak zorundadır. Kabul edilmemesi durumunda tüketici hakları devreye girer.'),
    ('kredi-kartim-baskasi-tarafindan-kullanilmis', 'Bilginiz ve onayınız dışında yapılan işlemlerden kural olarak siz sorumlu tutulmazsınız. Ancak durumun bankaya zamanında bildirilmesi önemlidir. Aksi halde sorumluluk doğabilir.'),
    ('komsum-surekli-gurultu-yapiyor', 'Sürekli ve rahatsız edici gürültü, komşuluk hukukuna aykırıdır. Uyarılara rağmen devam ediyorsa şikâyet yoluyla müdahale sağlanabilir. Gerekirse hukuki başvuru yapılabilir.'),
    ('sigortasiz-calistirildim', 'Sigortasız çalıştırılmak hukuka aykırıdır. Çalışma süresi ispatlanabildiği takdirde hem sigorta hem de işçilik hakları talep edilebilir.'),
    ('tapuda-satis-gosterdik-aslinda-bagis', 'Gerçekte bağış olan işlemin tapuda satış gibi gösterilmesi ileride sorunlara yol açabilir. Mirasçılar açısından dava konusu yapılabilir ve tapu iptali gündeme gelebilir.'),
    ('icra-borcum-var-evine-hemen-haciz-gelir-mi', 'İcra borcu olması, doğrudan eve haciz geleceği anlamına gelmez. Haczin yapılabilmesi için belirli aşamaların tamamlanması gerekir. Ayrıca bazı eşyalar haczedilemez.'),
    ('is-kazasi-gecirdim-isveren-kabul-etmiyor', 'İş kazasının işveren tarafından kabul edilmemesi, kazanın yok sayılacağı anlamına gelmez. Gerekli başvurular yapılarak iş kazasının tespiti sağlanabilir.'),
    ('kefil-oldum-borclu-odemedi', 'Kefillik, borç ödenmediğinde kefilin de sorumlu olabileceği anlamına gelir. Ancak kefalet türüne göre sorumluluğun kapsamı değişebilir.'),
    ('aracimi-sattim-ceza-hala-bana-geliyor', 'Araç satışı sonrası tescil işlemleri tamamlanmadıysa cezalar eski malike gelebilir. Devrin resmî kayıtlara işlendiğinden emin olunmalıdır.'),
    ('kira-sozlesmem-bitmeden-evden-cikarsam', 'Kira süresi dolmadan çıkılması bazı durumlarda tazminat doğurabilir. Ancak haklı neden varsa sorumluluk oluşmayabilir.'),
    ('insaata-para-verdim-ev-teslim-edilmedi', 'Evin teslim edilmemesi sözleşmeye aykırılık oluşturur. Bedel iadesi, teslim veya tazminat talepleri gündeme gelebilir.'),
    ('bosandiktan-sonra-nafaka-ne-kadar-sure', 'Nafakanın süresi ve miktarı tarafların durumuna göre belirlenir. Şartlar değişirse nafakanın kaldırılması veya azaltılması istenebilir.'),
    ('biri-benim-adima-sahte-imza-atmis', 'Sahte imza ile yapılan işlemler kural olarak imza sahibini bağlamaz. Ancak durumun fark edilir edilmez itiraz edilmesi önemlidir. Aksi halde hak kaybı yaşanabilir.')
  ) as a(slug, answer_text)
)
insert into answers (question_id, answer_text, created_by, created_at, updated_at)
select qs.id, a.answer_text, null, now(), now()
from qs
join ans a on qs.slug = a.slug;
