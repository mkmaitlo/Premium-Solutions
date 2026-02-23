"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

// Floating particle
const Particle = ({ style }: { style: React.CSSProperties }) => (
  <div className="absolute rounded-full bg-white pointer-events-none" style={style} />
);

type ParticleData = { id: number; style: React.CSSProperties };


export const CTASection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [particles, setParticles] = useState<ParticleData[]>([]);

  // Generate particles only on client to avoid SSR hydration mismatch
  useEffect(() => {
    setParticles(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        style: {
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          left: `${Math.random() * 100}%`,
          bottom: `-10px`,
          opacity: Math.random() * 0.4 + 0.1,
          animation: `floatUp ${Math.random() * 6 + 6}s linear ${Math.random() * 8}s infinite`,
        } as React.CSSProperties,
      }))
    );
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative  overflow-hidden" style={{ clipPath: "polygon(0 6%, 100% 0%, 100% 94%, 0 100%)" }}>
      {/* Base diagonal gradient */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 40%, hsl(var(--secondary)) 75%, hsl(var(--secondary)) 100%)" }}
      />

      {/* Animated morphing blobs */}
      <div
        className="absolute -top-1/4 -left-1/4 w-[60%] h-[130%] rounded-full opacity-30 pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(var(--secondary)) 0%, transparent 70%)",
          animation: "morphBlob1 10s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-[55%] h-[120%] rounded-full opacity-25 pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
          animation: "morphBlob2 12s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[150%] rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(var(--secondary)) 0%, transparent 60%)",
          animation: "morphBlob1 8s ease-in-out infinite alternate-reverse",
        }}
      />

      {/* Soft center radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 100%)" }}
      />

      {/* Dot grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Floating particles — client-only, generated after mount */}
      {particles.map((p: ParticleData) => (
        <Particle key={p.id} style={p.style} />
      ))}

      {/* Actual content */}
      <div
        ref={ref}
        className={`relative z-10 flex flex-col items-center text-center px-6 py-36 max-w-4xl mx-auto transition-all duration-1000 ease-out
          ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {/* Pre-label */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
          <Sparkles className="w-4 h-4 text-white/80" />
          <span className="text-white/80 text-sm font-semibold tracking-wide">Trusted by 10,000+ Smart Savers</span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
          Stop Overpaying for{" "}
          <span
            className="relative inline-block"
            style={{ textShadow: "0 0 40px rgba(196,181,253,0.7), 0 0 80px rgba(167,139,250,0.4)" }}
          >
            Premium Tools
            <span className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-white/40 blur-[2px]" />
          </span>
        </h2>

        {/* Subtext */}
        <p className="text-lg md:text-xl max-w-2xl mb-12 leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
          LinkedIn Premium, Adobe CC, Canva Pro, Spotify, and 50+ more — at up to 90% off.
          Thousands of people already save hundreds of dollars every month with our verified vouchers.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-5">
          <Link
            href="/sign-up"
            className="relative group overflow-hidden inline-flex items-center gap-3 px-10 py-4 rounded-full bg-background text-primary font-bold text-lg transition-all duration-300 hover:bg-transparent hover:text-white hover:border-white border-2 border-transparent hover:shadow-none"
            style={{
              boxShadow: "0 0 0 4px rgba(255,255,255,0.15), 0 8px 40px rgba(0,0,0,0.25)",
              animation: "ctaPulse 3s ease-in-out infinite",
            }}
          >
            {/* Shimmer sweep — every 3s */}
            <span
              className="absolute top-0 -left-[100%] w-[60%] h-full group-hover:hidden"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.15), transparent)",
                animation: "shimmerSweep 3s ease-in-out infinite",
                transform: "skewX(-20deg)",
              }}
            />
            Get Started for Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="https://wa.me/923144414882?text=Hi! I want to learn more about Premium Solutions."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors duration-200 group"
          >
            Chat with us on WhatsApp
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes morphBlob1 {
          0%   { transform: translate(0, 0) scale(1); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          100% { transform: translate(5%, 8%) scale(1.1); border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        @keyframes morphBlob2 {
          0%   { transform: translate(0, 0) scale(1); border-radius: 40% 60% 60% 40% / 40% 50% 60% 50%; }
          100% { transform: translate(-6%, -5%) scale(1.12); border-radius: 60% 40% 40% 60% / 60% 40% 60% 40%; }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1); opacity: 0.3; }
          50%  { opacity: 0.5; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
        @keyframes shimmerSweep {
          0%   { left: -100%; }
          50%, 100% { left: 200%; }
        }
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(255,255,255,0.15), 0 8px 40px rgba(0,0,0,0.25); }
          50%       { box-shadow: 0 0 0 8px rgba(255,255,255,0.08), 0 8px 60px rgba(0,0,0,0.3), 0 0 30px rgba(196,181,253,0.3); }
        }
      `}</style>
    </section>
  );
};
