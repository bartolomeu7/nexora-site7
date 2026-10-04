import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth/auth-provider";
import "./globals.css";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NEXORA GROUP — Building what comes next",
    template: "%s | NEXORA GROUP",
  },
  description: "NEXORA GROUP develops software, digital products, and technological experiences. Explore our projects, products, and innovations.",
  keywords: ["NEXORA GROUP", "software development", "digital products", "technology", "innovation", "engineering"],
  authors: [{ name: "NEXORA GROUP" }],
  creator: "NEXORA GROUP",
  publisher: "NEXORA GROUP",
  robots: {
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
    locale: "en_US",
    url: "https://nexora.group",
    siteName: "NEXORA GROUP",
    title: "NEXORA GROUP — Building what comes next",
    description: "NEXORA GROUP develops software, digital products, and technological experiences.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NEXORA GROUP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXORA GROUP — Building what comes next",
    description: "NEXORA GROUP develops software, digital products, and technological experiences.",
    images: ["/og-image.png"],
    creator: "@nexora_group",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0d0e14" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0e14" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}