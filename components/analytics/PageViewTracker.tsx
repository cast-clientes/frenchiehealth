"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analytics } from "@/lib/analytics/events";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    analytics.pageView(pathname, window.location.href);
  }, [pathname]);

  return null;
}
