import { MetadataRoute } from "next";

/**
 * robots.ts — Dynamic Robots.txt
 *
 * SEO Strategy:
 * - Allow all major search engine bots
 * - Block admin, API, auth pages from indexing (they add no SEO value)
 * - Block search/filter result pages to avoid duplicate content
 * - Reference sitemap so Google finds all pages immediately
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://premiumsolutions.store";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/",
          "/*?page=",    // Paginated duplicates — pass-through via canonical instead
        ],
      },
      {
        // Bing explicitly
        userAgent: "Bingbot",
        allow: ["/"],
        disallow: ["/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
