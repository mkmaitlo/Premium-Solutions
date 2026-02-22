"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const REVIEWS = [
  {
    initials: "SJ",
    name: "Sarah Jenkins",
    role: "Tech Founder, Nexus Labs",
    text: "The quality of connections and events I've discovered here completely changed the trajectory of my startup. Within three months I had three enterprise contracts I never would have found on my own.",
    colorFrom: "hsl(var(--primary))",
    colorTo: "hsl(var(--secondary))",
  },
  {
    initials: "MP",
    name: "Marcus Pierce",
    role: "Senior Analyst, Apex Capital",
    text: "A flawless experience from start to finish. Finding premium upskilling events has never been more straightforward. The curation quality is genuinely best-in-class — every session I've attended has delivered real value.",
    colorFrom: "hsl(var(--secondary))",
    colorTo: "hsl(var(--primary))",
  },
  {
    initials: "LN",
    name: "Linda Nguyen",
    role: "Creative Director, Studio Four",
    text: "I've expanded my professional portfolio significantly through this platform. The verified providers are truly top-notch and the experience of navigating the marketplace feels premium throughout.",
    colorFrom: "hsl(var(--primary))",
    colorTo: "#06b6d4",
  },
  {
    initials: "RT",
    name: "Robert Torres",
    role: "VP Marketing, AlphaWave",
    text: "The caliber of professionals you meet here is outstanding. Events are impeccably organized and the networking opportunities alone have already paid back my subscription tenfold.",
    colorFrom: "hsl(var(--secondary))",
    colorTo: "#ec4899",
  },
  {
    initials: "EK",
    name: "Emma Knight",
    role: "Product Manager, Orbit Digital",
    text: "This platform has become my go-to for professional development. The interactive sessions and curated community are genuinely unlike anything else I've tried in my five years of networking.",
    colorFrom: "hsl(var(--primary))",
    colorTo: "#10b981",
  },
];

const GradientStar = ({ index, delay }: { index: number; delay: number }) => {
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFilled(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <svg
      width="18" height="18" viewBox="0 0 18 18" fill="none"
      className={`transition-all duration-300 ${filled ? "scale-110" : "scale-90 opacity-30"}`}
    >
      <defs>
        <linearGradient id={`star-grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--secondary))" />
        </linearGradient>
      </defs>
      <path
        d="M9 1.5L11.163 6.45L16.5 7.275L12.75 10.95L13.725 16.5L9 13.95L4.275 16.5L5.25 10.95L1.5 7.275L6.837 6.45L9 1.5Z"
        fill={filled ? `url(#star-grad-${index})` : "hsl(var(--border))"}
        stroke={filled ? "none" : "hsl(var(--border))"}
      />
    </svg>
  );
};

interface ReviewCardProps {
  review: (typeof REVIEWS)[0];
  active: boolean;
  offset: number;
}

const ReviewCard = ({ review, active, offset }: ReviewCardProps) => {
  const [starKey, setStarKey] = useState(0);

  useEffect(() => {
    if (active) setStarKey((k) => k + 1);
  }, [active]);

  const scale = active ? 1 : 0.88;
  const opacity = active ? 1 : 0.45;
  const blur = active ? 0 : 6;
  const x = active ? 0 : offset * 55;

  return (
    <div
      className="absolute inset-0 transition-all duration-700 ease-in-out"
      style={{
        transform: `translateX(${x}%) scale(${scale})`,
        opacity,
        filter: `blur(${blur}px)`,
        zIndex: active ? 10 : 1,
        pointerEvents: active ? "auto" : "none",
      }}
    >
      <div className="relative h-full bg-card rounded-3xl overflow-hidden flex flex-col justify-between p-8 md:p-10 border border-border shadow-[0_8px_40px_-12px_hsl(var(--primary) / 0.2)]">
        {/* Left-border gradient accent */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl"
          style={{ background: `linear-gradient(to bottom, ${review.colorFrom}, ${review.colorTo})` }}
        />

        {/* Progress bar (active only) */}
        {active && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-muted overflow-hidden rounded-b-xl">
            <div
              key={starKey}
              className="h-full rounded-b-xl"
              style={{
                background: `linear-gradient(to right, ${review.colorFrom}, ${review.colorTo})`,
                animation: "progressBar 5s linear forwards",
              }}
            />
          </div>
        )}

        {/* Giant decorative quote */}
        <div className="absolute top-4 right-6 text-[9rem] leading-none select-none pointer-events-none opacity-[0.06] dark:opacity-[0.08]"
          style={{ color: "hsl(var(--primary))", fontFamily: "Georgia, serif" }}>
          &ldquo;
        </div>

        {/* Stars */}
        <div className="flex gap-1.5 mb-6" key={starKey}>
          {[0, 1, 2, 3, 4].map((i) => (
            <GradientStar key={i} index={i} delay={i * 120} />
          ))}
        </div>

        {/* Quote text */}
        <p className="text-lg md:text-xl text-foreground italic leading-relaxed flex-1 mb-8 font-medium">
          &ldquo;{review.text}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-4">
          {/* Avatar with gradient ring */}
          <div
            className="p-[2.5px] rounded-full flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${review.colorFrom}, ${review.colorTo})` }}
          >
            <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center text-base font-extrabold"
              style={{ color: review.colorFrom }}>
              {review.initials}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-foreground text-base">{review.name}</h4>
              {/* Verified badge */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border"
                style={{
                  color: review.colorFrom,
                  borderColor: `${review.colorFrom}30`,
                  backgroundColor: `${review.colorFrom}10`,
                }}>
                ✓ Verified
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-0.5">{review.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReviewsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const total = REVIEWS.length;

  const prev = useCallback(() => setActiveIndex((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setActiveIndex((i) => (i + 1) % total), [total]);

  // Auto-play
  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 5000);
  }, [next]);

  useEffect(() => {
    resetInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [resetInterval]);

  return (
    <div className="relative z-10 w-full max-w-3xl mx-auto px-4 md:px-8">
      {/* Card stack area */}
      <div className="relative h-[340px] md:h-[320px]">
        {REVIEWS.map((review, i) => {
          const offset = i - activeIndex;
          // Wrap for circular display
          const wrappedOffset = offset > total / 2 ? offset - total : offset < -total / 2 ? offset + total : offset;
          const isActive = i === activeIndex;
          return (
            <ReviewCard
              key={i}
              review={review}
              active={isActive}
              offset={wrappedOffset}
            />
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-8 mb-8">
        {REVIEWS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setActiveIndex(i); resetInterval(); }}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? "2rem" : "0.5rem",
              background: i === activeIndex
                ? "linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)))"
                : "hsl(var(--border))",
              opacity: i === activeIndex ? 1 : 0.5,
            }}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => { prev(); resetInterval(); }}
          className="flex items-center justify-center w-12 h-12 rounded-full text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))",
            boxShadow: "0 4px 20px hsl(var(--primary) / 0.35)",
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => { next(); resetInterval(); }}
          className="flex items-center justify-center w-12 h-12 rounded-full text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))",
            boxShadow: "0 4px 20px hsl(var(--primary) / 0.35)",
          }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Progress bar keyframes injected inline */}
      <style>{`
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
};
