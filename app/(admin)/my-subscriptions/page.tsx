import Collection from "@/components/shared/Collection";
import { getSubscriptionsByUser } from "@/lib/actions/subscription.actions";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, PlusCircle, Package } from "lucide-react";

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  const resolvedSearchParams = await searchParams;

  const { sessionClaims, userId: clerkId } = await auth();
  const userId = (sessionClaims?.userId as string) || (clerkId as string);
  const isAdmin = sessionClaims?.isAdmin ?? false;

  if (!isAdmin) redirect("/");

  const eventsPage = Number(resolvedSearchParams?.eventsPage) || 1;
  const organizedEvents = await getSubscriptionsByUser({ userId, page: eventsPage });
  const totalCount = organizedEvents?.data?.length ?? 0;

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-6 md:p-8 shadow-lg">
        {/* Decorative glow blobs */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
            >
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary leading-tight">
                Subscriptions
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage all subscription plans available for sale
              </p>
            </div>
          </div>

          <Link
            href="/subscriptions/create"
            className="group relative flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
          >
            {/* shimmer */}
            <span className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
            <PlusCircle className="w-4 h-4 relative z-10" />
            <span className="relative z-10">New Subscription</span>
          </Link>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 mt-6 pt-5 border-t border-border/30 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
              <Package className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-lg font-black text-foreground leading-none">{organizedEvents?.totalPages ? totalCount : 0}</p>
              <p className="text-[11px] text-muted-foreground font-medium">Active Plans</p>
            </div>
          </div>
          <div className="h-8 w-px bg-border/40" />
          <div className="text-sm text-muted-foreground">
            Page <span className="font-bold text-foreground">{eventsPage}</span>
            {organizedEvents?.totalPages && organizedEvents.totalPages > 1 && (
              <> of <span className="font-bold text-foreground">{organizedEvents.totalPages}</span></>
            )}
          </div>
        </div>
      </div>

      {/* Collection */}
      <Collection
        data={organizedEvents?.data}
        emptyTitle="No subscriptions yet"
        emptyStateSubtext="Create your first subscription plan to get started"
        limit={3}
        page={eventsPage}
        urlParamName="eventsPage"
        totalPages={organizedEvents?.totalPages}
      />
    </div>
  );
};

export default ProfilePage;