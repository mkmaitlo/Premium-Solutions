"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

interface SectionNavLinkProps {
  /** The section hash WITHOUT the `#`, e.g. "services" */
  sectionId: string;
  label: string;
  className?: string;
  children?: React.ReactNode;
  /** Optional callback fired after navigation — useful for closing a mobile menu */
  onNavigate?: () => void;
}

/**
 * Smart navigation link for landing-page section anchors.
 * - If the user is already on `/`, smoothly scrolls to the section.
 * - If on any other page, navigates to `/#<sectionId>` so the browser
 *   lands at the correct position after the page loads.
 */
export default function SectionNavLink({
  sectionId,
  label,
  className,
  children,
  onNavigate,
}: SectionNavLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (pathname === "/") {
        // Already on home page — smooth scroll with fixed-header offset
        const el = document.getElementById(sectionId);
        if (el) {
          const headerHeight = 80; // matches the header h-20
          const top =
            el.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({ top, behavior: "smooth" });
        }
      } else {
        // Navigate to home page with hash; browser will jump to anchor
        router.push(`/#${sectionId}`);
      }
      onNavigate?.();
    },
    [pathname, router, sectionId, onNavigate]
  );

  return (
    <button
      onClick={handleClick}
      aria-label={`Navigate to ${label} section`}
      className={className}
    >
      {children ?? label}
    </button>
  );
}
