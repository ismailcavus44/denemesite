import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "YasalHaklarınız | Hukuki Soru Sor",
    template: "YasalHaklarınız | %s",
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SiteShell>
            <main className="mx-auto w-full max-w-6xl overflow-x-hidden px-4 pt-4 pb-8 lg:py-8">
              {children}
            </main>
          </SiteShell>
          <SiteFooter />
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
