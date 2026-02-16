"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeader = !pathname.startsWith("/admin");

  return (
    <>
      {showHeader ? <SiteHeader /> : null}
      {children}
    </>
  );
}
