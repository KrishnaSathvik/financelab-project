"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "@/components/brand/brand-mark";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SITE_NAME } from "@/lib/site";

const navItems = [
  { href: "/calculators", label: "Calculators" },
  { href: "/guides", label: "Guides" },
  { href: "/how-it-works", label: "How it works" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="header-inner flex h-[76px] items-center gap-5 sm:gap-7 lg:h-[84px] lg:gap-9">
        <Link href="/" className="flex shrink-0 items-center gap-3 text-lg font-semibold text-foreground lg:text-[20px]">
          <BrandMark className="h-10 w-10 lg:h-11 lg:w-11" />
          {SITE_NAME}
        </Link>

        <nav className="hidden h-full items-center gap-6 text-base text-muted md:flex lg:gap-8">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex h-full items-center hover:text-foreground ${active ? "font-medium text-foreground" : ""}`}
              >
                {item.label}
                {active ? <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-foreground" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="ml-auto inline-flex h-11 items-center justify-center rounded-lg px-3 text-sm font-medium hover:bg-surface md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <div className="max-h-[calc(100vh-76px)] overflow-y-auto border-t border-border bg-card px-4 py-4 md:hidden">
          <nav className="flex flex-col">
            {navItems.map(item=><Link key={item.href} href={item.href} className="rounded-xl px-3 py-3 text-base hover:bg-surface" onClick={()=>setOpen(false)}>{item.label}</Link>)}
            <div className="mt-2 flex items-center justify-between rounded-xl px-3 py-3">
              <span>Theme</span>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
