"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig, navLinks } from "@/lib/data";
import { isNavActive } from "@/lib/nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center rounded border border-[var(--port-border)] p-2 text-[var(--port-muted)] hover:border-[var(--ide-accent)] hover:text-[var(--ide-accent)]"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <nav
          className="absolute right-0 z-50 mt-2 w-56 rounded border border-[var(--port-border)] bg-[var(--ide-sidebar)] p-2 shadow-xl"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => {
            const active = isNavActive(link.href, pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block rounded px-3 py-2.5 text-sm ${
                  active
                    ? "bg-[var(--ide-tab-active)] text-[var(--port-fg)] ring-1 ring-inset ring-[var(--ide-accent)]"
                    : "text-[var(--port-muted)] hover:bg-[var(--ide-panel)] hover:text-[var(--port-fg)]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {link.label.toLowerCase()}.tsx
              </Link>
            );
          })}
          <Link
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded bg-[var(--ide-accent)] px-3 py-2.5 text-center text-sm font-semibold text-white"
          >
            hire_me()
          </Link>
        </nav>
      )}
    </div>
  );
}
