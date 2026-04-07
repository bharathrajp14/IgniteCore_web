import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans, DM_Serif_Display, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { BRAND } from "@/lib/siteContent";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ignitecoreai.tech"),
  title: "IgniteCore Solutions | AI Automation and Web Solutions for Growth Teams",
  description:
    "IgniteCore Solutions builds AI automation systems, modern websites, and practical digital tools for growth-focused businesses.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/mark.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "IgniteCore Solutions | AI Automation and Web Solutions",
    description:
      "Practical automation, conversion-focused websites, and digital systems built for scalable growth.",
    url: "https://ignitecoreai.tech",
    siteName: "IgniteCore Solutions",
    type: "website",
  },
  keywords: [
    "AI automation for growth teams",
    "business websites that convert",
    "web development for startups",
    "WhatsApp automation for businesses",
    "AI tools for teams",
    "business automation services",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BRAND.company,
    founder: BRAND.founder,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dindigul",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    telephone: BRAND.phone,
    email: BRAND.email,
    url: `https://${BRAND.domain}`,
    areaServed: ["Global"],
    sameAs: [BRAND.github, BRAND.linkedin],
  };

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full bg-[var(--color-cream)] text-[var(--color-deep-navy)]">
        <Script
          id="ga-script"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID || ""}`}
        />
        <Script id="ga-inline" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID || ""}');`}
        </Script>
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <ChatbotWidget />
        <WhatsAppFloat />
        <Analytics />
      </body>
    </html>
  );
}
