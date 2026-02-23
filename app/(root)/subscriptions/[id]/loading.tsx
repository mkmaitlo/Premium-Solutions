/**
 * Subscription detail page loading skeleton.
 * Shown while the Server Component fetches subscription + reviews data.
 */
export default function SubscriptionLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="relative w-full py-12 md:py-20">
        <div className="wrapper max-w-6xl mx-auto animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">

            {/* Image skeleton */}
            <div className="col-span-1 lg:col-span-6 flex flex-col gap-6">
              <div className="w-full aspect-[4/3] rounded-3xl bg-muted" />
              {/* Badges row */}
              <div className="flex gap-3">
                <div className="h-8 w-24 rounded-full bg-muted" />
                <div className="h-8 w-20 rounded-full bg-muted" />
              </div>
            </div>

            {/* Info skeleton */}
            <div className="col-span-1 lg:col-span-6 flex flex-col gap-6">
              {/* Breadcrumb */}
              <div className="h-4 w-32 rounded bg-muted" />
              {/* Title */}
              <div className="flex flex-col gap-3">
                <div className="h-8 w-3/4 rounded-xl bg-muted" />
                <div className="h-6 w-1/2 rounded-xl bg-muted" />
              </div>
              {/* Price */}
              <div className="h-12 w-40 rounded-2xl bg-muted" />
              {/* Description lines */}
              <div className="flex flex-col gap-2">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-5/6 rounded bg-muted" />
                <div className="h-4 w-4/6 rounded bg-muted" />
              </div>
              {/* CTA button */}
              <div className="h-14 w-48 rounded-full bg-muted mt-2" />
            </div>
          </div>

          {/* Reviews section skeleton */}
          <div className="mt-16 flex flex-col gap-6">
            <div className="h-8 w-48 rounded-xl bg-muted" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <div key={s} className="w-4 h-4 rounded-full bg-muted" />
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-5/6 rounded bg-muted" />
                    <div className="h-3 w-3/4 rounded bg-muted" />
                  </div>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="flex flex-col gap-1.5">
                      <div className="h-3 w-24 rounded bg-muted" />
                      <div className="h-2.5 w-16 rounded bg-muted" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
