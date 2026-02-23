import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getAllReviewsAdmin } from "@/lib/actions/review.actions";
import AdminReviewsClient from "@/components/shared/AdminReviewsClient";
import { Star, TrendingUp, MessageSquare } from "lucide-react";

export default async function AdminReviewsPage() {
  const { sessionClaims } = await auth();
  const isAdmin = sessionClaims?.isAdmin ?? false;
  if (!isAdmin) redirect("/");

  const reviews = await getAllReviewsAdmin();

  const totalReviews = reviews.length;
  const avgRating = totalReviews
    ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1)
    : "—";

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-6 md:p-8 shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
            >
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary leading-tight">
                Customer Reviews
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-primary/70" />
                Manage, edit and moderate all platform reviews
              </p>
            </div>
          </div>

          {/* Quick stats pills */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-card/80 border border-border/50 shadow-sm">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="text-sm font-black text-foreground">{totalReviews}</span>
              <span className="text-xs text-muted-foreground">reviews</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-card/80 border border-border/50 shadow-sm">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-black text-foreground">{avgRating}</span>
              <span className="text-xs text-muted-foreground">avg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Client Component — handles all interactivity */}
      <AdminReviewsClient initialReviews={reviews} />
    </div>
  );
}
