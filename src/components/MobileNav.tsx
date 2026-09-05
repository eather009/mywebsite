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
        className="flex items-center justify-center rounded-md border border-[var(--port-border)] p-2 text-[var(--port-muted)] hover:border-[var(--port-accent)] hover:text-[var(--port-accent)]"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <nav
          className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-[var(--port-border)] bg-[var(--port-surface)] p-2 shadow-xl"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => {
            const active = isNavActive(link.href, pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-2.5 text-sm font-medium ${
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
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-md bg-[var(--port-accent)] px-3 py-2.5 text-center text-sm font-semibold text-white"
          >
            LinkedIn
          </Link>
        </nav>
      )}
    </div>
  );
}
