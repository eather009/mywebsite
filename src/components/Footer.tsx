import Link from "next/link";
import { navLinks } from "@/lib/data";
import { getSiteConfig } from "@/lib/site-config";
import { Mail, MapPin } from "lucide-react";
import { LinkedInIcon } from "@/components/icons";

export async function Footer() {
  const siteConfig = await getSiteConfig();
  return (
    <footer className="mt-auto border-t border-[var(--port-border)] bg-[var(--port-surface)]">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-[var(--port-fg)]">{siteConfig.name}</p>
          <p className="mt-2 text-sm font-medium text-[var(--port-accent)]">
            Technical Lead · System Architecture · Cloud
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--port-muted)]">
            {siteConfig.tagline}
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-[var(--port-muted)]">
            <MapPin className="h-4 w-4 text-[var(--port-accent)]" aria-hidden="true" />
            {siteConfig.location}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--port-fg)]">
            Quick links
          </p>
          <ul className="mt-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="port-link text-sm">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--port-fg)]">
            Connect
          </p>
          <div className="mt-4 space-y-3">
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--port-muted)] transition hover:text-[var(--port-accent)]"
            >
              <LinkedInIcon className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-2 text-sm text-[var(--port-muted)] transition hover:text-[var(--port-accent)]"
            >
              <Mail className="h-4 w-4" />
              {siteConfig.email}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--port-border)] bg-[var(--port-panel)] px-6 py-4 text-center text-sm text-[var(--port-muted)]">
        © {new Date().getFullYear()} {siteConfig.shortName} · {siteConfig.location}
      </div>
    </footer>
  );
}
