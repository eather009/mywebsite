import Link from "next/link";
import {
  ArrowRight,
  Award,
  Briefcase,
  Cloud,
  Mail,
  MapPin,
} from "lucide-react";
import { LinkedInIcon } from "@/components/icons";
import { PageLayout } from "@/components/PageLayout";
import { Section, Card, Badge, ButtonPrimary, ButtonSecondary } from "@/components/ui";
import { AvailabilityBadge, AvailabilityMessage } from "@/components/AvailabilityBadge";
import {
  stats,
  certifications,
  experience,
  featuredProjects,
  recommendations,
  skills,
} from "@/lib/data";
import { getPublishedPosts, getSiteSettings } from "@/lib/content";
import { getSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [recentPosts, settings, siteConfig] = await Promise.all([
    getPublishedPosts(),
    getSiteSettings(),
    getSiteConfig(),
  ]);

  const posts = recentPosts.slice(0, 3);

  return (
    <PageLayout>
      <section className="portfolio-hero border-b border-[var(--port-border)]">
        <div className="portfolio-hero-inner portfolio-hero-inner-full">
          <AvailabilityBadge settings={settings} />
          <AvailabilityMessage settings={settings} />

          <p className="portfolio-greeting mt-6">Engineering Manager · Export Japan Inc.</p>
          <h1 className="portfolio-name">{siteConfig.name}</h1>
          <p className="portfolio-role">{siteConfig.title}</p>
          <p className="portfolio-intro mt-6 text-lg leading-relaxed text-[var(--port-muted)]">
            {siteConfig.summary}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonPrimary
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon className="h-5 w-5" />
              View LinkedIn
            </ButtonPrimary>
            <ButtonSecondary href="/contact">
              <Mail className="h-5 w-5" />
              Get in Touch
            </ButtonSecondary>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-[var(--port-muted)]">
            <MapPin className="h-4 w-4 text-[var(--port-accent)]" aria-hidden="true" />
            {siteConfig.location}
          </div>
        </div>
      </section>

      <Section
        id="recruiters"
        label="01 — Overview"
        title="For Recruiters & Hiring Managers"
        subtitle="Technical leadership, system architecture, and cloud delivery for enterprise and SaaS platforms."
      >
        <div className="mb-10 grid grid-cols-2 gap-6 border-b border-[var(--port-border)] pb-10 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="portfolio-stat-value">{stat.value}</p>
              <p className="portfolio-stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <Briefcase className="h-8 w-8 text-[var(--port-accent)]" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-semibold text-[var(--port-fg)]">Technical Leadership</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--port-muted)]">
              Engineering Manager at Export Japan Inc. — leading cross-functional Scrum teams,
              code reviews, delivery governance, and stakeholder alignment.
            </p>
          </Card>
          <Card>
            <Cloud className="h-8 w-8 text-[var(--port-accent)]" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-semibold text-[var(--port-fg)]">System Architecture & Cloud</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--port-muted)]">
              Designing secure, scalable architectures on AWS and Alibaba Cloud for high-traffic
              tourism and enterprise platforms.
            </p>
          </Card>
          <Card>
            <Award className="h-8 w-8 text-[var(--port-accent)]" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-semibold text-[var(--port-fg)]">Certified Agile Leader</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--port-muted)]">
              CSPO, CSM, A-CSD, and CSD certified. Proven track record improving sprint
              predictability, release quality, and engineering practices.
            </p>
          </Card>
        </div>
      </Section>

      <Section
        label="02 — Experience"
        title="Recent Experience"
        subtitle="Leadership and system engineering roles across Japan and Bangladesh."
        className="bg-[var(--port-panel)]"
      >
        <div className="space-y-6">
          {experience.slice(0, 2).map((job) => (
            <Card key={`${job.company}-${job.role}-${job.period}`}>
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--port-fg)]">{job.role}</h3>
                  <p className="font-medium text-[var(--port-accent)]">{job.company}</p>
                </div>
                <div className="text-sm text-[var(--port-muted)]">
                  <p>{job.period}</p>
                  <p>{job.location}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {job.highlights.slice(0, 2).map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-[var(--port-muted)] before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-[var(--port-accent)] before:content-['']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <Link
          href="/experience"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--port-accent)] hover:text-[var(--port-accent-hover)]"
        >
          View full experience <ArrowRight className="h-4 w-4" />
        </Link>
      </Section>

      <Section
        label="03 — Portfolio"
        title="Portfolio Highlights"
        subtitle="Architecture-led platforms across tourism, AI SaaS, and enterprise systems."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <Card key={project.name}>
              <h3 className="text-lg font-semibold text-[var(--port-fg)]">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--port-accent)]"
                >
                  {project.name}
                </a>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--port-muted)]">
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
        <Link
          href="/projects"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--port-accent)] hover:text-[var(--port-accent-hover)]"
        >
          View all projects <ArrowRight className="h-4 w-4" />
        </Link>
      </Section>

      <Section
        label="04 — Skills"
        title="Skills & Expertise"
        subtitle="Leadership, system architecture, cloud, and full-stack engineering."
        className="bg-[var(--port-panel)]"
      >
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
        label="05 — Recommendations"
        title="LinkedIn Recommendations"
        subtitle="Feedback from colleagues on leadership, architecture, and delivery."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {recommendations.map((rec) => (
            <Card key={rec.name}>
              <p className="text-sm italic leading-relaxed text-[var(--port-muted)]">
                &ldquo;{rec.quote}&rdquo;
              </p>
              <div className="mt-4 border-t border-[var(--port-border)] pt-4">
                <p className="font-semibold text-[var(--port-fg)]">{rec.name}</p>
                <p className="text-sm text-[var(--port-muted)]">{rec.title}</p>
                <a
                  href={rec.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-[var(--port-accent)] hover:text-[var(--port-accent-hover)]"
                >
                  <LinkedInIcon className="h-3 w-3" /> View on LinkedIn
                </a>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        label="06 — Credentials"
        title="Certifications"
        subtitle="Scrum Alliance credentials validating agile leadership."
        className="bg-[var(--port-panel)]"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {certifications.map((cert) => (
            <a key={cert.name} href={cert.url} target="_blank" rel="noopener noreferrer">
              <Card className="hover:border-[var(--port-accent)]/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-[var(--port-fg)]">{cert.name}</h3>
                    <p className="mt-1 text-sm text-[var(--port-muted)]">
                      {cert.issuer} · {cert.year}
                    </p>
                  </div>
                  <Award className="h-5 w-5 shrink-0 text-[var(--port-accent)]" aria-hidden="true" />
                </div>
              </Card>
            </a>
          ))}
        </div>
      </Section>

      {posts.length > 0 && (
        <Section
          label="07 — Blog"
          title="Latest from the Blog"
          subtitle="Notes on engineering leadership, cloud, and delivery."
        >
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="h-full hover:border-[var(--port-accent)]/30">
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt=""
                      className="mb-4 h-40 w-full rounded-lg object-cover"
                    />
                  )}
                  <time className="text-xs text-[var(--port-muted)]">
                    {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h3 className="mt-2 font-semibold text-[var(--port-fg)]">{post.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-[var(--port-muted)]">{post.description}</p>
                  <p className="mt-4 text-xs text-[var(--port-muted)]">{post.readingTime}</p>
                </Card>
              </Link>
            ))}
          </div>
          <Link
            href="/blog"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--port-accent)] hover:text-[var(--port-accent-hover)]"
          >
            Read all articles <ArrowRight className="h-4 w-4" />
          </Link>
        </Section>
      )}

      <section className="border-t border-[var(--port-border)] bg-[var(--port-surface)] py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="section-label">Get in Touch</p>
          <h2 className="text-3xl font-bold text-[var(--port-fg)] md:text-4xl">
            Interested in working together?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--port-muted)]">
            Open to Technical Lead, Engineering Manager, and Senior System Engineer roles.
            Connect on LinkedIn or reach out directly.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ButtonPrimary
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon className="h-5 w-5" />
              Connect on LinkedIn
            </ButtonPrimary>
            <ButtonSecondary href="/contact">Get in Touch</ButtonSecondary>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
