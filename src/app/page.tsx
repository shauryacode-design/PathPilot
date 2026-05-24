import HomePage from "@/src/components/home-page";
import JsonLd from "@/src/components/json-ld";
import {
  createMetadata,
  getOrganizationJsonLd,
  getWebApplicationJsonLd,
  getWebsiteJsonLd,
  siteConfig,
} from "@/src/lib/seo";

export const metadata = createMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
  keywords: [
    ...siteConfig.keywords,
    "free career roadmap generator",
    "AI learning path for students",
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          getOrganizationJsonLd(),
          getWebApplicationJsonLd(),
          getWebsiteJsonLd(),
        ]}
      />
      <HomePage />
    </>
  );
}
