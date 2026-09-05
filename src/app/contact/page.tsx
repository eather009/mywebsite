import { Mail, MapPin, MessageSquare } from "lucide-react";
import { LinkedInIcon } from "@/components/icons";
import { PageLayout } from "@/components/PageLayout";
import { PageHero, Section, Card, ButtonPrimary } from "@/components/ui";
import { AvailabilityBadge, AvailabilityMessage } from "@/components/AvailabilityBadge";
import { recommendations } from "@/lib/data";
import { getSiteSettings } from "@/lib/content";
import { getSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [settings, siteConfig] = await Promise.all([getSiteSettings(), getSiteConfig()]);

  return (
    <PageLayout>
      <PageHero
        title="Contact"
        subtitle="Professional inquiries for Technical Lead, Engineering Manager, and Senior System Engineer roles."
        label="Contact"
      />

      <Section title="Get in Touch" label="Connect">
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
                  <h3 className="font-semibold text-[var(--port-fg)]">LinkedIn — Primary Channel</h3>
                  <p className="mt-1 text-sm text-[var(--port-muted)]">
                    Best for professional inquiries, references, and opportunities.
                  </p>
                  <p className="mt-2 text-sm text-[var(--port-accent)]">linkedin.com/in/iftekhareather</p>
                </div>
              </a>
            </Card>

            <Card>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-start gap-4 transition hover:opacity-90"
              >
                <div className="rounded bg-[var(--port-panel)] p-3 ring-1 ring-[var(--port-border)]">
                  <Mail className="h-6 w-6 text-[var(--port-accent)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--port-fg)]">Email</h3>
                  <p className="mt-1 text-sm text-[var(--port-muted)]">
                    For direct inquiries and collaboration.
                  </p>
                  <p className="mt-2 text-sm text-[var(--port-accent)]">{siteConfig.email}</p>
                </div>
              </a>
            </Card>

            <Card>
              <div className="flex items-start gap-4">
                <div className="rounded bg-[var(--port-panel)] p-3 ring-1 ring-[var(--port-border)]">
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
              <MessageSquare className="h-6 w-6 text-[var(--port-accent)]" />
              <h3 className="mt-4 text-lg font-semibold text-[var(--port-fg)]">For Recruiters</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--port-muted)]">
                LinkedIn has full experience, certifications, and recommendations. Availability
                above is maintained via the admin portal.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[var(--port-muted)]">
                <li>· Technical Lead / Engineering Manager</li>
                <li>· Senior System Engineer · System Architecture</li>
                <li>· Cloud (AWS & Alibaba Cloud) · Backend / Full-Stack</li>
                <li>· Full-time and contract opportunities</li>
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
              <h3 className="section-label">LinkedIn Recommendations</h3>
              {recommendations.map((rec) => (
                <Card key={rec.name}>
                  <p className="text-sm italic text-[var(--port-muted)]">
                    &ldquo;{rec.quote.slice(0, 140)}…&rdquo;
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
