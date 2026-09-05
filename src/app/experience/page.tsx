import { ExternalLink } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { PageHero, Section, Card } from "@/components/ui";
import { experience } from "@/lib/data";

export default function ExperiencePage() {
  return (
    <PageLayout>
      <PageHero
        title="Experience"
        subtitle="Engineering management, system architecture, and delivery leadership across Japan and Bangladesh."
        label="Career"
      />

      <Section title="Work History" label="Roles">
        <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-[var(--port-border)] md:before:left-[15px]">
          {experience.map((job, index) => (
            <div
              key={`${job.company}-${job.role}-${job.period}`}
              className="relative pl-10 md:pl-12"
            >
              <div className="absolute left-0 top-1.5 h-[22px] w-[22px] rounded-full border-2 border-[var(--port-accent)] bg-[var(--port-bg)] md:h-[30px] md:w-[30px]" />
              <Card>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    {index === 0 && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--port-accent)]">
                        Current
                      </p>
                    )}
                    <h3 className="mt-1 text-xl font-semibold text-[var(--port-fg)]">{job.role}</h3>
                    {job.url ? (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-[var(--port-muted)] hover:text-[var(--port-accent)]"
                      >
                        {job.company}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <p className="mt-1 text-[var(--port-muted)]">{job.company}</p>
                    )}
                  </div>
                  <div className="shrink-0 text-sm text-[var(--port-muted)]">
                    <p>{job.period}</p>
                    <p>{job.location}</p>
                  </div>
                </div>
                <ul className="mt-5 space-y-2">
                  {job.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-[var(--port-muted)] before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-[var(--port-accent)] before:content-['']"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>
      </Section>
    </PageLayout>
  );
}
