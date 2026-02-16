"use client";

import { usePathname } from "next/navigation";
import { AdminHeader } from "@/components/admin-header";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeader = !pathname.startsWith("/admin/login");

  return (
    <>
      {showHeader ? <AdminHeader /> : null}
      {children}
    </>
  );
}
