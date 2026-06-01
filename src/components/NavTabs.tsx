"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig, navLinks } from "@/lib/data";
import { isNavActive } from "@/lib/nav";

function tabClassName(active: boolean) {
  return active ? "ide-tab ide-tab-active" : "ide-tab";
}

export function NavTabs() {
  const pathname = usePathname();

  return (
    <div className="ide-tabbar hidden md:block">
      <div className="mx-auto flex max-w-6xl items-center overflow-x-auto">
        {navLinks.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            className={tabClassName(isNavActive(link.href, pathname))}
            aria-current={isNavActive(link.href, pathname) ? "page" : undefined}
          >
            <span className="ide-tab-icon">{index === 0 ? "⌘" : "◦"}</span>
            {link.label.toLowerCase()}.tsx
          </Link>
        ))}
        <Link
          href={siteConfig.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="ide-tab ml-auto border-l-0 !border-r-0 text-[var(--ide-type)] hover:text-[var(--ide-type)]"
        >
          <span className="ide-tab-icon">→</span>
          connect_with_me()
        </Link>
      </div>
    </div>
  );
}
