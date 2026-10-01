"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** The four-corner frame shared by every page. */
export function Chrome({ fixed = true }: { fixed?: boolean }) {
  const path = usePathname();
  const pos = fixed ? "fixed" : "absolute";
  const view = (href: string, label: string) => {
    const current = path === href;
    return (
      <Link
        href={href}
        aria-current={current ? "page" : undefined}
        className={`transition-opacity duration-300 hover:opacity-100 ${current ? "opacity-100" : "opacity-50"}`}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <header className={`${pos} inset-x-0 top-0 z-30 flex items-start justify-between p-5 text-[15px] sm:p-8 md:px-12`}>
        <Link href="/" className="group flex items-baseline gap-2.5" aria-label="Omid, home">
          <span className="font-medium tracking-tight">Omid</span>
          <span lang="fa" dir="rtl" className="font-farsi font-light text-ash transition-colors group-hover:text-dawn">
            امید
          </span>
        </Link>
        <nav aria-label="About">{view("/profile", "Profile")}</nav>
      </header>
      <footer className={`${pos} bottom-0 left-0 z-30 p-5 text-[15px] sm:p-8 md:px-12`}>
        <nav aria-label="Views" className="flex gap-2">
          {view("/", "Featured")}
          <span aria-hidden className="opacity-50">/</span>
          {view("/all", "Index")}
        </nav>
      </footer>
    </>
  );
}
