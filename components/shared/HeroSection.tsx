"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight, Play, Star, Users, Zap, Tag, Bell,
  ShieldCheck, Truck, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";



// Brands for the infinite ticker
const BRANDS = [
  "💼 LinkedIn", "🎨 Canva", "🎵 Spotify", "🖌️ Adobe CC",
  "🤖 ChatGPT", "☁️ Google One", "📺 YouTube Premium", "🎮 Xbox Game Pass",
  "📚 Coursera Plus", "🧠 Grammarly", "🔐 NordVPN", "📊 Notion",
];

// Shorter names so nothing overflows the headline line
const ROTATING_WORDS = [
  "LinkedIn Premium",
  "Spotify Premium",
  "Adobe Creative",
  "Canva Pro",
  "ChatGPT Plus",
  "Google One",
  "YouTube Premium",
  "NordVPN",
];

const TRUST_BADGES = [
  { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: "Verified Vouchers"  },
  { icon: <Truck       className="w-3.5 h-3.5" />, label: "Instant Delivery"   },
  { icon: <Lock        className="w-3.5 h-3.5" />, label: "Secure Checkout"    },
];

export type HeroDeal = {
  _id?: string;
  emoji: string;
  name: string;
  original: string;
  price: string;
  off: string;
  color: string;
};

/* ─── Deal Rows sub-component ─────────────────────── */

