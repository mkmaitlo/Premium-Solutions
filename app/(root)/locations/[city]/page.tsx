import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PK_CITIES } from "@/components/seo/LocalBusinessJsonLd";
import SubscriptionsFeed from "@/components/shared/SubscriptionsFeed";
import CollectionSkeleton from "@/components/shared/CollectionSkeleton";
import { CTASection } from "@/components/shared/CTASection";
import { MapPin, Zap, ShieldCheck, Truck, Star } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://premiumsolutions.store";

// ─── Static Params: pre-render one page per Pakistani city ───────────────────
export function generateStaticParams() {
  return PK_CITIES.map((city) => ({
    city: city.name.toLowerCase(),
  }));
}

export const revalidate = 86400;
export const dynamicParams = false; // only allow known cities

// ─── Dynamic Metadata per city ───────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = PK_CITIES.find((c) => c.name.toLowerCase() === citySlug);
  if (!city) return {};

  const title = `Premium Subscriptions in ${city.name} — Up to 90% Off`;
  const description = `Buy LinkedIn Premium, Canva Pro, Spotify, Adobe CC, ChatGPT Plus and 50+ more subscriptions in ${city.name} at up to 90% off. Genuine vouchers with instant delivery. Trusted by thousands in ${city.region}, Pakistan.`;
  const pageUrl = `${BASE_URL}/locations/${citySlug}`;

  return {
    title,
    description,
    keywords: [
      `premium subscriptions ${city.name}`,
      `LinkedIn Premium ${city.name}`,
      `Canva Pro ${city.name}`,
      `Spotify Premium ${city.name}`,
      `Adobe CC ${city.name}`,
      `ChatGPT Plus ${city.name}`,
      `buy subscriptions ${city.name}`,
      `cheap subscriptions ${city.region}`,
      `subscription vouchers ${city.name} Pakistan`,
      `software deals ${city.name}`,
    ],
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "website",
      url: pageUrl,
      title,
      description,
      siteName: "Premium Solutions",
      locale: "en_PK",
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `Premium Subscriptions in ${city.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const city = PK_CITIES.find((c) => c.name.toLowerCase() === citySlug);
  if (!city) notFound();

  // City-specific JSON-LD
  const citySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Premium Subscriptions in ${city.name}`,
    description: `Buy LinkedIn Premium, Canva Pro, Spotify, Adobe CC and 50+ subscriptions at up to 90% off in ${city.name}, Pakistan.`,
    url: `${BASE_URL}/locations/${citySlug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Locations", item: `${BASE_URL}/locations` },
        { "@type": "ListItem", position: 3, name: city.name, item: `${BASE_URL}/locations/${citySlug}` },
      ],
    },
    provider: {
      "@type": "LocalBusiness",
      name: "Premium Solutions",
      url: BASE_URL,
      areaServed: {
        "@type": "City",
        name: `${city.name}, Pakistan`,
      },
    },
  };

  const TRUST_ITEMS = [
    { icon: ShieldCheck, text: "100% Genuine Vouchers" },
    { icon: Zap, text: "Instant Digital Delivery" },
    { icon: Truck, text: `Available in ${city.name}` },
    { icon: Star, text: "4.9/5 Customer Rating" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(citySchema) }}
      />

      <div className="flex flex-col min-h-screen">
        {/* ── Hero Banner ─────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-32 pb-20 px-4 md:px-8 bg-background">
          {/* Blobs */}
          <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-[-5%] w-[35vw] h-[35vw] rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />

          <div className="wrapper max-w-4xl mx-auto relative z-10 text-center flex flex-col items-center gap-6">
            {/* Location pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-background/80 backdrop-blur-md text-sm font-semibold text-primary">
              <MapPin className="w-4 h-4" />
              Serving {city.name}, {city.region}
            </div>

            {/* H1 — keyword: "Premium Subscriptions + city name" */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
              Premium Subscriptions{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                in {city.name}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Buy LinkedIn Premium, Canva Pro, Spotify, Adobe Creative Cloud,
              ChatGPT Plus and 50+ more premium tools in{" "}
              <strong>{city.name}</strong> at <strong>up to 90% off</strong>{" "}
              the standard retail price. Genuine vouchers, instant delivery.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {TRUST_ITEMS.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 bg-card/50 text-xs font-medium text-muted-foreground"
                >
                  <Icon className="w-3.5 h-3.5 text-primary" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── All Subscriptions ────────────────────────────────── */}
        <section className="relative py-20 px-4 md:px-8 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="wrapper flex flex-col gap-10 max-w-7xl mx-auto">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary">
                Available in {city.name}
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
                Browse All{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Subscriptions
                </span>
              </h2>
              <p className="text-muted-foreground max-w-xl">
                All listed subscriptions are available for delivery in{" "}
                {city.name} and across {city.region}. Vouchers are delivered
                digitally — no shipping required.
              </p>
            </div>

            <Suspense fallback={<CollectionSkeleton />}>
              <SubscriptionsFeed query="" category="" page={1} limit={12} />
            </Suspense>
          </div>
        </section>

        {/* ── City Info Section (keyword-rich content) ─────────── */}
        <section className="py-20 px-4 md:px-8 bg-card/30 border-y border-border/50">
          <div className="wrapper max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Why Choose Premium Solutions in {city.name}?
                </h2>
                <div className="flex flex-col gap-3 text-muted-foreground text-sm leading-relaxed">
                  <p>
                    Premium Solutions is Pakistan&apos;s leading digital
                    subscription reseller, trusted by thousands of customers
                    across {city.name}, {city.region}, and all major cities in
                    Pakistan.
                  </p>
                  <p>
                    Whether you&apos;re a student, freelancer, designer or
                    business in {city.name} — we offer genuine voucher codes for
                    LinkedIn Premium, Canva Pro, Spotify, Adobe Creative Cloud,
                    ChatGPT Plus, YouTube Premium, NordVPN, Grammarly, and 50+
                    more tools at prices 90% below retail.
                  </p>
                  <p>
                    All subscriptions are delivered digitally within minutes —
                    no physical delivery, no waiting. Customers in{" "}
                    {city.name} receive their activation details directly and
                    securely.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Frequently Asked in {city.name}
                </h2>
                <div className="flex flex-col gap-4">
                  {[
                    {
                      q: `Can I buy subscriptions from ${city.name}?`,
                      a: `Yes! We serve all of ${city.region} including ${city.name}. Vouchers are delivered digitally so location doesn't matter — you get it instantly.`,
                    },
                    {
                      q: "Is payment available in PKR?",
                      a: "Yes, all prices are in Pakistani Rupees (PKR). We accept EasyPaisa, JazzCash, bank transfer and other local payment methods.",
                    },
                    {
                      q: "Are the subscriptions genuine?",
                      a: "100%. All vouchers are sourced through our verified reseller network and are guaranteed to work.",
                    },
                  ].map(({ q, a }) => (
                    <details
                      key={q}
                      className="rounded-xl border border-border/50 bg-card/60 p-4 group cursor-pointer"
                    >
                      <summary className="font-semibold text-sm text-foreground list-none flex items-center justify-between gap-2">
                        {q}
                        <span className="text-primary text-lg group-open:rotate-45 transition-transform duration-200">+</span>
                      </summary>
                      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                        {a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Other Cities ─────────────────────────────────────── */}
        <section className="py-16 px-4 md:px-8">
          <div className="wrapper max-w-4xl mx-auto text-center flex flex-col gap-8">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-2">
                Other Locations
              </p>
              <h2 className="text-2xl font-bold text-foreground">
                We Also Serve These Cities
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {PK_CITIES.filter((c) => c.name !== city.name).map((c) => (
                <Link
                  key={c.name}
                  href={`/locations/${c.name.toLowerCase()}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border/50 bg-card/50 text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </div>
    </>
  );
}
