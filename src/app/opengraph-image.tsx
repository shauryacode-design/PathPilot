import { ImageResponse } from "next/og";
import { siteConfig } from "@/src/lib/seo";

export const alt = `${siteConfig.name} — AI career roadmaps for students`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "72px",
          background:
            "linear-gradient(135deg, #1a0a2e 0%, #4c1d95 45%, #7c3aed 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#d8b4fe",
            marginBottom: 24,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: 900,
            marginBottom: 28,
          }}
        >
          Know Your Goal. Now Find The Path.
        </div>
        <div
          style={{
            fontSize: 28,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.88)",
            maxWidth: 820,
          }}
        >
          AI-powered personalized career roadmaps for students — skills, tasks,
          progress tracking, and job-ready guidance.
        </div>
      </div>
    ),
    { ...size }
  );
}
