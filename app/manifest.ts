import { MetadataRoute } from "next";

/**
 * manifest.ts — Web App Manifest
 * Helps Google treat the site as a PWA and may improve rankings.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Premium Solutions — Up to 90% Off Premium Subscriptions",
    short_name: "PremiumSolutions",
    description:
      "Buy LinkedIn Premium, Canva Pro, Spotify, Adobe CC, ChatGPT Plus and 50+ more subscriptions at up to 90% off retail price. Genuine vouchers delivered instantly.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7c3aed",
    icons: [
      {
        src: "/assets/images/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
