"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig, navLinks } from "@/lib/data";
import { isNavActive } from "@/lib/nav";

export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
      {navLinks.map((link) => {
        const active = isNavActive(link.href, pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-[var(--port-accent-soft)] text-[var(--port-accent)]"
                : "text-[var(--port-muted)] hover:bg-[var(--port-panel)] hover:text-[var(--port-fg)]"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
      <Link
        href={siteConfig.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-2 rounded-md border border-[var(--port-border)] px-3 py-2 text-sm font-medium text-[var(--port-fg)] transition hover:border-[var(--port-accent)] hover:text-[var(--port-accent)]"
      >
        LinkedIn
      </Link>
    </nav>
  );
}
