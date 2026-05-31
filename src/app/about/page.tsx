import { Award, Globe, Languages } from "lucide-react";
import { LinkedInIcon } from "@/components/icons";
import { PageLayout } from "@/components/PageLayout";
import { PageHero, Section, Card, Badge, ButtonPrimary } from "@/components/ui";
import { siteConfig, certifications, skills } from "@/lib/data";

export default function AboutPage() {
  return (
    <PageLayout>
      <PageHero
        title="About Me"
        subtitle="Engineering leader with 14+ years building enterprise platforms, leading teams, and delivering results for global clients."
        label="about.tsx"
      />
      <Section title="Professional Summary" label="interface Developer">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4 text-[var(--port-muted)] leading-relaxed">
            <p>
              I am <strong className="text-[var(--port-fg)]">{siteConfig.name}</strong>, a{" "}
              {siteConfig.title.toLowerCase()} based in {siteConfig.location}. I specialize in
              backend architecture, team leadership, and agile project delivery for high-traffic
              web applications.
            </p>
            <p>
              Currently at Export Japan Inc., I lead the system team responsible for tourism
              digital platforms including Kyoto.travel — designing infrastructure on AWS and
              Alibaba Cloud, managing engineers, and ensuring on-time delivery through Scrum
              practices.
            </p>
            <p>
              Before Japan, I spent nearly four years as Project Manager at Tappware Solutions,
              delivering government e-governance systems, and three years as Senior Software
              Engineer at Divine IT, building enterprise VoIP billing and accounting platforms.
            </p>
            <p>
              I hold CSPO, CSM, and A-CSD certifications from Scrum Alliance and was recognized
              as an official contributor to CakePHP 3.5.0.
            </p>
          </div>

          <Card className="h-fit">
            <h3 className="font-semibold text-[var(--port-fg)]">Quick Facts</h3>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-[var(--ide-comment)]">location</dt>
                <dd className="mt-1 text-[var(--port-fg)]">{siteConfig.location}</dd>
              </div>
              <div>
                <dt className="text-[var(--ide-comment)]">experience</dt>
                <dd className="mt-1 text-[var(--port-fg)]">14+ years</dd>
              </div>
              <div>
                <dt className="text-[var(--ide-comment)]">role</dt>
                <dd className="mt-1 text-[var(--port-fg)]">{siteConfig.title}</dd>
              </div>
              <div>
                <dt className="text-[var(--ide-comment)]">company</dt>
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
        className="border-t border-[var(--port-border)] bg-[var(--ide-panel)]"
        label="locale"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <Languages className="h-6 w-6 text-[var(--ide-accent)]" />
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

      <Section title="Skills & Expertise" label="type Skills">
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
        className="border-t border-[var(--port-border)] bg-[var(--ide-panel)]"
        label="credentials[]"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {certifications.map((cert) => (
            <a key={cert.name} href={cert.url} target="_blank" rel="noopener noreferrer">
              <Card className="hover:border-[var(--ide-accent)]">
                <div className="flex items-start gap-4">
                  <Award className="h-6 w-6 shrink-0 text-[var(--ide-function)]" />
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
