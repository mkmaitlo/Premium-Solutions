"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Twitter, Github, Linkedin, Youtube, ArrowRight, Sparkles, Mail } from "lucide-react";

const NAVIGATE_LINKS = [
  { label: "Home",             href: "/"              },
  { label: "Why Us",           href: "/#services"     },
  { label: "Subscriptions",    href: "/#events"       },
  { label: "Customer Stories", href: "/#testimonials" },
  { label: "About Us",         href: "/about"         },
];

const ACCOUNT_LINKS = [
  { label: "Sign In",      href: "/sign-in" },
  { label: "Get Started",  href: "/sign-up" },
];

const SOCIAL = [
  { icon: <Twitter  className="w-4 h-4" />, href: "#", label: "Twitter"  },
  { icon: <Linkedin className="w-4 h-4" />, href: "#", label: "LinkedIn" },
  { icon: <Github   className="w-4 h-4" />, href: "#", label: "GitHub"   },
  { icon: <Youtube  className="w-4 h-4" />, href: "#", label: "YouTube"  },
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
  const [subscribed, setSubscribed] = useState(false);

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
    if (email) { setSubscribed(true); setEmail(""); }
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

        {/* Main grid: brand | navigate | account | newsletter */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-border/40">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-6 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div
                className="p-1.5 rounded-lg"
                style={{ background: "hsl(var(--primary) / 0.15)", border: "1px solid hsl(var(--primary) / 0.2)" }}
              >
                <Sparkles className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
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
                    className="w-full px-4 py-2.5 rounded-xl text-foreground text-sm outline-none transition-all duration-300 placeholder:text-muted-foreground/50"
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
                    className="relative overflow-hidden w-full py-2.5 rounded-xl font-semibold text-white text-sm transition-all duration-300 hover:opacity-90 hover:shadow-lg group flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))",
                      boxShadow: "0 4px 16px hsl(var(--primary) / 0.25)",
                    }}
                  >
                    <span
                      className="absolute top-0 -left-[100%] w-[60%] h-full group-hover:left-[200%] transition-all duration-700"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", transform: "skewX(-20deg)" }}
                    />
                    <Mail className="w-4 h-4" />
                    Subscribe
                  </button>
                </>
              ) : (
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-emerald-500 text-sm font-semibold"
                  style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
                >
                  <Sparkles className="w-4 h-4" />
                  You&apos;re subscribed — welcome aboard!
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