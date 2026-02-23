export default function ReviewsCarouselSkeleton() {
  return (
    <div className="relative z-10 w-full max-w-3xl mx-auto px-4 md:px-8 animate-pulse">
      {/* Card skeleton */}
      <div className="relative h-[360px] md:h-[320px] bg-card rounded-3xl border border-border overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 rounded-l-3xl" />
        <div className="p-8 md:p-10 flex flex-col gap-6 h-full">
          {/* Stars */}
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-muted" />
            ))}
          </div>
          {/* Text lines */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="h-4 bg-muted rounded-full w-full" />
            <div className="h-4 bg-muted rounded-full w-[90%]" />
            <div className="h-4 bg-muted rounded-full w-[80%]" />
            <div className="h-4 bg-muted rounded-full w-[60%]" />
          </div>
          {/* Author */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0" />
            <div className="flex flex-col gap-2">
              <div className="h-3 bg-muted rounded-full w-32" />
              <div className="h-3 bg-muted rounded-full w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8 mb-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-2 rounded-full bg-muted ${i === 0 ? "w-8" : "w-2"}`} />
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <div className="w-12 h-12 rounded-full bg-muted" />
        <div className="w-12 h-12 rounded-full bg-muted" />
      </div>
    </div>
  );
}
