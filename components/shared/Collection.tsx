import { ISubscription } from "@/lib/database/models/subscription.model";
import { auth } from "@clerk/nextjs/server";
import Card from "./Card";
import Pagination from "./Pagination";
import { Sparkles } from "lucide-react";

type CollectionProps = {
  data: ISubscription[];
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  page: number | string;
  totalPages?: number;
  urlParamName?: string;
};

const Collection = async ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages = 0,
  urlParamName,
}: CollectionProps) => {
  const { sessionClaims } = await auth();
  const isAdmin = (sessionClaims?.isAdmin as boolean) ?? false;

  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((subscription, index) => (
              <li key={subscription._id.toString()} className="flex justify-center">
                <Card subscription={subscription} index={index} isAdmin={isAdmin} />
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <Pagination urlParamName={urlParamName} page={page} totalPages={totalPages} />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] w-full rounded-2xl bg-card border border-border py-20 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">{emptyTitle}</h3>
          <p className="text-muted-foreground max-w-sm">{emptyStateSubtext}</p>
        </div>
      )}
    </>
  );
};

export default Collection;
