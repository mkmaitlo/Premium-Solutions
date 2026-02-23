import { Suspense } from "react";
import { Metadata } from "next";
import { SearchParamProps } from "@/types";
import { ReviewsCarousel } from "@/components/shared/ReviewsCarousel";
import ReviewsCarouselSkeleton from "@/components/shared/ReviewsCarouselSkeleton";
import { HeroDealsPanel } from "@/components/shared/HeroDealsPanel";
import HeroDealsSkeleton from "@/components/shared/HeroDealsSkeleton";
import { FeaturesSection } from "@/components/shared/FeaturesSection";
import { CTASection } from "@/components/shared/CTASection";
import SubscriptionsFeed from "@/components/shared/SubscriptionsFeed";
import CollectionSkeleton from "@/components/shared/CollectionSkeleton";
import Search from "@/components/shared/Search";
import { HeroSection } from "@/components/shared/HeroSection";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { getAllDeals } from "@/lib/actions/deal.actions";

// ── Page-level metadata (inherits template from root layout) ──────────────────
export const metadata: Metadata = {
  title: "Up to 90% Off Premium Subscriptions in Pakistan",
  description:
    "Buy LinkedIn Premium, Canva Pro, Spotify, Adobe Creative Cloud, ChatGPT Plus, YouTube Premium and 50+ subscriptions at up to 90% off. Genuine vouchers in Pakistan, instant delivery.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SERVER_URL || "https://premiumsolutions.store",
  },
};

/**
 * Home page — Next.js App Router streaming architecture
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │ Static shell streams instantly (0 DB calls blocked)     │
 * │  • Header (layout.tsx)                                  │
 * │  • Hero text/CTA/ticker (HeroSection – no deals prop)   │
 * │  • Features section                                     │
 * │  • Section headlines                                     │
 * │  • CTA banner                                           │
 * │  • Footer (layout.tsx)                                  │
 * ├─────────────────────────────────────────────────────────┤
 * │ Three independent Suspense boundaries stream in         │
 * │ parallel while user sees skeletons:                     │
 * │  1. Hero deals card  ← getAllDeals()                    │
 * │  2. Subscription grid ← getAllSubscriptions()           │
 * │  3. Reviews carousel ← getLatestReviews()              │
 * └─────────────────────────────────────────────────────────┘
 */
export default async function Home({ searchParams }: SearchParamProps) {
  const resolvedSearchParams = await searchParams;

  const page = Number(resolvedSearchParams?.page) || 1;
  const searchText = (resolvedSearchParams?.query as string) || "";
  const category = (resolvedSearchParams?.category as string) || "";

  // Lightweight fetch for JSON-LD structured data only (cached)
  const deals = await getAllDeals();

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── JSON-LD Structured Data (injected server-side, 0 client JS) */}
      <HomeJsonLd deals={deals} />

      {/* ── 1. HERO ──────────────────────────────────────────────
          Static hero text renders instantly (no DB wait).
          HeroDealsPanel streams in the deals card separately.
      ───────────────────────────────────────────────────────── */}
      <Suspense fallback={<HeroSection deals={[]} />}>
        <HeroDealsPanel />
      </Suspense>

      {/* ── 2. FEATURES ─────────────────────────────────────────
          Fully static — renders from the initial HTML payload.
      ───────────────────────────────────────────────────────── */}
      <div id="services">
        <FeaturesSection />
      </div>

      {/* ── 3. SUBSCRIPTIONS ────────────────────────────────────
          Section heading + search render instantly.
          Only the card grid is behind Suspense.
      ───────────────────────────────────────────────────────── */}
      <section id="subscriptions" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-background" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="wrapper flex flex-col gap-10">
          {/* Static section header — no DB needed */}
          <div className="flex flex-col gap-3 max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary dark:text-primary">
              Premium Deals
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              Browse Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Subscriptions
              </span>
            </h2>
            <p className="text-muted-foreground">
              Choose from 50+ top-tier platforms — LinkedIn, Canva, Adobe, Spotify, and many more — all at up to 90% off the standard retail price.
            </p>
          </div>

          {/* Static search + filters */}
          <Search />

          <div className="w-full h-px bg-muted" />

          {/* Only this grid is deferred */}
          <Suspense fallback={<CollectionSkeleton />}>
            <SubscriptionsFeed
              query={searchText}
              category={category}
              page={page}
              limit={6}
            />
          </Suspense>
        </div>
      </section>

      {/* ── 4. TESTIMONIALS ─────────────────────────────────────
          Section heading renders instantly.
          Carousel data streams in separately.
      ───────────────────────────────────────────────────────── */}
      <section
        id="testimonials"
        className="relative py-28 overflow-hidden bg-background"
      >
        {/* Static background decorations */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[35vw] h-[35vw] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* Static heading */}
        <div className="wrapper text-center mb-16 relative z-10">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary dark:text-primary mb-4">
            Customer Stories
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 relative inline-block">
            Real Savings, Real People
            <span className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto mt-6">
            Don&apos;t just take our word for it — hear from thousands of customers who slashed their subscription bills without sacrificing a single feature.
          </p>
        </div>

        {/* Only the carousel data is deferred */}
        <Suspense fallback={<ReviewsCarouselSkeleton />}>
          <ReviewsCarousel />
        </Suspense>
      </section>

      {/* ── 5. CTA ──────────────────────────────────────────────
          Fully static — renders from the initial HTML payload.
      ───────────────────────────────────────────────────────── */}
      <CTASection />
    </div>
  );
}
