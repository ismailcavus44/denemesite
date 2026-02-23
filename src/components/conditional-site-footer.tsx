"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";

/** Admin panelinde footer gösterme. */
export function ConditionalSiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <SiteFooter />;
}
