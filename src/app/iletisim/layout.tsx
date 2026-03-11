import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

const _t = "İletişim | YasalHaklarınız";
const _d = "YasalHaklarınız ile iletişime geçin. Öneri ve geri bildirimlerinizi paylaşabilirsiniz.";
const _u = `${siteConfig.url}/iletisim`;

export const metadata: Metadata = {
  title: { absolute: "İletişim | YasalHaklarınız" },
  description: _d,
  openGraph: { title: _t, description: _d, url: _u },
  twitter: { card: "summary_large_image", title: _t, description: _d },
  alternates: { canonical: _u },
};

export default function IletisimLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
