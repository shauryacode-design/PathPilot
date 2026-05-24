import type { Metadata } from "next";
import { createMetadata } from "@/src/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Dashboard",
  description:
    "Track your personalized career roadmap, complete tasks, earn XP, and monitor progress toward your goal on PathPilot.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
