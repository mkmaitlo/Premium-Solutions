"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  PlusCircle,
  Menu,
  X,
  LayoutDashboard,
  Sparkles,
  Users,
  MessageSquare,
  Tag,
  Mail,
} from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { UserButton } from "@clerk/nextjs";

const LINKS = [
  { href: "/dashboard",          label: "Dashboard",          icon: LayoutDashboard, description: "Stats & user management"       },
  { href: "/my-subscriptions",   label: "My Subscriptions",   icon: Users,           description: "Manage your listings"          },
  { href: "/deals",              label: "Hero Deals",         icon: Tag,             description: "Featured offers on homepage"   },
  { href: "/reviews",            label: "Reviews",            icon: MessageSquare,   description: "Moderate customer reviews"     },
  { href: "/subscribers",        label: "Subscribers",        icon: Mail,            description: "Newsletter email list"         },
  { href: "/subscriptions/create", label: "Create Subscription", icon: PlusCircle,  description: "Add a new plan"                },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setIsOpen(false); }, [pathname]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full gap-6 relative z-50 overflow-y-auto w-full">
      
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 pb-2">
        <div
          className="w-9 h-9 relative overflow-hidden flex items-center justify-center flex-shrink-0"
        >
          <Image src="/assets/images/premiumsolutions.png" alt="Admin Logo" fill className="object-contain" />
        </div>
        <div>
          <p className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary uppercase tracking-[0.2em]">
            Admin Panel
          </p>
          <p className="text-[10px] text-muted-foreground font-medium tracking-wide">
            PremiumSolutions
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-primary/30 via-secondary/20 to-transparent" />

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] px-1 mb-1">
          Navigation
        </p>
        {LINKS.map((link, i) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (pathname?.startsWith(link.href + "/") ?? false);
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{ animationDelay: `${i * 80}ms` }}
              className={`
                group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold
                transition-all duration-300 overflow-hidden
                ${isActive
                  ? "text-primary-foreground shadow-lg"
                  : "text-foreground/70 hover:text-foreground hover:bg-primary/8"
                }
              `}
            >
              {/* Active gradient background */}
              {isActive && (
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
                />
              )}
              {/* Hover shimmer */}
              {!isActive && (
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/10 to-secondary/10" />
              )}

              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0 transition-all duration-300 ${
                  isActive
                    ? "bg-white/20"
                    : "bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isActive ? "text-white" : "text-primary group-hover:scale-110"
                  }`}
                />
              </div>

              <div className="relative z-10 flex flex-col min-w-0">
                <span className={isActive ? "text-white" : ""}>{link.label}</span>
                <span className={`text-[10px] font-normal leading-tight ${isActive ? "text-white/70" : "text-muted-foreground/70"}`}>
                  {link.description}
                </span>
              </div>

              {isActive && (
                <div className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Back to site */}
      <Link
        href="/"
        className="group flex items-center gap-2.5 text-xs font-medium text-muted-foreground hover:text-primary transition-all duration-300 px-1"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        </span>
        Back to main website
      </Link>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {mounted && <UserButton afterSignOutUrl="/" />}
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-foreground">Administrator</span>
            <span className="text-[10px] text-muted-foreground">Full access</span>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-2xl border-b border-border/50 z-[40] flex items-center justify-between px-5 shadow-[0_4px_30px_hsl(var(--primary)/0.08)]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 relative overflow-hidden flex items-center justify-center"
          >
            <Image src="/assets/images/premiumsolutions.png" alt="Logo" fill className="object-contain" />
          </div>
          <p className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary uppercase tracking-[0.15em]">
            Admin Panel
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-[50] bg-background/70 backdrop-blur-sm transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-[60] w-[270px] lg:w-72 border-r border-border/40 bg-card/95 lg:bg-card/70 backdrop-blur-2xl p-6 transition-transform duration-300 ease-in-out shadow-[6px_0_24px_-8px_hsl(var(--primary)/0.15)] ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar inner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

        <button
          className="lg:hidden absolute top-4 right-4 p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors z-[70]"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent />
      </aside>
    </>
  );
}
