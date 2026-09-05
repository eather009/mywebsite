import Link from "next/link";
import { siteConfig } from "@/lib/data";
import { MobileNav } from "@/components/MobileNav";
import { NavTabs } from "@/components/NavTabs";

export function Header() {
  return (
    <header className="port-header sticky top-0 z-50 border-b border-[var(--port-border)] bg-[var(--port-surface)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="min-w-0">
          <span className="block truncate text-base font-semibold tracking-tight text-[var(--port-fg)]">
            {siteConfig.shortName}
          </span>
          <span className="mt-0.5 block truncate text-xs text-[var(--port-muted)]">
            Technical Lead · System Architecture · Cloud
          </span>
        </Link>
        <NavTabs />
        <MobileNav />
      </div>
    </header>
  );
}
