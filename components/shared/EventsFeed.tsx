import { getAllEvents } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs/server";
import Card from "./Card";
import Pagination from "./Pagination";
import { Sparkles } from "lucide-react";

interface EventsFeedProps {
  query: string;
  category: string;
  page: number;
  limit?: number;
}

/**
 * Self-contained async server component.
 * Fetches events and auth in parallel, then renders the collection.
 * Wrap this in <Suspense> so the rest of the page streams immediately.
 */
export default async function EventsFeed({
  query,
  category,
  page,
  limit = 6,
}: EventsFeedProps) {
  // Fetch events and user session in parallel — no sequential waterfall
  const [events, { sessionClaims }] = await Promise.all([
    getAllEvents({ query, category, page, limit }),
    auth(),
  ]);

  const userId = sessionClaims?.userId as string;
  const data = events?.data ?? [];
  const totalPages = events?.totalPages ?? 0;

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
        {data.map((event:any, index:any) => (
          <li key={event._id.toString()} className="flex justify-center">
            <Card event={event} userId={userId} index={index} />
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} />
      )}
    </div>
  );
}
