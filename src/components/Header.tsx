import Link from "next/link";
import { siteConfig } from "@/lib/data";
import { MobileNav } from "@/components/MobileNav";
import { NavTabs } from "@/components/NavTabs";

export function Header() {
  return (
    <header className="port-header sticky top-0 z-50">
      <div className="ide-titlebar">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2.5">
          <div className="ide-traffic-lights" aria-hidden="true">
            
          </div>
          <Link href="/" className="group flex min-w-0 flex-1 items-center gap-2">
            <span className="truncate text-xs text-[var(--ide-muted)]">
              
            </span>
          </Link>
          <MobileNav />
        </div>
      </div>

      <NavTabs />
    </header>
  );
}
