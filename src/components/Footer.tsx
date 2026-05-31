import Link from "next/link";
import { siteConfig, navLinks } from "@/lib/data";
import { Mail, MapPin } from "lucide-react";
import { LinkedInIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="border-t border-[var(--port-border)] bg-[var(--ide-sidebar)]">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3">
          <div>
            <p className="text-lg font-bold text-[var(--port-fg)]">
              <span className="syntax-keyword">class </span>
              <span className="syntax-type">Developer</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--port-muted)]">
              {siteConfig.tagline}
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-[var(--port-muted)]">
              <MapPin className="h-4 w-4 text-[var(--ide-type)]" aria-hidden="true" />
              {siteConfig.location}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-[var(--ide-function)]">// quick_links</p>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="port-link text-sm">
                    → {link.label.toLowerCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-[var(--ide-function)]">// connect</p>
            <div className="mt-4 space-y-3">
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--port-muted)] transition hover:text-[var(--ide-accent)]"
              >
                <LinkedInIcon className="h-4 w-4" />
                LinkedIn
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 text-sm text-[var(--port-muted)] transition hover:text-[var(--ide-accent)]"
              >
                <Mail className="h-4 w-4" />
                {siteConfig.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="ide-statusbar flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap">
          <span className="ide-statusbar-item">
            <span className="opacity-80">⎇</span> main
          </span>
          <span className="ide-statusbar-item">UTF-8</span>
          <span className="ide-statusbar-item">TypeScript</span>
          <span className="ide-statusbar-item hidden sm:inline-flex">Prettier</span>
        </div>
        <div className="flex flex-wrap">
          <span className="ide-statusbar-item hidden sm:inline-flex">{siteConfig.location}</span>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="ide-statusbar-item"
          >
            LinkedIn
          </a>
          <span className="ide-statusbar-item">
            © {new Date().getFullYear()} {siteConfig.shortName}
          </span>
        </div>
      </div>
    </footer>
  );
}
