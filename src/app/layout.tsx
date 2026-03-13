import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site";
import { ThemeProvider } from "@/components/theme-provider";
import { ConditionalSiteFooter } from "@/components/conditional-site-footer";
import { ConditionalMain } from "@/components/conditional-main";

const manrope = localFont({
  src: [
    { path: "../../public/fonts/Manrope-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Manrope-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-manrope",
  display: "swap",
  preload: true,
});

function getSupabaseOrigin(): string | null {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!u) return null;
  try {
    return new URL(u).origin;
  } catch {
    return null;
  }
}

const supabaseOrigin = getSupabaseOrigin();

export const metadata: Metadata = {
  title: {
    default: "YasalHaklarınız | Hukuki Soru Sor",
    template: "YasalHaklarınız | %s",
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "tr_TR",
    title: "YasalHaklarınız | Hukuki Soru Sor",
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: "/images/default-og.jpg", width: 1200, height: 630, alt: "YasalHaklarınız" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "YasalHaklarınız | Hukuki Soru Sor",
    description: siteConfig.description,
    images: ["/images/default-og.jpg"],
  },
  other: { "theme-color": "#ffffff" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning className={manrope.variable}>
      <head>
        <link rel="preload" href="/hukuki-sor-logo.png" as="image" />
        <link rel="preload" href="/hukuki-sor-logo-dark.png" as="image" />
        {supabaseOrigin && <link rel="preconnect" href={supabaseOrigin} />}
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SiteShell>
            <ConditionalMain>{children}</ConditionalMain>
          </SiteShell>
          <ConditionalSiteFooter />
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
