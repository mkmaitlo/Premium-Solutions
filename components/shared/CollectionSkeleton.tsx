/**
 * Shimmer skeleton shown inside the <Suspense> fallback
 * while the SubscriptionsFeed async component is fetching data.
 */
const SkeletonCard = ({ index }: { index: number }) => (
  <div
    className="relative rounded-2xl overflow-hidden bg-card border border-border flex flex-col"
    style={{ animationDelay: `${index * 80}ms` }}
  >
    {/* Image placeholder — pulsing gradient */}
    <div className="h-48 w-full bg-muted animate-pulse" />

    <div className="p-5 flex flex-col gap-3 flex-1">
      {/* Category pill */}
      <div
        className="h-5 w-20 rounded-full bg-muted animate-pulse"
        style={{ animationDelay: `${index * 80 + 50}ms` }}
      />
      {/* Title line 1 */}
      <div
        className="h-5 w-4/5 rounded-lg bg-muted animate-pulse"
        style={{ animationDelay: `${index * 80 + 100}ms` }}
      />
      {/* Title line 2 */}
      <div
        className="h-4 w-3/5 rounded-lg bg-muted relative isolate animate-pulse"
        style={{ animationDelay: `${index * 80 + 150}ms` }}
      />

      {/* Meta row */}
      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border">
        <div
          className="h-8 w-8 rounded-full bg-muted animate-pulse flex-shrink-0"
          style={{ animationDelay: `${index * 80 + 200}ms` }}
        />
        <div className="flex flex-col gap-1.5 flex-1">
          <div
            className="h-3 w-24 rounded bg-muted animate-pulse"
            style={{ animationDelay: `${index * 80 + 220}ms` }}
          />
          <div
            className="h-3 w-16 rounded bg-muted relative isolate animate-pulse"
            style={{ animationDelay: `${index * 80 + 240}ms` }}
          />
        </div>
        <div
          className="h-6 w-14 rounded-full bg-muted animate-pulse"
          style={{ animationDelay: `${index * 80 + 260}ms` }}
        />
      </div>
    </div>
  </div>
);

export default function CollectionSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i}>
            <SkeletonCard index={i} />
          </li>
        ))}
      </ul>
    </div>
  );
}
