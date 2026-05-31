import { Mail, MapPin, MessageSquare } from "lucide-react";
import { LinkedInIcon } from "@/components/icons";
import { PageLayout } from "@/components/PageLayout";
import { PageHero, Section, Card, ButtonPrimary } from "@/components/ui";
import { AvailabilityBadge, AvailabilityMessage } from "@/components/AvailabilityBadge";
import { siteConfig, recommendations } from "@/lib/data";
import { getSiteSettings } from "@/lib/site-settings-db";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <PageLayout>
      <PageHero
        title="Contact"
        subtitle="Reach out via LinkedIn or email for professional inquiries and collaboration."
        label="contact.tsx"
      />

      <Section title="Get in Touch" label="async function connect">
        <div className="mb-8">
          <AvailabilityBadge settings={settings} />
          <AvailabilityMessage settings={settings} />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <Card>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 transition hover:opacity-90"
              >
                <div className="rounded bg-[#0A66C2] p-3">
                  <LinkedInIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--port-fg)]">LinkedIn — Primary Reference</h3>
                  <p className="mt-1 text-sm text-[var(--port-muted)]">
                    Connect for professional inquiries, references, and career opportunities.
                  </p>
                  <p className="mt-2 text-sm text-[var(--ide-accent)]">linkedin.com/in/iftekhareather</p>
                </div>
              </a>
            </Card>

            <Card>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-start gap-4 transition hover:opacity-90"
              >
                <div className="rounded bg-[var(--ide-panel)] p-3 ring-1 ring-[var(--ide-border)]">
                  <Mail className="h-6 w-6 text-[var(--ide-accent)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--port-fg)]">Email</h3>
                  <p className="mt-1 text-sm text-[var(--port-muted)]">For direct inquiries and collaboration.</p>
                  <p className="mt-2 text-sm text-[var(--ide-accent)]">{siteConfig.email}</p>
                </div>
              </a>
            </Card>

            <Card>
              <div className="flex items-start gap-4">
                <div className="rounded bg-[var(--ide-panel)] p-3 ring-1 ring-[var(--ide-border)]">
                  <MapPin className="h-6 w-6 text-[var(--ide-type)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--port-fg)]">Location</h3>
                  <p className="mt-1 text-sm text-[var(--port-muted)]">
                    Based in Japan. Open to remote and on-site opportunities.
                  </p>
                  <p className="mt-2 text-sm text-[var(--port-fg)]">{siteConfig.location}</p>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card>
              <MessageSquare className="h-6 w-6 text-[var(--ide-accent)]" />
              <h3 className="mt-4 text-lg font-semibold text-[var(--port-fg)]">For Recruiting Agencies</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--port-muted)]">
                My LinkedIn profile includes detailed experience, certifications, and peer
                recommendations. Availability status above is kept current via the admin portal.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[var(--port-muted)]">
                <li><span className="syntax-comment">→</span> Team Lead / Engineering Manager roles</li>
                <li><span className="syntax-comment">→</span> Senior Backend Engineer (PHP, Laravel, Node.js)</li>
                <li><span className="syntax-comment">→</span> Technical Project Manager / Scrum Master</li>
                <li><span className="syntax-comment">→</span> Full-time and contract opportunities</li>
              </ul>
              <ButtonPrimary
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full"
              >
                <LinkedInIcon className="h-5 w-5" />
                View Full Profile on LinkedIn
              </ButtonPrimary>
            </Card>

            <div className="mt-6 space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-[var(--ide-comment)]">
                // linkedin_recommendations
              </h3>
              {recommendations.map((rec) => (
                <Card key={rec.name}>
                  <p className="text-sm italic text-[var(--port-muted)]">
                    &ldquo;{rec.quote.slice(0, 120)}...&rdquo;
                  </p>
                  <p className="mt-2 text-sm font-medium text-[var(--port-fg)]">— {rec.name}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
