import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Providers } from "@/components/Providers"
import { JsonLd } from "@/components/JsonLd"
import { organizationSchema } from "@/lib/metadata"

export const metadata: Metadata = {
  title: "ZAP - Interactive DSA Learning Platform",
  description: "Master Data Structures & Algorithms with interactive visualization, coding challenges, contests, and AI-guided learning paths.",
  keywords: ["DSA", "algorithms", "data structures", "coding", "competitive programming", "learning"],
  authors: [{ name: "ZAP Team" }],
  creator: "ZAP",
  metadataBase: new URL("https://codezap.in"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codezap.in",
    siteName: "ZAP - CodeZap.in",
    title: "ZAP - Interactive DSA Learning Platform",
    description: "Master Data Structures & Algorithms with interactive visualization, coding challenges, contests, and AI-guided learning paths.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ZAP - Interactive DSA Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZAP - Interactive DSA Learning Platform",
    description: "Master Data Structures & Algorithms with interactive visualization, coding challenges, contests, and AI-guided learning paths.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: {
    canonical: "https://codezap.in",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo-mark.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="color-scheme" content="light dark" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <JsonLd data={organizationSchema} />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
