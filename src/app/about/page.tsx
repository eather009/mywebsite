import { Award, Globe, Languages } from "lucide-react";
import { LinkedInIcon } from "@/components/icons";
import { PageLayout } from "@/components/PageLayout";
import { PageHero, Section, Card, Badge, ButtonPrimary } from "@/components/ui";
import { certifications, skills } from "@/lib/data";
import { getSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const siteConfig = await getSiteConfig();

  return (
    <PageLayout>
      <PageHero
        title="About"
        subtitle="Background, skills, and certifications for Technical Lead and Senior System Engineer roles."
        label="Profile"
      />
      <Section title="Professional Summary" label="Overview">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 leading-relaxed text-[var(--port-muted)] lg:col-span-2">
            <p>
              I am <strong className="text-[var(--port-fg)]">{siteConfig.name}</strong>, an
              Engineering Manager and Technical Lead based in {siteConfig.location}.
            </p>
            <p>{siteConfig.summary}</p>
            <p>
              At Export Japan Inc., I lead architecture, cloud infrastructure, and agile delivery
              for tourism digital platforms including Kyoto.travel.
            </p>
            <p>
              Previously I was Project Manager at Tappware Solutions (government e-governance
              systems) and Senior Software Engineer at Divine IT (enterprise VoIP billing and
              accounting platforms). I hold CSPO, CSM, A-CSD, and CSD certifications and was
              recognized as a CakePHP 3.5.0 contributor.
            </p>
          </div>

          <Card className="h-fit">
            <h3 className="font-semibold text-[var(--port-fg)]">Quick Facts</h3>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-[var(--port-muted)]">Location</dt>
                <dd className="mt-1 text-[var(--port-fg)]">{siteConfig.location}</dd>
              </div>
              <div>
                <dt className="text-[var(--port-muted)]">Experience</dt>
                <dd className="mt-1 text-[var(--port-fg)]">16+ years</dd>
              </div>
              <div>
                <dt className="text-[var(--port-muted)]">Current role</dt>
                <dd className="mt-1 text-[var(--port-fg)]">Engineering Manager</dd>
              </div>
              <div>
                <dt className="text-[var(--port-muted)]">Company</dt>
                <dd className="mt-1 text-[var(--port-fg)]">Export Japan Inc.</dd>
              </div>
            </dl>
            <ButtonPrimary
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full"
            >
              <LinkedInIcon className="h-4 w-4" />
              LinkedIn Profile
            </ButtonPrimary>
          </Card>
        </div>
      </Section>

      <Section
        title="Languages"
        subtitle="Communication skills for international teams."
        className="border-t border-[var(--port-border)] bg-[var(--port-panel)]"
        label="Languages"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <Languages className="h-6 w-6 text-[var(--port-accent)]" />
            <h3 className="mt-3 font-semibold text-[var(--port-fg)]">English</h3>
            <p className="mt-1 text-sm text-[var(--port-muted)]">Professional working proficiency</p>
          </Card>
          <Card>
            <Globe className="h-6 w-6 text-[var(--ide-type)]" />
            <h3 className="mt-3 font-semibold text-[var(--port-fg)]">Japanese</h3>
            <p className="mt-1 text-sm text-[var(--port-muted)]">Limited working proficiency</p>
          </Card>
        </div>
      </Section>

      <Section title="Skills & Expertise" label="Capabilities">
        <div className="grid gap-6 md:grid-cols-2">
          {skills.map((group) => (
            <Card key={group.category}>
              <h3 className="font-semibold text-[var(--port-fg)]">{group.category}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Certifications"
        subtitle="Verified credentials from Scrum Alliance."
        className="border-t border-[var(--port-border)] bg-[var(--port-panel)]"
        label="Credentials"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {certifications.map((cert) => (
            <a key={cert.name} href={cert.url} target="_blank" rel="noopener noreferrer">
              <Card className="hover:border-[var(--port-accent)]">
                <div className="flex items-start gap-4">
                  <Award className="h-6 w-6 shrink-0 text-[var(--port-accent)]" />
                  <div>
                    <h3 className="font-semibold text-[var(--port-fg)]">{cert.name}</h3>
                    <p className="mt-1 text-sm text-[var(--port-muted)]">
                      {cert.issuer} · {cert.year}
                    </p>
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </Section>
    </PageLayout>
  );
}
