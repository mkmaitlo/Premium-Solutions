"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Mail, MapPin, Loader2 } from "lucide-react";
import { PK_CITIES } from "@/components/seo/LocalBusinessJsonLd";
import { subscribeEmail } from "@/lib/actions/subscriber.actions";

// Show top 6 cities in footer; rest accessible via /locations
const FOOTER_CITIES = PK_CITIES.slice(0, 6);

const NAVIGATE_LINKS = [
  { label: "Home",             href: "/"              },
  { label: "Why Us",           href: "/#services"     },
  { label: "Subscriptions",    href: "/#subscriptions"       },
  { label: "Customer Stories", href: "/#testimonials" },
];

const ACCOUNT_LINKS = [
  { label: "Sign In",      href: "/sign-in" },
  { label: "Get Started",  href: "/sign-up" },
];

const SOCIAL = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/premium_.solutions?igsh=MW45MGZkdDV3MDgwMg==",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1bxvUA4Mue/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/923XXXXXXXXX",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

const FooterLinkCol = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) => (
  <div className="flex flex-col gap-5">
    <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-foreground/50">
      {title}
    </h4>
    <ul className="flex flex-col gap-3">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className="relative text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1.5 group w-fit"
          >
            <span className="absolute left-0 bottom-[-1px] h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const socialRef = useRef<HTMLDivElement>(null);
  const [socialVisible, setSocialVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setSocialVisible(true); observer.disconnect(); }
      },
      { threshold: 0.3 }
    );
    if (socialRef.current) observer.observe(socialRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setMessage(null);
    startTransition(async () => {
      const result = await subscribeEmail(email);
      if (result.success) {
        setSubscribed(true);
        setEmail("");
      }
      setMessage({ text: result.message, ok: result.success });
    });
  };

  return (
    <footer
      className="relative overflow-hidden border-t border-border/40"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Subtle radial center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 100%, hsl(var(--primary) / 0.05) 0%, transparent 100%)" }}
      />
      {/* Dot texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* Main grid: brand | navigate | account | locations | newsletter */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 border-b border-border/40">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-6 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div
                className="w-8 h-8 overflow-hidden relative"
              >
                <Image src="/assets/images/premiumsolutions.png" alt="Premium Solutions" fill className="object-contain" />
              </div>
              <span
                className="font-extrabold text-xl tracking-tight text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)))" }}
              >
                Premium Solutions
              </span>
            </Link>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-[240px]">
              50+ premium subscriptions at up to 90% off — genuine vouchers, instant delivery, every time.
            </p>

            {/* Social icons */}
            <div ref={socialRef} className="flex gap-2.5">
              {SOCIAL.map((s, i) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-border transition-all duration-300 hover:scale-110 hover:border-primary hover:text-primary"
                  style={{
                    color: "hsl(var(--foreground))",
                    opacity: socialVisible ? 1 : 0,
                    transform: socialVisible ? "scale(1) translateY(0)" : "scale(0.6) translateY(8px)",
                    transition: `opacity 0.4s ease ${i * 80}ms, transform 0.4s ease ${i * 80}ms`,
                  }}
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 2 — Navigate */}
          <FooterLinkCol title="Navigate" links={NAVIGATE_LINKS} />

          {/* Col 3 — Account */}
          <FooterLinkCol title="Account" links={ACCOUNT_LINKS} />

          {/* Col 4 — Locations (local SEO internal links) */}
          <div className="flex flex-col gap-5">
            <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-foreground/50">
              Locations
            </h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_CITIES.map((city) => (
                <li key={city.name}>
                  <Link
                    href={`/locations/${city.name.toLowerCase()}`}
                    className="relative text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1.5 group w-fit"
                  >
                    <MapPin className="w-3 h-3 text-primary/60" />
                    {city.name}
                    <span className="absolute left-0 bottom-[-1px] h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/locations"
                  className="text-xs text-primary/70 hover:text-primary transition-colors mt-1 flex items-center gap-1"
                >
                  View all cities →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 — Newsletter */}
          <div className="flex flex-col gap-5">
            <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-foreground/50">
              Stay in the Loop
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get the latest deals and new subscription drops straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              {!subscribed ? (
                <>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={isPending}
                    className="w-full px-4 py-2.5 rounded-xl text-foreground text-sm outline-none transition-all duration-300 placeholder:text-muted-foreground/50 disabled:opacity-60"
                    style={{
                      background: "hsl(var(--muted) / 0.5)",
                      border: "1px solid hsl(var(--border))",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "hsl(var(--primary))";
                      e.target.style.boxShadow = "0 0 0 3px hsl(var(--primary) / 0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "hsl(var(--border))";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isPending}
                    className="relative overflow-hidden w-full py-2.5 rounded-xl font-semibold text-white text-sm transition-all duration-300 hover:opacity-90 hover:shadow-lg group flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))",
                      boxShadow: "0 4px 16px hsl(var(--primary) / 0.25)",
                    }}
                  >
                    <span
                      className="absolute top-0 -left-[100%] w-[60%] h-full group-hover:left-[200%] transition-all duration-700"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", transform: "skewX(-20deg)" }}
                    />
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    {isPending ? "Subscribing…" : "Subscribe"}
                  </button>
                  {/* Inline feedback message */}
                  {message && (
                    <p className={`text-xs font-medium text-center ${message.ok ? "text-emerald-500" : "text-red-500"}`}>
                      {message.text}
                    </p>
                  )}
                </>
              ) : (
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-emerald-500 text-sm font-semibold"
                  style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
                >
                  <Sparkles className="w-4 h-4" />
                  {message?.text || "You're subscribed — welcome aboard!"}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground/50 text-xs">
            © {new Date().getFullYear()} Premium Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground/50">
            <span>Made with <span style={{ color: "hsl(var(--primary))" }}>♥</span> for smart savers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;