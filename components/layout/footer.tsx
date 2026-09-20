import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { SITE_NAME } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="site-container py-9 sm:py-11">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
          <div className="flex items-center gap-3 text-base font-semibold sm:text-lg">
            <BrandMark className="h-9 w-9 sm:h-10 sm:w-10" />{SITE_NAME}
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-7 text-[15px] text-muted sm:text-base">
            {[["/about", "About"], ["/sources", "Sources"], ["/privacy", "Privacy"], ["/disclaimer", "Disclaimer"]].map(([href, label]) => (
              <Link key={href} href={href} className="hover:text-primary">{label}</Link>
            ))}
          </nav>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">© {new Date().getFullYear()} {SITE_NAME}. Educational estimates, not financial advice.</p>
      </div>
    </footer>
  );
}
