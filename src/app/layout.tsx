import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DM_Sans,
  Syncopate,
} from "next/font/google";
import { isAuthEnabled } from "@/lib/auth-config";
import { ClerkRootProvider } from "@/components/clerk-root-provider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const syncopate = Syncopate({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Yas Beauty Allure — Professional Nano Pigments",
    template: "%s | Yas Beauty Allure",
  },
  description:
    "Shop semi-permanent lip and brow nano pigments, plus post-procedure aftercare. Professional PMU supplies from Abuja's Yas Beauty Allure.",
  openGraph: {
    title: "Yas Beauty Allure",
    description: "Professional nano pigments & aftercare for PMU artists.",
    siteName: "Yas Beauty Allure",
    type: "website",
    locale: "en_NG",
    images: [
      {
        url: "/hero/collection-lips-v2.jpg",
        width: 1600,
        height: 1000,
        alt: "Yas Beauty Allure pigments",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yas Beauty Allure",
    description: "Professional nano pigments & aftercare for PMU artists.",
    images: ["/hero/collection-lips-v2.jpg"],
  },
  icons: { icon: "/brand/yba-logo.png", apple: "/brand/yba-logo.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const authOn = isAuthEnabled();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${dmSans.variable} ${cormorant.variable} ${syncopate.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        {authOn ? (
          <ClerkRootProvider>{children}</ClerkRootProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
