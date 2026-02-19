import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteFooter } from "@/components/site-footer";

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
  other: { "theme-color": "#ffffff" },
  links: [
    { rel: "preload", href: "/hukuki-sor-logo.png", as: "image" },
    ...(supabaseOrigin ? [{ rel: "preconnect", href: supabaseOrigin }] : []),
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning className={manrope.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
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
