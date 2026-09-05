import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { LinkedInIcon } from "@/components/icons";
import { PageLayout } from "@/components/PageLayout";
import { PageHero, Section, Card, Badge, ButtonPrimary } from "@/components/ui";
import { projects, siteConfig } from "@/lib/data";

export default function ProjectsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Projects"
        subtitle="Portfolio highlights across system architecture, cloud platforms, AI SaaS, and enterprise delivery."
        label="Portfolio"
      />

      <Section
        title="Portfolio Highlights"
        subtitle="Selected work spanning tourism platforms, AI products, government systems, and enterprise software."
        label="Selected Work"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.name}>
              <h3 className="text-xl font-semibold text-[var(--port-fg)]">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-[var(--port-accent)]"
                >
                  {project.name}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--port-muted)]">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <section className="border-t border-[var(--port-border)] bg-[var(--port-panel)] py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-[var(--port-muted)]">
            Full project history, certifications, and recommendations are on LinkedIn.
          </p>
          <ButtonPrimary
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6"
          >
            <LinkedInIcon className="h-5 w-5" />
            View Full Portfolio on LinkedIn
          </ButtonPrimary>
          <p className="mt-4 text-sm text-[var(--port-muted)]">
            Or browse{" "}
            <Link
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--port-accent)] hover:text-[var(--port-accent-hover)]"
            >
              linkedin.com/in/iftekhareather
            </Link>
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
