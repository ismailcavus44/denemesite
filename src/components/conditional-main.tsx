"use client";

import { usePathname } from "next/navigation";

export function ConditionalMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <main
      className={
        isAdmin
          ? "w-full overflow-x-hidden"
          : "mx-auto w-full max-w-6xl overflow-x-hidden px-4 pt-4 pb-8 lg:py-8"
      }
    >
      {children}
    </main>
  );
}
