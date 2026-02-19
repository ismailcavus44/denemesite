"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/rehber", label: "Rehber" },
  { href: "/sorular", label: "Sorular" },
  { href: "/hakkimizda", label: "Hakkımızda" },
];

const contactDropdownItems = [{ href: "/kariyer", label: "Kariyer" }];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-0 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl py-4 pl-0 pr-4 md:px-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-none items-center gap-6 lg:gap-12 xl:gap-[200px] md:flex-1">
            <Link href="/" className="-ml-1 flex h-12 shrink-0 items-center md:ml-0" aria-label="YasalHaklarınız ana sayfa">
              <Image
                src="/hukuki-sor-logo.png"
                alt="YasalHaklarınız"
                width={200}
                height={40}
                className="h-12 w-auto object-contain"
                priority
                fetchPriority="high"
                unoptimized
              />
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-medium text-foreground md:flex">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="whitespace-nowrap border-b-2 border-transparent pb-0.5 transition-colors hover:border-primary"
                >
                  {label}
                </Link>
              ))}
              <div
                className="relative"
                onMouseEnter={() => setContactOpen(true)}
                onMouseLeave={() => setContactOpen(false)}
              >
                <Link
                  href="/iletisim"
                  className="flex items-center gap-1 whitespace-nowrap border-b-2 border-transparent pb-0.5 transition-colors hover:border-primary"
                >
                  İletişim
                  <ChevronDown className={`h-4 w-4 transition-transform ${contactOpen ? "rotate-180" : ""}`} aria-hidden />
                </Link>
                {contactOpen && (
                  <div className="absolute right-0 top-full z-50 pt-1">
                    <div className="min-w-[160px] rounded-md border border-slate-200 bg-background py-1 shadow-lg">
                      {contactDropdownItems.map(({ href, label }) => (
                        <Link
                          key={href}
                          href={href}
                          className="block border-l-2 border-transparent py-2 pl-4 pr-4 text-sm transition-colors hover:border-primary hover:bg-muted/50"
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild className="hidden md:inline-flex">
              <Link href="/soru-sor">Soru Sor</Link>
            </Button>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-md text-foreground hover:bg-muted md:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobil menü */}
        {mobileOpen && (
          <nav className="mt-4 flex flex-col gap-1 border-t pt-4 md:hidden">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="flex flex-col gap-1 border-t pt-2">
              <Link
                href="/iletisim"
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                İletişim
              </Link>
              {contactDropdownItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="mt-2 flex justify-center">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link
                  href="/soru-sor"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center px-5 py-2.5 text-base"
                >
                  Soru Sor
                </Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
