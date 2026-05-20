import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Orbitron, Glory, Montserrat } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs'
import { Poppins } from 'next/font/google';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700'], // Orbitron supports weights like 400, 500, 600, 700, 800, 900
  variable: '--font-orbitron', // Optional: for use with Tailwind CSS
});

const poppins = Poppins({
  weight: ['400', '700'], // Specify required weights
  subsets: ['latin'],      // Recommended for performance
  variable: '--font-poppins', // Use if integrating with Tailwind/CSS
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'], // Optional: Specify weights if not using a variable font
  display: 'swap',
})

const glory = Glory({
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PathPilot",
  description: "Modern AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${montserrat.className} ${orbitron.className} ${glory.className} {poppins.className}`} >
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
