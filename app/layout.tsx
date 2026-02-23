import type { Metadata } from "next";
import { Poppins } from "next/font/google"
import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import NavigationSubscriptions from "@/components/shared/NavigationSubscriptions";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";

const poppins = Poppins({
  subsets:['latin'],
  weight:['400','500','600','700'],
  variable:'--font-poppins'
})

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://premiumsolutions.store";

export const metadata: Metadata = {
  // ── Title ────────────────────────────────────────────────────────────────
  // template: individual pages set `title` and it is injected into `%s`
  title: {
    default: "Premium Solutions — Up to 90% Off Premium Subscriptions in Pakistan",
    template: "%s | Premium Solutions",
  },

  // ── Description ──────────────────────────────────────────────────────────
  description:
    "Buy LinkedIn Premium, Canva Pro, Spotify, Adobe Creative Cloud, ChatGPT Plus, YouTube Premium and 50+ premium subscriptions at up to 90% off retail price. Genuine vouchers delivered instantly in Pakistan.",

  // ── Keywords ─────────────────────────────────────────────────────────────
  keywords: [
    "premium subscriptions Pakistan",
    "premium subscriptions store Pakistan",
    "LinkedIn Premium cheap Pakistan",
    "Canva Pro discount",
    "Spotify Premium Pakistan",
    "Adobe Creative Cloud discount",
    "ChatGPT Plus Pakistan",
    "YouTube Premium voucher",
    "subscription vouchers Pakistan",
    "cheap subscriptions",
    "premium software deals",
    "buy subscriptions online",
    "NordVPN cheap",
    "Grammarly Premium Pakistan",
    "Google One discount Pakistan",
    // Location keywords
    "premium subscriptions Karachi",
    "premium subscriptions Lahore",
    "premium subscriptions Islamabad",
    "subscription vouchers Karachi",
    "subscription vouchers Lahore",
    "buy subscriptions Pakistan online",
    "premiumsolutions.store",
  ],

  // ── Authors / Publisher ───────────────────────────────────────────────────
  authors: [{ name: "Premium Solutions", url: BASE_URL }],
  creator: "Premium Solutions",
  publisher: "Premium Solutions",

  // ── Canonical ─────────────────────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
  },

  // ── Open Graph ───────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: BASE_URL,
    siteName: "Premium Solutions",
    title: "Premium Solutions — Up to 90% Off Premium Subscriptions",
    description:
      "Genuine subscription vouchers for LinkedIn, Canva, Spotify, Adobe & 50+ more. Delivered instantly at up to 90% off.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Premium Solutions — Up to 90% Off Premium Subscriptions",
      },
    ],
  },

  // ── Twitter / X Card ─────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Premium Solutions — Up to 90% Off Premium Subscriptions",
    description:
      "Genuine subscription vouchers for LinkedIn, Canva, Spotify, Adobe & 50+ more. Delivered instantly at up to 90% off.",
    images: [`${BASE_URL}/og-image.png`],
    creator: "@PremiumSolutionsPK",
  },

  // ── Robots ───────────────────────────────────────────────────────────────
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

  // ── Icons ────────────────────────────────────────────────────────────────
  icons: {
    icon: "/assets/images/logo.svg",
    shortcut: "/assets/images/logo.svg",
    apple: "/assets/images/logo.svg",
  },

  // ── Manifest ─────────────────────────────────────────────────────────────
  manifest: "/manifest.webmanifest",

  // ── Verification (update with real codes from Google / Bing search console)
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
    other: {
      "msvalidate.01": process.env.BING_SITE_VERIFICATION || "",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (  
    <ClerkProvider appearance={{
      layout: {
        unsafe_disableDevelopmentModeWarnings: true,
      },
    }}
    >
    <html lang="en" suppressHydrationWarning>
      {/* Geo meta tags — Location SEO signals */}
      <head>
        <meta name="geo.region" content="PK" />
        <meta name="geo.country" content="Pakistan" />
        <meta name="geo.placename" content="Pakistan" />
        <meta name="ICBM" content="30.3753, 69.3451" />
        <meta name="geo.position" content="30.3753;69.3451" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
      </head>

      <body className={poppins.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          {/* LocalBusiness JSON-LD on every page */}
          <LocalBusinessJsonLd />
          <NavigationSubscriptions />
          {children}
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
