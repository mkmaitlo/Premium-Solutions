/**
 * HomeJsonLd — Homepage structured data (JSON-LD)
 *
 * Schema types used:
 * - Organization: brand entity for Knowledge Panel
 * - WebSite: enables Google Sitelinks Searchbox
 * - ItemList: list of subscription offerings for rich results
 *
 * Renders as a server component — zero JS overhead on the client.
 */
export function HomeJsonLd({ deals }: { deals: { name: string }[] }) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "https://premiumsolutions.store";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Premium Solutions",
    url: baseUrl,
    logo: `${baseUrl}/assets/images/logo.svg`,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      areaServed: "PK",
      availableLanguage: ["English", "Urdu"],
    },
    description:
      "Premium Solutions offers genuine subscription vouchers for LinkedIn, Canva, Spotify, Adobe Creative Cloud, ChatGPT Plus and 50+ more at up to 90% off the standard retail price.",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Premium Solutions",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/?query={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Premium Solutions",
    url: baseUrl,
    image: `${baseUrl}/og-image.png`,
    priceRange: "PKR 350 - PKR 20,000",
    areaServed: {
      "@type": "Country",
      name: "Pakistan",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Premium Subscriptions",
      itemListElement: deals.map((deal, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: {
          "@type": "Product",
          name: deal.name,
        },
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are the subscriptions genuine?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. All vouchers are sourced through our exclusive reseller network and are 100% genuine and working.",
        },
      },
      {
        "@type": "Question",
        name: "How quickly are subscriptions delivered?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Subscriptions are delivered digitally and instantly after purchase confirmation.",
        },
      },
      {
        "@type": "Question",
        name: "Which subscriptions are available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We offer 50+ premium subscriptions including LinkedIn Premium, Canva Pro, Spotify, Adobe Creative Cloud, ChatGPT Plus, YouTube Premium, NordVPN, Grammarly, and more.",
        },
      },
      {
        "@type": "Question",
        name: "How much can I save with Premium Solutions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Customers save up to 90% compared to retail prices. Our customers save an average of PKR 95,000 per year.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
