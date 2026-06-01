import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: `${siteConfig.name} | ${siteConfig.title}`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.summary,
  keywords: [
    "Iftekhar Ahmed Eather",
    "Eather Ahmed",
    "Team Lead",
    "System Engineer",
    "PHP Developer",
    "Laravel",
    "Node.js",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} h-full scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--port-bg)] font-mono text-[var(--port-fg)] antialiased">
        {children}
      </body>
    </html>
  );
}
