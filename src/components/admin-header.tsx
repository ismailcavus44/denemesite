"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";

export function AdminHeader() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="font-semibold">
            Admin Paneli
          </Link>
          <nav className="hidden items-center gap-3 text-sm text-muted-foreground md:flex">
            <Link href="/admin/inbox" className="hover:text-foreground">
              Bekleyenler
            </Link>
            <Link href="/admin/sorular" className="hover:text-foreground">
              Tüm Sorular
            </Link>
            <Link href="/admin/categories" className="hover:text-foreground">
              Kategoriler
            </Link>
            <Link href="/admin/toplu-email" className="hover:text-foreground">
              Toplu E-posta
            </Link>
          </nav>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          Çıkış
        </Button>
      </div>
    </header>
  );
}
