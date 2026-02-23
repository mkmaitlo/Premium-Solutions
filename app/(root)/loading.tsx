/**
 * (root)/loading.tsx
 *
 * Next.js shows this file while the page.tsx Server Component is
 * preparing. Because page.tsx itself uses Suspense internally for
 * data fetching, this file is effectively the shell that appears
 * during the very first navigation to "/" before any RSC payload arrives.
 *
 * In practice, the page streams so fast that this is almost invisible,
 * but it prevents a blank white flash.
 */
export default function HomeLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero shell — mirrors HeroSection layout without data */}
      <section className="relative overflow-hidden pt-24 md:pt-32 pb-20 lg:pb-32 px-4 md:px-8">
        <div className="wrapper relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center max-w-7xl mx-auto">
          {/* Left content skeleton */}
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="h-9 w-64 rounded-full bg-muted animate-pulse" />
            <div className="flex flex-col gap-3">
              <div className="h-10 w-4/5 rounded-xl bg-muted animate-pulse" />
              <div className="h-14 w-full rounded-xl bg-muted animate-pulse" />
              <div className="h-8 w-3/5 rounded-xl bg-muted animate-pulse" />
            </div>
            <div className="h-16 w-4/5 rounded-xl bg-muted animate-pulse" />
            <div className="flex gap-4">
              <div className="h-14 w-48 rounded-full bg-muted animate-pulse" />
              <div className="h-14 w-40 rounded-full bg-muted animate-pulse" />
            </div>
            <div className="flex gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-8 w-32 rounded-full bg-muted animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          </div>

          {/* Right deals card skeleton */}
          <div className="relative h-[580px] md:h-[600px] w-full max-w-lg mx-auto lg:ml-auto">
            <div className="absolute top-6 md:top-8 left-0 md:left-4 right-0 md:right-4 bottom-6 md:bottom-8 bg-card/60 border border-primary/20 rounded-3xl p-5 flex flex-col gap-3 overflow-hidden animate-pulse">
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-muted" />
                  <div className="flex flex-col gap-1">
                    <div className="h-3 w-24 rounded bg-muted" />
                    <div className="h-2.5 w-16 rounded bg-muted" />
                  </div>
                </div>
                <div className="h-6 w-14 rounded-full bg-muted" />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 mx-1 rounded-xl border border-border/30 bg-background/40" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="w-8 h-8 rounded-lg bg-muted flex-shrink-0" />
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="h-3 w-3/4 rounded bg-muted" />
                      <div className="h-2.5 w-1/2 rounded bg-muted" />
                    </div>
                    <div className="h-4 w-16 rounded bg-muted flex-shrink-0" />
                    <div className="h-5 w-10 rounded-md bg-muted flex-shrink-0" />
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-3 border-t border-border/50 flex justify-end">
                <div className="h-4 w-36 rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
