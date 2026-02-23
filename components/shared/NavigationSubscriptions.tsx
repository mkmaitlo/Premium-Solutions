"use client";

import { Suspense } from "react";
import ProgressBar from "./ProgressBar";

// Wrap in Suspense for useSearchParams
export default function NavigationSubscriptions() {
  return (
    <Suspense fallback={null}>
      <ProgressBar />
    </Suspense>
  );
}
