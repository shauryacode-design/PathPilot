import type { Metadata } from "next";
import { createMetadata } from "@/src/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Create Your Roadmap",
  description:
    "Tell PathPilot about your skills, interests, and career goals to generate a personalized AI-powered learning roadmap.",
  path: "/onboarding",
  noIndex: true,
});

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
