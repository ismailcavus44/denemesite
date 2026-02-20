export type AuthorSocials = {
  linkedin?: string;
  instagram?: string;
  whatsapp?: string;
};

export type Author = {
  slug: string;
  name: string;
  title?: string;
  image?: string;
  bio: string;
  socials?: AuthorSocials;
};

export const authors: Author[] = [
  {
    slug: "ismail-cavus",
    name: "İsmail Çavuş",
    title: "Av.",
    image: "/av-ismail-cavus.jpg",
    bio: "Av. İsmail Çavuş, Gazi Üniversitesi Hukuk Fakültesi 2020 mezunu olup Ankara 2 No'lu Barosu'na bağlı serbest avukat olarak çalışmaktadır. İş hukuku, trafik tazminat davaları, aile ve miras hukuku, askeri davalar ve sağlık hukuku alanlarında tecrübelidir; malpraktis davalarında doktor vekilliği ve sağlık personelinin idari ve disiplin süreçlerinde danışmanlık vermektedir. Çözüm odaklı ve profesyonel hukuki hizmet sunmayı ilke edinmiştir.",
    socials: {
      linkedin: "https://www.linkedin.com/in/ismail-cavus/",
      instagram: "https://www.instagram.com/av.ismailcavus/",
      whatsapp: "https://wa.me/905102206945",
    },
  },
  {
    slug: "kaan-karayaka",
    name: "Kaan Karayaka",
    title: "Av.",
    image: "/av-kaan-karayaka.png",
    bio: "Hukuk dünyasındaki gelişmeleri yakından takip eden Av. Kaan Karayaka, özellikle İş ve Aile Hukuku disiplinlerinde edindiği tecrübeyi akademik bir titizlikle pratiğe dökmektedir. Hazırladığı rehber yazılarla toplumu hukuki hakları konusunda bilinçlendirmeyi görev edinen Karayaka, uyuşmazlıkların çözümünde stratejik ve sonuç odaklı bir yaklaşım benimsemektedir.",
    socials: {
      linkedin: "https://www.linkedin.com/in/avukat-kaan-karayaka/",
      whatsapp: "https://wa.me/90",
    },
  },
];

const bySlug = new Map(authors.map((a) => [a.slug, a]));

export function getAuthorBySlug(slug: string): Author | undefined {
  return bySlug.get(slug);
}
