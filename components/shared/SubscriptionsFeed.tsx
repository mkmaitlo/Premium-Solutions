import { getAllSubscriptions } from "@/lib/actions/subscription.actions";
import { auth } from "@clerk/nextjs/server";
import Card from "./Card";
import Pagination from "./Pagination";
import { Sparkles } from "lucide-react";

interface SubscriptionsFeedProps {
  query: string;
  category: string;
  page: number;
  limit?: number;
}

/**
 * Self-contained async server component.
 * Fetches subscriptions and auth in parallel, then renders the collection.
 * Wrap this in <Suspense> so the rest of the page streams immediately.
 */
export default async function SubscriptionsFeed({
  query,
  category,
  page,
  limit = 6,
}: SubscriptionsFeedProps) {
  // Fetch subscriptions and user session in parallel — no sequential waterfall
  const [subscriptions, { sessionClaims }] = await Promise.all([
    getAllSubscriptions({ query, category, page, limit }),
    auth(),
  ]);

  const isAdmin = (sessionClaims?.isAdmin as boolean) ?? false;
  const data = subscriptions?.data ?? [];
  const totalPages = subscriptions?.totalPages ?? 0;

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] w-full rounded-2xl bg-card border border-border py-20 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          No Opportunities Found
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Check back later for new premium offerings.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((subscription:any, index:any) => (
          <li key={subscription._id.toString()} className="flex justify-center">
            <Card subscription={subscription} index={index} isAdmin={isAdmin} />
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} />
      )}
    </div>
  );
}