const DealRows = ({ activeDeals }: { activeDeals: HeroDeal[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeDeals.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [activeDeals.length]);

  if (!activeDeals || activeDeals.length === 0) {
    return (
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto overflow-x-hidden pr-2 mr-[-8px] py-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-2.5 mx-1 rounded-xl border border-border/30 bg-background/40 animate-pulse"
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
    );
  }

  return (
    <div className="flex flex-col gap-2 flex-1 overflow-y-auto overflow-x-hidden pr-2 mr-[-8px] py-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
      {activeDeals.map((deal, i) => (
        <div
          key={deal.name}
          className={`flex items-center gap-3 px-3 py-2.5 mx-1 rounded-xl border transition-all duration-500 ${
            i === activeIndex
              ? "bg-primary/[0.07] border-primary/30 shadow-sm scale-[1.02]"
              : "bg-background/40 border-border/30"
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${deal.color?.split(" ")[0] || "bg-muted"}`}>
            <span>{deal.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate leading-none">{deal.name}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 line-through">{deal.original}/mo</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-extrabold text-foreground leading-none">
              {deal.price}<span className="text-[10px] font-normal text-muted-foreground">/mo</span>
            </p>
          </div>
          <div className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold flex-shrink-0 ${deal.color || "text-muted"}`}>
            -{deal.off}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── Infinite Brand Ticker ───────────────────────── */

const BrandTicker = () => (
  <div className="relative w-full overflow-hidden py-3 mt-2">
    {/* Fade masks */}
    <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
    <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

    <div className="flex gap-6 animate-[ticker_30s_linear_infinite] w-max">
      {[...BRANDS, ...BRANDS].map((brand, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground border border-border/50 bg-card/50 whitespace-nowrap select-none"
        >
          {brand}
        </span>
      ))}
    </div>
  </div>
);

/* ─── Typewriter Word ─────────────────────────────── */

const TypewriterWord = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const current = ROTATING_WORDS[wordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        const next = current.slice(0, displayed.length + 1);
        setDisplayed(next);
        if (next === current) {
          // Finished typing — pause before backspacing
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
          }, 1600);
        }
      } else {
        // Backspacing
        const next = current.slice(0, displayed.length - 1);
        setDisplayed(next);
        if (next === "") {
          // Finished deleting — pause before next word
          setIsPaused(true);
          setTimeout(() => {
            setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
            setIsPaused(false);
            setIsDeleting(false);
          }, 400);
        }
      }
    }, isDeleting ? 45 : 75); // backspace faster than typing

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, isPaused, wordIndex]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_20px_hsl(var(--primary)/0.25)] whitespace-nowrap">
      {displayed}
      {/* Blinking cursor */}
      <span className="animate-[blink_1s_step-end_infinite] text-primary not-italic font-light ml-[1px]">|</span>
    </span>
  );
};

/* ─── Main HeroSection ────────────────────────────── */

export const HeroDealsCard = ({ deals = [] }: { deals?: HeroDeal[] }) => {
  const activeDeals = deals;
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse parallax on the card
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Skip parallax on touch screens — wastes GPU on mobile
    if (!cardRef.current || window.matchMedia("(hover: none)").matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    cardRef.current.style.transform = `perspective(1200px) rotateY(${dx * 12}deg) rotateX(${-dy * 8}deg) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg) scale(1)";
  }, []);

  return (
    <div
      className="relative h-[580px] md:h-[600px] w-full max-w-lg mx-auto lg:ml-auto z-10 animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-both cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main glass card */}
      <div
        ref={cardRef}
        className="absolute top-6 md:top-8 left-0 md:left-4 right-0 md:right-4 bottom-6 md:bottom-8 bg-card/60 backdrop-blur-xl border border-primary/20 rounded-3xl shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.3)] animate-float p-5 flex flex-col gap-3 overflow-hidden"
        style={{ transition: "transform 0.2s ease-out" }}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
              <Tag className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground leading-none">Premium Deals</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Updated live</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Live</span>
          </div>
        </div>

        <DealRows activeDeals={activeDeals} />

        {/* Bottom strip */}
        <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-end">
          <p className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">save PKR 95,000 / year</p>
        </div>
        <div className="absolute top-0 -left-[100%] w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-[-30deg] animate-[shimmer_4s_ease-in-out_infinite] pointer-events-none" />
      </div>

      {/* Floating "New Deal" badge */}
      <div className="absolute top-2 md:top-3 right-3 md:-right-6 bg-card/90 backdrop-blur-md border border-primary/20 rounded-2xl px-3 py-2 shadow-xl animate-float-delayed flex items-center gap-2 z-20">
        <Bell className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <span className="text-xs font-bold text-foreground whitespace-nowrap">New Deal Added!</span>
      </div>

      {/* Floating savings chip */}
      <div className="absolute bottom-2 md:bottom-6 -left-9 md:-left-8 bg-gradient-to-br from-primary to-secondary text-white rounded-2xl px-4 py-3 shadow-lg shadow-primary/30 animate-float z-20">
        <p className="text-[10px] font-semibold opacity-80 mb-0.5 whitespace-nowrap">You Save</p>
        <p className="text-xl font-extrabold leading-none whitespace-nowrap">Up to 90%</p>
      </div>
    </div>
  );
};

export const HeroSection = ({ rightPanel }: { rightPanel?: React.ReactNode }) => {
  const [membersCount, setMembersCount] = useState(0);
  const [ratingTracker, setRatingTracker] = useState(0);

  // Count-up animation
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setMembersCount(Math.floor(ease * 10000));
      setRatingTracker(Math.floor(ease * 49) / 10);
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, []);

  return (
    <section className="relative overflow-hidden pt-24 md:pt-32 pb-20 lg:pb-32 px-4 md:px-8">
      {/* Background blobs — hidden on mobile (expensive paint + mix-blend-mode) */}
      <div className="absolute top-0 right-0 w-full h-full flex justify-center z-0 pointer-events-none overflow-hidden hidden md:flex">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[100px] animate-[pulse_8s_ease-in-out_infinite] mix-blend-multiply dark:mix-blend-screen" style={{ willChange: "opacity" }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary/10 blur-[120px] animate-[pulse_10s_ease-in-out_infinite_2s] mix-blend-multiply dark:mix-blend-screen" style={{ willChange: "opacity" }} />
        <div className="absolute top-[30%] left-[25%] w-[30vw] h-[30vw] rounded-full bg-primary/5 blur-[80px] animate-[pulse_12s_ease-in-out_infinite_1s] mix-blend-multiply dark:mix-blend-screen" style={{ willChange: "opacity" }} />
      </div>
      {/* Lightweight solid gradient for mobile instead of blobs */}
      <div className="md:hidden absolute inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, hsl(var(--primary)/0.08), transparent)" }} />

      <div className="wrapper relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center max-w-7xl mx-auto">

        {/* ── Left Column ── */}
        <div className="flex flex-col justify-center gap-6 max-w-2xl relative z-10">

          {/* Pill badge */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
            <div className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/30 bg-background/50 backdrop-blur-md overflow-hidden group">
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50" />
              <Zap className="w-4 h-4 text-primary relative z-10" />
              <span className="text-sm font-semibold tracking-wide text-foreground relative z-10">Up to 90% Off — Real Subscriptions</span>
              <span className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent skew-x-[-20deg] animate-[shimmer_2s_ease-in-out_infinite]" />
            </div>
          </div>

          {/* Headline with typewriter word */}
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200 fill-mode-both">
            <h1 className="font-extrabold tracking-tight text-foreground">
              {/* Line 1: static */}
              <span className="block text-3xl md:text-4xl font-bold text-foreground/60 mb-1">
                Get instant access to
              </span>
              {/* Line 2: typewriter — fixed height to prevent reflow */}
              <span className="block text-4xl md:text-5xl lg:text-[3.2rem] leading-[1.2] min-h-[1.3em]">
                <TypewriterWord />
              </span>
              {/* Line 3: static sub */}
              <span className="block text-2xl md:text-3xl font-bold text-foreground/60 mt-1">
                at up to 90% off retail
              </span>
            </h1>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-[90%] animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 fill-mode-both">
            We source genuine subscription vouchers directly through our exclusive reseller network — giving you access to 50+ premium tools at up to 90% off.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-1 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-400 fill-mode-both">
            <Button size="lg" asChild className="rounded-full bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 hover:-translate-y-1 transition-all duration-300 px-8 h-14">
              <Link href="#subscriptions">
                Browse Subscriptions <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full bg-transparent border-border/80 hover:bg-muted/50 text-foreground transition-all duration-300 px-8 h-14 group">
              <Link href={process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/923XXXXXXXXX"} target="_blank" rel="noopener noreferrer">
                <Play className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                How It Works
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-[450ms] fill-mode-both">
            {TRUST_BADGES.map((b) => (
              <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm text-xs font-medium text-muted-foreground">
                <span className="text-primary">{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500 fill-mode-both">
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 shadow-sm">
              <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-500">
                <Star className="w-5 h-5 fill-yellow-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground leading-none">{ratingTracker.toFixed(1)}/5</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">Platform Rating</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 shadow-sm">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground leading-none">
                  {membersCount > 9900 ? "10k+" : membersCount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground font-medium mt-1">Happy Subscribers</p>
              </div>
            </div>
          </div>

          {/* Brand Ticker */}
          <div className="animate-in fade-in duration-700 delay-700 fill-mode-both -mx-4">
            <BrandTicker />
          </div>
        </div>

        {/* ── Right Column: Deals Panel ── */}
        {rightPanel}

      </div>
    </section>
  );
};
