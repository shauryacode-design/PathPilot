import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Orbitron, Glory, Montserrat } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import { createMetadata, siteConfig } from "@/src/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-orbitron",
});

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const glory = Glory({
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseMetadata = createMetadata();

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.className} ${orbitron.className} ${glory.className} ${poppins.className}`}
      >
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
