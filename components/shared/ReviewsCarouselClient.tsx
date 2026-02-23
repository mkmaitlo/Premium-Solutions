"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

type Review = {
  _id: string;
  user: { _id: string; firstName: string; lastName: string; photo: string };
  rating: number;
  comment: string;
  createdAt: string;
  subscriptionTitle?: string;
};

const GRADIENT_PAIRS = [
  ["hsl(var(--primary))", "hsl(var(--secondary))"],
  ["hsl(var(--secondary))", "hsl(var(--primary))"],
  ["hsl(var(--primary))", "#06b6d4"],
  ["hsl(var(--secondary))", "#ec4899"],
  ["hsl(var(--primary))", "#10b981"],
];

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

const GradientStar = ({ index, delay: _delay, filled }: { index: number; delay: number; filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
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

const ReviewCard = ({
  review,
  active,
  offset,
  gradientPair,
  cardKey,
}: {
  review: Review;
  active: boolean;
  offset: number;
  gradientPair: string[];
  cardKey: number;
}) => {
  const [starsLit, setStarsLit] = useState(false);
  useEffect(() => {
    if (active) {
      const t = setTimeout(() => setStarsLit(true), 100);
      return () => clearTimeout(t);
    } else {
      setStarsLit(false);
    }
  }, [active, cardKey]);

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
      <div className="relative h-full bg-card rounded-3xl overflow-hidden flex flex-col justify-between p-8 md:p-10 border border-border shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.2)]">
        {/* Left accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl"
          style={{ background: `linear-gradient(to bottom, ${gradientPair[0]}, ${gradientPair[1]})` }}
        />

        {/* Progress bar */}
        {active && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-muted overflow-hidden rounded-b-xl">
            <div
              key={cardKey}
              className="h-full rounded-b-xl"
              style={{
                background: `linear-gradient(to right, ${gradientPair[0]}, ${gradientPair[1]})`,
                animation: "progressBar 5s linear forwards",
              }}
            />
          </div>
        )}

        {/* Decorative quote */}
        <div
          className="absolute top-4 right-6 text-[9rem] leading-none select-none pointer-events-none opacity-[0.06] dark:opacity-[0.08]"
          style={{ color: "hsl(var(--primary))", fontFamily: "Georgia, serif" }}
        >
          &ldquo;
        </div>

        {/* Stars */}
        <div className="flex gap-1.5 mb-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <GradientStar key={i} index={i} delay={i * 120} filled={starsLit && i < review.rating} />
          ))}
        </div>

        {/* Comment */}
        <p className="text-lg md:text-xl text-foreground italic leading-relaxed flex-1 mb-8 font-medium line-clamp-5">
          &ldquo;{review.comment}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-4">
          <div
            className="p-[2.5px] rounded-full flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${gradientPair[0]}, ${gradientPair[1]})` }}
          >
            {review.user?.photo ? (
              <div className="w-12 h-12 rounded-full overflow-hidden bg-card">
                <Image
                  src={review.user.photo}
                  alt={review.user.firstName}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div
                className="w-12 h-12 rounded-full bg-card flex items-center justify-center text-base font-extrabold"
                style={{ color: gradientPair[0] }}
              >
                {getInitials(review.user?.firstName ?? "", review.user?.lastName ?? "")}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-foreground text-base">
                {review.user?.firstName} {review.user?.lastName}
              </h4>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border"
                style={{
                  color: gradientPair[0],
                  borderColor: `${gradientPair[0]}30`,
                  backgroundColor: `${gradientPair[0]}10`,
                }}
              >
                ✓ Verified
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-0.5">
              {new Date(review.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ReviewsCarouselClient({ reviews }: { reviews: Review[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardKey, setCardKey] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const total = reviews.length;

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % total);
    setCardKey((k) => k + 1);
  }, [total]);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + total) % total);
    setCardKey((k) => k + 1);
  }, [total]);

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 5000);
  }, [next]);

  useEffect(() => {
    if (total === 0) return;
    resetInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [resetInterval, total]);

  if (total === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 text-center py-16">
        <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">No customer reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full max-w-3xl mx-auto px-4 md:px-8">
      {/* Card stack */}
      <div className="relative h-[360px] md:h-[320px]">
        {reviews.map((review, i) => {
          const offset = i - activeIndex;
          const wrappedOffset =
            offset > total / 2 ? offset - total : offset < -total / 2 ? offset + total : offset;
          return (
            <ReviewCard
              key={review._id}
              review={review}
              active={i === activeIndex}
              offset={wrappedOffset}
              gradientPair={GRADIENT_PAIRS[i % GRADIENT_PAIRS.length]}
              cardKey={cardKey}
            />
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-8 mb-8">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => { setActiveIndex(i); setCardKey((k) => k + 1); resetInterval(); }}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? "2rem" : "0.5rem",
              background:
                i === activeIndex
                  ? "linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)))"
                  : "hsl(var(--border))",
              opacity: i === activeIndex ? 1 : 0.5,
            }}
          />
        ))}
      </div>

      {/* Prev/Next */}
      <div className="flex justify-center gap-4">
        {[{ fn: prev, Icon: ChevronLeft }, { fn: next, Icon: ChevronRight }].map(({ fn, Icon }, idx) => (
          <button
            key={idx}
            onClick={() => { fn(); resetInterval(); }}
            className="flex items-center justify-center w-12 h-12 rounded-full text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))",
              boxShadow: "0 4px 20px hsl(var(--primary) / 0.35)",
            }}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      <style>{`
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
