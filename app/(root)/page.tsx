import { Suspense } from "react";
import Search from "@/components/shared/Search";
import { SearchParamProps } from "@/types";
import { ReviewsCarousel } from "@/components/shared/ReviewsCarousel";
import { HeroSection } from "@/components/shared/HeroSection";
import { FeaturesSection } from "@/components/shared/FeaturesSection";
import { CTASection } from "@/components/shared/CTASection";
import EventsFeed from "@/components/shared/EventsFeed";
import CollectionSkeleton from "@/components/shared/CollectionSkeleton";

export default async function Home({ searchParams }: SearchParamProps) {
  // Only await lightweight searchParams — no DB call here
  const resolvedSearchParams = await searchParams;

  const page = Number(resolvedSearchParams?.page) || 1;
  const searchText = (resolvedSearchParams?.query as string) || "";
  const category = (resolvedSearchParams?.category as string) || "";

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO — renders immediately, no blocking */}
      <HeroSection />

      {/* 2. FEATURES — renders immediately */}
      <div id="services">
        <FeaturesSection />
      </div>

      {/* 3. DISCOVER OPPORTUNITIES */}
      <section id="events" className="relative py-24 overflow-hidden">
        {/* Section background */}
        <div className="absolute inset-0 -z-10 bg-background" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="wrapper flex flex-col gap-10">
          {/* Section Header — renders immediately */}
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

          {/* Search + Filters — renders immediately */}
          <Search />

          {/* Divider */}
          <div className="w-full h-px bg-muted" />

          {/*
           * EventsFeed is the ONLY async part.
           * React streams the skeleton instantly, then swaps it in
           * once the DB query resolves — without blocking anything above.
           */}
          <Suspense fallback={<CollectionSkeleton />}>
            <EventsFeed
              query={searchText}
              category={category}
              page={page}
              limit={6}
            />
          </Suspense>
        </div>
      </section>

      {/* 4. TESTIMONIALS — renders immediately */}
      <section
        id="testimonials"
        className="relative py-28 overflow-hidden bg-background"
      >
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[35vw] h-[35vw] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

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

        <ReviewsCarousel />
      </section>

      {/* 5. CTA BANNER — renders immediately */}
      <CTASection />
    </div>
  );
}
