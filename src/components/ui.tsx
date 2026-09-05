import { ReactNode } from "react";

type SectionProps = {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  label?: string;
};

export function Section({
  id,
  title,
  subtitle,
  children,
  className = "",
  label,
}: SectionProps) {
  return (
    <section id={id} className={`py-20 md:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12">
          {label && <p className="section-label">{label}</p>}
          <h2 className="text-3xl font-bold tracking-tight text-[var(--port-fg)] md:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--port-muted)]">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

export function PageHero({
  title,
  subtitle,
  label,
}: {
  title: string;
  subtitle: string;
  label?: string;
}) {
  return (
    <div className="border-b border-[var(--port-border)] bg-[var(--port-hero-gradient)] py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        {label && <p className="section-label">{label}</p>}
        <h1 className="text-4xl font-bold tracking-tight text-[var(--port-fg)] md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[var(--port-muted)]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className="port-badge">{children}</span>;
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`port-card ${className}`}>{children}</div>;
}

export function ButtonPrimary({
  children,
  className = "",
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      className={`port-btn-primary focus:outline-none focus:ring-2 focus:ring-[var(--port-accent)] focus:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

export function ButtonSecondary({
  children,
  className = "",
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      className={`port-btn-secondary focus:outline-none focus:ring-2 focus:ring-[var(--port-accent)] focus:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
