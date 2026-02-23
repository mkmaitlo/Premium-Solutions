/**
 * Admin section route-level loading skeleton.
 * The admin layout (sidebar) renders instantly — only the page content
 * shows this skeleton while the async page component fetches data.
 */
export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 animate-pulse">

      {/* Page Header Skeleton */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/60 p-6 md:p-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-muted flex-shrink-0" />
          <div className="flex flex-col gap-2">
            <div className="h-7 w-48 rounded-lg bg-muted" />
            <div className="h-4 w-64 rounded bg-muted" />
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/40 bg-card/60 p-5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-2">
                <div className="h-3 w-20 rounded bg-muted" />
                <div className="h-8 w-16 rounded-lg bg-muted" />
                <div className="h-3 w-28 rounded bg-muted" />
              </div>
              <div className="w-11 h-11 rounded-2xl bg-muted flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {/* Content area skeleton */}
      <div className="rounded-2xl border border-border/50 bg-card/60 overflow-hidden">
        <div className="p-4 md:p-6 flex flex-col gap-4">
          {/* Table header */}
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 rounded bg-muted" />
            <div className="h-9 w-48 rounded-xl bg-muted" />
          </div>
          {/* Table rows */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-3 border-b border-border/30 last:border-0"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="h-3.5 w-1/3 rounded bg-muted" />
                <div className="h-3 w-1/4 rounded bg-muted" />
              </div>
              <div className="h-6 w-16 rounded-full bg-muted" />
              <div className="h-8 w-8 rounded-lg bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
