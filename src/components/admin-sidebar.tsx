"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Inbox,
  MessageSquare,
  FolderTree,
  FileText,
  Users,
  LogOut,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/inbox", label: "Bekleyenler", icon: Inbox },
  { href: "/admin/sorular", label: "Tüm Sorular", icon: MessageSquare },
  { href: "/admin/categories", label: "Kategoriler", icon: FolderTree },
  { href: "/admin/articles", label: "Makaleler", icon: FileText },
  { href: "/admin/authors", label: "Yazarlar", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white shadow-sm">
      <div className="flex h-14 items-center border-b border-slate-100 px-5">
        <Link href="/admin/dashboard" className="font-semibold text-slate-800">
          Admin Paneli
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className="size-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOut className="size-5 shrink-0" />
          Çıkış
        </button>
      </div>
    </aside>
  );
}
