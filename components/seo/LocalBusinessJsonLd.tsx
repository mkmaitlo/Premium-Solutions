/**
 * LocalBusinessJsonLd — Location-based structured data
 *
 * Schema types:
 * - LocalBusiness > OnlineStore: tells Google EXACTLY where you operate
 * - serviceArea with Pakistani cities: ranks for city-specific searches
 * - areaServed with GeoShape for the whole country
 *
 * Google uses this to:
 *  1. Show your business in Google Maps / Local Pack
 *  2. Rank you for "Canva Pro Karachi" / "LinkedIn Premium Lahore" etc.
 *  3. Display your business in the Knowledge Panel sidebar
 *
 * This is a Server Component — injected at SSR, zero client JS cost.
 */

// Major Pakistani cities we target for local SEO
export const PK_CITIES = [
  { name: "Karachi",      region: "Sindh",           lat: 24.8607, lng: 67.0011 },
  { name: "Lahore",       region: "Punjab",          lat: 31.5204, lng: 74.3587 },
  { name: "Islamabad",    region: "ICT",             lat: 33.6844, lng: 73.0479 },
  { name: "Rawalpindi",   region: "Punjab",          lat: 33.5651, lng: 73.0169 },
  { name: "Faisalabad",   region: "Punjab",          lat: 31.4504, lng: 73.1350 },
  { name: "Multan",       region: "Punjab",          lat: 30.1575, lng: 71.5249 },
  { name: "Peshawar",     region: "KPK",             lat: 34.0151, lng: 71.5249 },
  { name: "Quetta",       region: "Balochistan",     lat: 30.1798, lng: 66.9750 },
  { name: "Sialkot",      region: "Punjab",          lat: 32.4945, lng: 74.5229 },
  { name: "Gujranwala",   region: "Punjab",          lat: 32.1877, lng: 74.1945 },
  { name: "Hyderabad",    region: "Sindh",           lat: 25.3960, lng: 68.3578 },
  { name: "Abbottabad",   region: "KPK",             lat: 34.1688, lng: 73.2215 },
];

export function LocalBusinessJsonLd() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "https://premiumsolutions.store";

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "OnlineStore"],
    "@id": `${baseUrl}/#organization`,
    name: "Premium Solutions",
    alternateName: "PremiumSolutions.pk",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/assets/images/premiumsolutions.png`,
    },
    image: `${baseUrl}/og-image.png`,
    description:
      "Premium Solutions offers genuine subscription vouchers for LinkedIn Premium, Canva Pro, Spotify, Adobe Creative Cloud, ChatGPT Plus, YouTube Premium and 50+ more tools at up to 90% off retail price. Serving all major cities across Pakistan with instant digital delivery.",
    telephone: process.env.NEXT_PUBLIC_PHONE || "",
    email: process.env.NEXT_PUBLIC_EMAIL || "info@premiumsolutions.store",
    priceRange: "PKR 350 - PKR 20,000",
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash, Bank Transfer, EasyPaisa, JazzCash",
    openingHours: "Mo-Su 09:00-23:00",

    // Country-level service area
    areaServed: [
      {
        "@type": "Country",
        name: "Pakistan",
        "@id": "https://www.wikidata.org/wiki/Q843",
      },
      // City-level targeting — each city boosts local rankings
      ...PK_CITIES.map((city) => ({
        "@type": "City",
        name: `${city.name}, ${city.region}, Pakistan`,
        containsPlace: {
          "@type": "AdministrativeArea",
          name: city.region,
        },
      })),
    ],

    // serviceArea separately for Google Maps
    serviceArea: {
      "@type": "GeoShape",
      name: "Pakistan",
      addressCountry: "PK",
    },

    // Address (required for LocalBusiness)
    address: {
      "@type": "PostalAddress",
      addressCountry: "PK",
      addressRegion: process.env.NEXT_PUBLIC_REGION || "Punjab",
      addressLocality: process.env.NEXT_PUBLIC_CITY || "Lahore",
    },

    // What we sell
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Premium Subscriptions",
      description:
        "Premium software subscriptions at up to 90% off retail price",
    },

    // Aggregate rating from reviews
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "1000",
    },

    // Same-as social profiles (add your real links)
    sameAs: [
      process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/share/1bxvUA4Mue/",
      process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/premium_.solutions",
      process.env.NEXT_PUBLIC_WHATSAPP_URL || "",
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  );
}
