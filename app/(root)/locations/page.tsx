import { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { PK_CITIES } from "@/components/seo/LocalBusinessJsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://premiumsolutions.store";

export const metadata: Metadata = {
  title: "Premium Subscriptions Across Pakistan — All Cities",
  description:
    "Premium Solutions delivers genuine subscription vouchers for LinkedIn Premium, Canva Pro, Spotify, Adobe Creative Cloud and 50+ more across all major cities in Pakistan — Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad and more.",
  alternates: { canonical: `${BASE_URL}/locations` },
  openGraph: {
    title: "Premium Subscriptions Across Pakistan — All Cities",
    description:
      "Buy premium subscriptions at up to 90% off in Karachi, Lahore, Islamabad and every major city in Pakistan.",
    url: `${BASE_URL}/locations`,
    siteName: "Premium Solutions",
    locale: "en_PK",
    type: "website",
  },
};

export default function LocationsPage() {
  const locationSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Premium Solutions Service Areas in Pakistan",
    description: "Cities across Pakistan where Premium Solutions delivers subscriptions",
    itemListElement: PK_CITIES.map((city, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Premium Subscriptions in ${city.name}`,
      url: `${BASE_URL}/locations/${city.name.toLowerCase()}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
      />

      <div className="flex flex-col min-h-screen bg-background">
        {/* Blobs */}
        <div className="fixed top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-primary/8 blur-[120px] pointer-events-none -z-10" />
        <div className="fixed bottom-0 left-0 w-[40vw] h-[40vw] rounded-full bg-secondary/8 blur-[100px] pointer-events-none -z-10" />

        {/* Hero */}
        <section className="pt-32 pb-16 px-4 md:px-8">
          <div className="wrapper max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-background/80 backdrop-blur-md text-sm font-semibold text-primary">
              <MapPin className="w-4 h-4" />
              All of Pakistan
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
              We Deliver{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Across Pakistan
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl">
              Genuine subscription vouchers delivered instantly — no matter
              where you are in Pakistan. Select your city below to see
              locally-optimised pricing and deals.
            </p>
          </div>
        </section>

        {/* Cities Grid */}
        <section className="pb-24 px-4 md:px-8">
          <div className="wrapper max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PK_CITIES.map((city) => (
                <Link
                  key={city.name}
                  href={`/locations/${city.name.toLowerCase()}`}
                  className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {city.name}
                        </h2>
                      </div>
                      <p className="text-xs text-muted-foreground ml-10">
                        {city.region}, Pakistan
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 mt-2 flex-shrink-0" />
                  </div>

                  <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                    Browse LinkedIn Premium, Canva Pro, Spotify & 50+ more
                    subscriptions available in {city.name}.
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
