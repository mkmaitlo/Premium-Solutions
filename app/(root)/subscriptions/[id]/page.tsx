import { getSubscriptionById } from "@/lib/actions/subscription.actions";
import { getReviewsBySubscriptionId } from "@/lib/actions/review.actions";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation";
import { Pencil, MessageCircle, Star, ShieldCheck, Zap } from "lucide-react";
import ReviewsSection from "@/components/shared/ReviewsSection";
import { SubscriptionJsonLd } from "@/components/seo/SubscriptionJsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://premiumsolutions.store";

// ─── Dynamic Metadata ─────────────────────────────────────────────────────────
// Called by Next.js for each individual subscription page.
// Powers individual title tags, meta descriptions, OG and Twitter cards.
export async function generateMetadata({ params }: SearchParamProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const subscription = await getSubscriptionById(id as string);
    if (!subscription) return {};

    const pageUrl = `${BASE_URL}/subscriptions/${id}`;
    const title = `${subscription.title} — Up to 90% Off`;
    const description =
      subscription.description
        ? `${subscription.description.slice(0, 155)}…`
        : `Get ${subscription.title} at up to 90% off the standard retail price. Genuine subscription voucher, instantly delivered.`;

    return {
      title,
      description,
      alternates: { canonical: pageUrl },
      openGraph: {
        type: "website",
        url: pageUrl,
        title,
        description,
        images: [
          {
            url: subscription.imageUrl,
            width: 1200,
            height: 630,
            alt: subscription.title,
          },
        ],
        siteName: "Premium Solutions",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [subscription.imageUrl],
      },
    };
  } catch {
    return {};
  }
}

// ─── Static Generation ────────────────────────────────────────────────────────
// Pre-renders ALL subscription pages at build time.
// Benefits:
//   • Googlebot gets instant static HTML — no server wait
//   • Faster Largest Contentful Paint (LCP) — core ranking signal
//   • Pages work even if DB is temporarily down (served from CDN cache)
//
// New listings created after build are handled by the fallback:
//   "blocking" = Next.js renders the page on first request, then caches it.
export async function generateStaticParams() {
  const { getAllSubscriptionIds } = await import("@/lib/actions/subscription.actions");
  return await getAllSubscriptionIds();
}

// ISR: revalidate cached pages every 24 hours
// This picks up price changes, new reviews or description edits automatically.
export const revalidate = 86400;
export const dynamicParams = true; // allow on-demand generation for new listings

const EventDetails = async ({ params }: SearchParamProps) => {
  const { id } = await params;
  const subscription = await getSubscriptionById(id);
  const { sessionClaims, userId: authClerkId } = await auth();
  const isAdmin = (sessionClaims?.isAdmin as boolean) ?? false;
  const clerkId = authClerkId || null;
  const reviews = await getReviewsBySubscriptionId(id, 20);

  const isFree = subscription.price === "0" || subscription.price === "Free" || !subscription.price;
  const priceDisplay = isFree ? "Free" : Number(subscription.price).toLocaleString();

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Structured data — injected server-side, zero JS overhead */}
      <SubscriptionJsonLd subscription={subscription} />

      {/* Background blobs to match site theme */}
      <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-secondary/10 blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <section className="relative w-full py-12 md:py-20 z-10">
        <div className="wrapper max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
            
            {/* LEFT COLUMN - Image */}
            <div className="col-span-1 lg:col-span-6 flex flex-col gap-6 animate-in fade-in slide-in-from-left-8 duration-700 ease-in-out">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-card border border-primary/20 shadow-[0_0_40px_-10px_rgba(var(--primary),0.3)] group">
                {/* Clean gradient overlay on the image frame */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-transparent z-10 pointer-events-none" />
                <Image 
                  src={subscription.imageUrl} 
                  alt={subscription.title} 
                  fill
                  className="object-contain transition-transform duration-700 group-hover:scale-105" 
                  priority
                />
              </div>

              {/* Trust indicators under image matches theme perfectly */}
              <div className="hidden lg:grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50 shadow-sm">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">Secure Order</span>
                    <span className="text-xs text-muted-foreground">100% Guaranteed</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50 shadow-sm">
                  <Zap className="w-8 h-8 text-secondary" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">Instant Access</span>
                    <span className="text-xs text-muted-foreground">Quick Setup</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Details */}
            <div className="col-span-1 lg:col-span-6 flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-700 delay-200 fill-mode-both ease-in-out">
              
              {/* Header Box */}
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <h1 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary leading-tight drop-shadow-sm">
                    {subscription.title}
                  </h1>
                  
                  {isAdmin && (
                    <div className="flex gap-2 ml-4 self-start">
                      <Link href={`/subscriptions/${subscription._id}/update`} className="flex items-center justify-center p-2.5 rounded-full bg-card/90 backdrop-blur-sm shadow-sm border border-border/50 hover:bg-primary/10 hover:border-primary/30 hover:shadow-md transition-all duration-300 group cursor-pointer">
                        <Pencil className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                      </Link>
                      <DeleteConfirmation subscriptionId={subscription._id.toString()} />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex gap-1 relative group/rating cursor-default">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${(subscription.averageRating ?? 5.0) >= i ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30 fill-transparent'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground border-l border-border pl-4">
                    <span className="text-foreground font-bold mr-1">{Number(subscription.averageRating ?? 5.0).toFixed(1)}</span>
                    ({subscription.reviewCount ?? 0} reviews)
                  </span>
                </div>
              </div>

              {/* Price Glassmorph Box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-primary/20 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
                
                <div className="flex flex-col gap-1 relative z-10">
                  <p className="text-sm font-semibold tracking-wider uppercase text-primary">Total Price</p>
                  <div className="flex items-baseline gap-1 animate-in zoom-in-95 duration-500 delay-300 fill-mode-both">
                    {!isFree && <span className="text-2xl font-bold text-muted-foreground">PKR</span>}
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-600 tracking-tight drop-shadow-sm">{priceDisplay}</span>
                  </div>
                </div>

                <Link
                  href={`https://wa.me/923144414882?text=Hi! I am interested in purchasing ${subscription.title} for PKR ${priceDisplay}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 sm:mt-0 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-[0_0_30px_-5px_#10b981] hover:-translate-y-1 transition-all duration-300 font-bold text-lg inline-flex items-center justify-center gap-3 relative overflow-hidden group/btn z-10"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                  <MessageCircle className="w-6 h-6 group-hover/btn:animate-pulse relative z-10" />
                  <span className="relative z-10">Order on WhatsApp</span>
                </Link>
              </div>

              {/* Description Box */}
              <div className="flex flex-col gap-4 mt-2">
                <h3 className="text-xl font-bold text-foreground border-b border-border pb-3">About this Subscription</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-[17px]">
                  {subscription.description}
                </p>
              </div>

               {/* Provided By */}
               <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground">
                  <div className="px-3 py-1 rounded-full bg-secondary/10 text-secondary font-semibold">
                     Provided exactly as verified by {subscription?.organizer?.firstName || 'Premium'} {subscription?.organizer?.lastName || 'Solutions'}
                  </div>
              </div>

            </div>
          </div>

          <ReviewsSection subscriptionId={subscription._id.toString()} clerkId={clerkId} initialReviews={reviews || []} />
        </div>
      </section>
    </div>
  );
};

export default EventDetails;
