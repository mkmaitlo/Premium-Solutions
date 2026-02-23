/**
 * HeroDealsPanel — async Server Component
 *
 * Fetches deals from DB in isolation so the rest of the Hero Section
 * (text, CTA, ticker) renders immediately via React Streaming.
 * Wrap this in <Suspense fallback={<HeroDealsSkeleton />}>.
 */
import { getAllDeals } from "@/lib/actions/deal.actions";
import { HeroSection } from "./HeroSection";

export async function HeroDealsPanel() {
  const deals = await getAllDeals();
  return <HeroSection deals={deals} />;
}
