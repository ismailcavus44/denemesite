import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "YasalHaklarınız ile iletişime geçin. Öneri ve geri bildirimlerinizi paylaşabilirsiniz.",
};

export default function IletisimLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
