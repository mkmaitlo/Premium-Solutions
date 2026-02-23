import { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/database";
import Subscription from "@/lib/database/models/subscription.model";
import { PK_CITIES } from "@/components/seo/LocalBusinessJsonLd";

/**
 * sitemap.ts — Dynamic XML Sitemap
 *
 * SEO Strategy:
 * - Static pages get high priority
 * - Every subscription listing is included AUTOMATICALLY whenever it's created
 * - Correct changefreq and priority signals for Google's crawl budget
 * - lastModified dates help Google re-crawl updated pages faster
 *
 * This runs at request time (ISR-friendly), so new listings appear in the
 * sitemap immediately after they're created in the admin panel.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://premiumsolutions.store";
  const now = new Date();

  // ─── Static pages ────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#subscriptions`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/#testimonials`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  // ─── Dynamic subscription pages ──────────────────────────────────────────
  let subscriptionPages: MetadataRoute.Sitemap = [];

  try {
    await connectToDatabase();

    // Fetch minimal fields — only _id and updatedAt / createdAt
    const subscriptions = await Subscription.find(
      {},
      { _id: 1, updatedAt: 1, createdAt: 1, title: 1 }
    ).lean();

    subscriptionPages = subscriptions.map((sub: any) => ({
      url: `${baseUrl}/subscriptions/${sub._id.toString()}`,
      lastModified: sub.updatedAt || sub.createdAt || now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("[sitemap] Failed to fetch subscriptions:", error);
  }

  // ─── Location pages (one per Pakistani city) ──────────────────────────────
  const locationPages: MetadataRoute.Sitemap = [
    // Index page
    {
      url: `${baseUrl}/locations`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    // Each city page
    ...PK_CITIES.map((city) => ({
      url: `${baseUrl}/locations/${city.name.toLowerCase()}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
  ];

  return [...staticPages, ...locationPages, ...subscriptionPages];
}
