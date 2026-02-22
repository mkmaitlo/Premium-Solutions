"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Separator } from "../ui/separator";
import NavItems from "./NavItems";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SectionNavLink from "./SectionNavLink";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const PUBLIC_LINKS = [
  { label: "Why Us",           sectionId: "services"     },
  { label: "Subscriptions",    sectionId: "events"       },
  { label: "Customer Stories", sectionId: "testimonials" },
];

const MobNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            aria-label="Open mobile menu"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
        </SheetTrigger>

        <SheetContent className="flex flex-col gap-6 bg-background border-border">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <Image
              src="/assets/images/logo.svg"
              width={30}
              height={30}
              alt="PremiumSolutions logo"
            />
            <span className="font-bold text-[1.3rem] font-sans text-foreground">
              Premium Solutions
            </span>
          </Link>

          <Separator />

          {/* Signed-in: show admin nav items */}
          <SignedIn>
            <NavItems />
          </SignedIn>

          {/* Signed-out: show public section links + auth buttons */}
          <SignedOut>
            <div className="flex flex-col gap-1">
              {PUBLIC_LINKS.map((link) => (
                <SectionNavLink
                  key={link.label}
                  sectionId={link.sectionId}
                  label={link.label}
                  className="w-full text-left px-3 py-3 rounded-xl text-base font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                  onNavigate={() => setOpen(false)}
                >
                  {link.label}
                </SectionNavLink>
              ))}
            </div>

            <Separator />

            <div className="flex flex-col gap-3 mt-auto">
              <Button
                asChild
                variant="outline"
                className="w-full rounded-full border-border text-foreground hover:bg-muted hover:text-primary transition-all"
                onClick={() => setOpen(false)}
              >
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button
                asChild
                className="w-full rounded-full bg-gradient-to-r from-primary to-secondary text-white border-none hover:shadow-lg hover:shadow-primary/25 transition-all"
                onClick={() => setOpen(false)}
              >
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </SignedOut>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobNav;