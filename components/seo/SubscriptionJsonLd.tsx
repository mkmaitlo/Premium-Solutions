/**
 * SubscriptionJsonLd — Per-listing structured data (JSON-LD)
 *
 * Schema types:
 * - Product: enables Price, Rating & Availability rich results in SERPs
 * - BreadcrumbList: shows breadcrumbs in Google search snippets
 *
 * This is a Server Component — injected at SSR time, zero client JS.
 */

interface SubscriptionJsonLdProps {
  subscription: {
    _id: string;
    title: string;
    description?: string;
    imageUrl: string;
    price: string;
    averageRating?: number;
    reviewCount?: number;
  };
}

export function SubscriptionJsonLd({ subscription }: SubscriptionJsonLdProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "https://premiumsolutions.store";
  const pageUrl = `${baseUrl}/subscriptions/${subscription._id}`;

  const priceValue =
    subscription.price === "Free" || subscription.price === "0"
      ? "0"
      : subscription.price.replace(/[^0-9.]/g, "") || "0";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: subscription.title,
    description:
      subscription.description ||
      `Get ${subscription.title} at up to 90% off the standard retail price. Genuine subscription voucher delivered instantly.`,
    image: subscription.imageUrl,
    url: pageUrl,
    brand: {
      "@type": "Brand",
      name: "Premium Solutions",
    },
    offers: {
      "@type": "Offer",
      url: pageUrl,
      priceCurrency: "PKR",
      price: priceValue,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Premium Solutions",
        url: baseUrl,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "PKR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "HUR",
          },
        },
      },
    },
    ...(subscription.averageRating && subscription.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: subscription.averageRating.toFixed(1),
            reviewCount: subscription.reviewCount,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Subscriptions",
        item: `${baseUrl}/#subscriptions`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: subscription.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
