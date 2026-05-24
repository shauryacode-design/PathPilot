import type { MetadataRoute } from "next";
import { siteConfig } from "@/src/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#06040a",
    theme_color: "#7c3aed",
    orientation: "portrait-primary",
    categories: ["education", "productivity"],
    lang: "en-US",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
