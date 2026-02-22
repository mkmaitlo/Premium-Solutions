"use client";

import React, { useEffect, useRef, useState } from "react";
import { Shield, TrendingUp, CheckCircle } from "lucide-react";

interface FeatureCardProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  large?: boolean;
}

const FeatureCard = ({ number, icon, title, description, delay, large }: FeatureCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`relative group rounded-3xl border border-border bg-card p-8 overflow-hidden cursor-default
        transition-all duration-700 ease-out
        hover:border-transparent hover:shadow-[0_20px_60px_-15px_hsl(var(--primary) / 0.35)]
        hover:-translate-y-2
        ${large ? "lg:col-span-3 flex flex-col justify-between h-full" : ""}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      `}
      style={{ transitionDelay: visible ? "0ms" : `${delay}ms` }}
    >
      {/* Gradient border overlay on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))", padding: "1.5px" }}>
        <div className="w-full h-full rounded-3xl bg-card" />
      </div>
      {/* Trick: Use box-shadow + outline instead for cleaner hover border */}
      <div className="absolute inset-0 rounded-3xl ring-0 group-hover:ring-2 group-hover:ring-primary/60 transition-all duration-500 pointer-events-none" />

      {/* Faded number background */}
      <span className="absolute bottom-4 right-6 text-[7rem] font-black text-transparent leading-none select-none pointer-events-none transition-colors duration-300 group-hover:text-primary/10">
        {number}
      </span>

      {/* Dot-grid background pattern */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none rounded-3xl"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--primary))20 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Icon Area */}
      <div className="relative z-10 mb-8">
        <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 transition-transform duration-500 group-hover:scale-110">
          {/* Glow pulse behind */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 [&>svg]:w-8 [&>svg]:h-8 [&>svg]:stroke-[url(#icon-gradient)]">
            {icon}
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="relative z-10 flex-1">
        <h3 className="text-xl font-bold text-foreground mb-4 leading-snug">{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-base">{description}</p>
      </div>

      {large && (
        <div className="relative z-10 mt-8 pt-6">
          <div className="flex gap-3">
            {["Top Rated", "Verified", "Trusted"].map((badge) => (
              <span key={badge} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const FeaturesSection = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTitleVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative bg-background py-28 overflow-hidden">
      {/* SVG Gradient Def (reusable for icons) */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
        </defs>
      </svg>

      {/* Slow-parallax dot grid background for whole section */}
      <div
        className="absolute inset-0 -z-10 opacity-40 dark:opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--primary))15 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Lava lamp blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-primary/5 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-secondary/5 blur-[100px] pointer-events-none -z-10" />

      <div className="wrapper max-w-6xl mx-auto">
        {/* Section Heading */}
        <div
          ref={titleRef}
          className={`text-center mb-20 transition-all duration-1000 ease-out ${
            titleVisible ? "opacity-100 translate-y-0 clip-to-full" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-4">Why We&apos;re Different</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
            Save More With{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Premium Solutions
            </span>
          </h2>
          <p className="mt-5 text-muted-foreground md:text-lg max-w-2xl mx-auto">
            We partner directly with resellers to bring you verified subscription vouchers at up to 90% off — no compromises, no risks, just real savings on the tools you use every day.
          </p>
        </div>

        {/* Asymmetric Grid: Large left card + Two stacked right cards */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          
          {/* Large Feature Card (takes 3 of 5 cols) */}
          <div className="lg:col-span-3 h-full">
            <FeatureCard
              number="01"
              icon={<Shield />}
              title="100% Genuine Vouchers"
              description="Every subscription code we sell is sourced through verified partner networks and tested before listing. We stand behind every voucher — if it doesn’t work, we replace or refund it, no questions asked. Your trust is our business."
              delay={100}
              large
            />
          </div>

          {/* Two stacked smaller cards (takes 2 of 5 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6 h-full">
            <FeatureCard
              number="02"
              icon={<TrendingUp />}
              title="Up to 90% Off Retail"
              description="Get LinkedIn Premium, Canva Pro, Spotify, Adobe CC and 50+ more at a fraction of their original price through our exclusive supplier connections."
              delay={250}
            />
            <FeatureCard
              number="03"
              icon={<CheckCircle />}
              title="Instant Delivery"
              description="Order in seconds, receive your activation code instantly. No waiting, no delays — get your subscription live within minutes of purchase."
              delay={400}
            />
          </div>

        </div>
      </div>
    </section>
  );
};
