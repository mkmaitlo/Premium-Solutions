"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavItems from "./NavItems";
import MobNav from "./MobNav";
import { ThemeToggle } from "../ThemeToggle";
import SectionNavLink from "./SectionNavLink";

interface ClientHeaderProps {
  isAdmin: boolean;
}

const PUBLIC_LINKS = [
  { label: "Why Us",           sectionId: "services"     },
  { label: "Subscriptions",    sectionId: "events"       },
  { label: "Customer Stories", sectionId: "testimonials" },
];

export default function ClientHeader({ isAdmin }: ClientHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${
        isScrolled
          ? "h-16 bg-background/70 backdrop-blur-lg border-b border-primary/20 shadow-[0_4px_30px_hsl(var(--primary) / 0.1)]"
          : "h-20 bg-background border-b border-transparent"
      }`}
    >
      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 z-[-1] opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
      />

      <div className="wrapper h-full flex items-center justify-between transition-all duration-300">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center p-1 rounded-md bg-gradient-to-tr from-primary/10 to-secondary/10 border border-primary/20">
            <Sparkle className="w-5 h-5 text-primary animate-pulse" />
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-md bg-primary/20 blur-sm group-hover:bg-primary/40 transition-colors duration-500" />
          </div>
          <span className="font-extrabold text-[1.4rem] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:opacity-80">
            Premium Solutions
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <SignedIn>
            {isAdmin && <NavItems />}
          </SignedIn>
          
          <SignedOut>
            {PUBLIC_LINKS.map((link) => (
              <SectionNavLink
                key={link.label}
                sectionId={link.sectionId}
                label={link.label}
                className="relative text-sm font-medium text-foreground/80 hover:text-foreground transition-colors group py-2"
              >
                {link.label}
                {/* Underline hover effect */}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 ease-in-out group-hover:w-full" />
              </SectionNavLink>
            ))}
          </SignedOut>
        </nav>

        {/* Actions & Buttons */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <SignedIn>
            <UserButton />
            {isAdmin && (
              <div className="md:hidden flex">
                <MobNav />
              </div>
            )}
          </SignedIn>

          <SignedOut>
            {/* Desktop auth buttons — hide below md where desktop nav also disappears */}
            <div className="hidden md:flex items-center gap-3">
              <Button asChild variant="outline" className="rounded-full border-border/80 text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-300">
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button asChild className="relative rounded-full bg-gradient-to-r from-primary to-secondary border-none hover:shadow-lg hover:shadow-primary/25 overflow-hidden group transition-all duration-300 text-white dark:text-white">
                <Link href="/sign-up">
                  Get Started
                  <span className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] group-hover:animate-[shimmer_1s_ease-in-out_infinite]" />
                </Link>
              </Button>
            </div>
            {/* Mobile hamburger — visible below md, matching when desktop nav hides */}
            <div className="md:hidden">
              <MobNav />
            </div>
          </SignedOut>
        </div>

      </div>
    </header>
  );
}
