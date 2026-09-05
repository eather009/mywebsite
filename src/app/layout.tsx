import type { Metadata } from "next";
import { JetBrains_Mono, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { getSiteConfig } from "@/lib/site-config";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();

  return {
    metadataBase: new URL(siteConfig.domain),
    title: {
      default: `${siteConfig.name} | ${siteConfig.title}`,
      template: `%s | ${siteConfig.shortName}`,
    },
    description: siteConfig.summary,
    keywords: [
      "Iftekhar Ahmed Eather",
      "Eather Ahmed",
      "Technical Lead",
      "Engineering Manager",
      "Senior System Engineer",
      "System Architecture",
      "AWS",
      "Alibaba Cloud",
      "Laravel",
      "Node.js",
      "Python",
      "Scrum",
      "CSPO",
      "CSM",
      "Export Japan",
      "Kyoto.travel",
      "Software Engineer Japan",
    ],
    authors: [{ name: siteConfig.name, url: siteConfig.linkedin }],
    creator: siteConfig.name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.domain,
      siteName: siteConfig.name,
      title: `${siteConfig.name} | ${siteConfig.title}`,
      description: siteConfig.tagline,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.tagline,
      creator: "@IftekharEather",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    alternates: {
      canonical: siteConfig.domain,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await getSiteConfig();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.domain,
    jobTitle: siteConfig.title,
    worksFor: {
      "@type": "Organization",
      name: "Export Japan Inc.",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Saitama",
      addressRegion: "Saitama",
      addressCountry: "JP",
    },
    sameAs: [siteConfig.linkedin, siteConfig.github, siteConfig.twitter],
    email: siteConfig.email,
    description: siteConfig.summary,
  };

  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${jetbrains.variable} h-full scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-[var(--port-bg)] font-sans text-[var(--port-fg)] antialiased">
        {children}
      </body>
    </html>
  );
}
