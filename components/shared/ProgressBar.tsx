"use client";

import { useEffect, useRef, useCallback } from "react";
import NProgress from "nprogress";
import { usePathname, useSearchParams } from "next/navigation";

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  speed: 300,
  minimum: 0.1,
  trickleSpeed: 100,
});

export default function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isNavigating = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Start progress on click
  const handleLinkClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a");
    
    if (link && link.href && !link.target && !link.download) {
      const url = new URL(link.href, window.location.origin);
      
      // Only trigger for internal links
      if (url.origin === window.location.origin) {
        const currentPath = window.location.pathname + window.location.search;
        const newPath = url.pathname + url.search;
        
        // Don't trigger for same page navigations or hash changes only
        if (currentPath !== newPath && !link.href.startsWith("#")) {
          isNavigating.current = true;
          NProgress.start();
          
          // Safety timeout - stop after 10s if route doesn't complete
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            NProgress.done();
            isNavigating.current = false;
          }, 10000);
        }
      }
    }
  }, []);

  // Complete progress when route changes
  useEffect(() => {
    if (isNavigating.current) {
      NProgress.done();
      isNavigating.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [pathname, searchParams]);

  // Add click listener
  useEffect(() => {
    document.addEventListener("click", handleLinkClick, true);
    return () => {
      document.removeEventListener("click", handleLinkClick, true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [handleLinkClick]);

  return null;
}
