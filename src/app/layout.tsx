import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig, defaultOgImage } from "@/lib/site";
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
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/logo-square.png",
  },
  title: {
    default: siteConfig.homeTitle,
    template: "%s | YasalHaklarınız",
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "tr_TR",
    title: siteConfig.homeTitle,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.homeTitle,
    description: siteConfig.description,
    images: [defaultOgImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
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
        <meta name="google-site-verification" content="fM2izkySnfaPccXh7h5bGHboOjCRdw-i9YDbkFfEgec" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="YasalHaklariniz RSS"
          href={`${siteConfig.url.replace(/\/$/, "")}/feed.xml`}
        />
        {supabaseOrigin && <link rel="preconnect" href={supabaseOrigin} />}
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-3N0SZSS7XN" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3N0SZSS7XN');
          `}
        </Script>
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
