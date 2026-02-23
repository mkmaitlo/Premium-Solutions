/**
 * Renders a shimmer placeholder that matches the real HeroSection deals card
 * dimensions exactly, so there's no layout shift when deals load.
 */
export default function HeroDealsSkeleton() {
  return (
    <div className="relative h-[580px] md:h-[600px] w-full max-w-lg mx-auto lg:ml-auto">
      {/* Card shell */}
      <div className="absolute top-6 md:top-8 left-0 md:left-4 right-0 md:right-4 bottom-6 md:bottom-8 bg-card/60 backdrop-blur-xl border border-primary/20 rounded-3xl shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.3)] p-5 flex flex-col gap-3 overflow-hidden animate-pulse">

        {/* Header */}
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

        {/* Deal rows */}
        <div className="flex flex-col gap-2 flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 mx-1 rounded-xl border border-border/30 bg-background/40"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex-shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="h-3 w-3/4 rounded bg-muted" />
                <div className="h-2.5 w-1/2 rounded bg-muted" />
              </div>
              <div className="h-4 w-16 rounded bg-muted flex-shrink-0" />
              <div className="h-5 w-10 rounded-md bg-muted flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-end">
          <div className="h-4 w-36 rounded bg-muted" />
        </div>
      </div>

      {/* Floating badge top-right */}
      <div className="absolute top-2 md:top-3 right-3 md:-right-6 bg-card/70 border border-primary/10 rounded-2xl px-3 py-2 flex items-center gap-2">
        <div className="w-3.5 h-3.5 rounded-full bg-muted" />
        <div className="h-3 w-24 rounded bg-muted" />
      </div>

      {/* Floating chip bottom-left */}
      <div className="absolute bottom-2 md:bottom-3 left-3 md:-left-8 bg-muted rounded-2xl px-4 py-3">
        <div className="h-2.5 w-14 rounded bg-muted/70 mb-1" />
        <div className="h-5 w-20 rounded bg-muted/70" />
      </div>
    </div>
  );
}
