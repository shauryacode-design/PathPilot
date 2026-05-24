import type { Metadata } from "next";

const siteName = "PathPilot";

const defaultDescription =
  "PathPilot is an AI-powered career roadmap generator for students. Get a personalized step-by-step learning path based on your skills, interests, and goals — track tasks, earn XP, and land your dream role.";

const defaultKeywords = [
  "PathPilot",
  "career roadmap",
  "student career planning",
  "AI career coach",
  "personalized learning path",
  "internship preparation",
  "skill roadmap",
  "career goals for students",
  "step-by-step career guide",
  "job search for students",
];

function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export const siteConfig = {
  name: siteName,
  title: `${siteName} — AI Career Roadmaps for Students`,
  description: defaultDescription,
  url: getSiteUrl(),
  ogImagePath: "/opengraph-image",
  twitterHandle: "@pathpilot",
  locale: "en_US",
  keywords: defaultKeywords,
  authors: [{ name: siteName, url: getSiteUrl() }],
  creator: siteName,
  publisher: siteName,
} as const;

type PageSeoOptions = {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function createMetadata(options: PageSeoOptions = {}): Metadata {
  const title = options.title ?? siteConfig.title;
  const description = options.description ?? siteConfig.description;
  const canonicalPath = options.path ?? "/";
  const canonicalUrl = `${siteConfig.url}${canonicalPath === "/" ? "" : canonicalPath}`;
  const keywords = options.keywords ?? [...siteConfig.keywords];
  const noIndex = options.noIndex ?? false;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    keywords,
    authors: [...siteConfig.authors],
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    applicationName: siteConfig.name,
    category: "education",
    alternates: {
      canonical: canonicalPath,
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonicalUrl,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: siteConfig.ogImagePath,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — personalized AI career roadmaps for students`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImagePath],
      creator: siteConfig.twitterHandle,
    },
    icons: {
      icon: [{ url: "/icon", type: "image/png" }],
      apple: [{ url: "/apple-icon", type: "image/png" }],
    },
    manifest: "/manifest.webmanifest",
    other: {
      "apple-mobile-web-app-title": siteConfig.name,
      "mobile-web-app-capable": "yes",
    },
  };
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon`,
    description: siteConfig.description,
    sameAs: [],
  };
}

export function getWebApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
  };
}

export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
}
