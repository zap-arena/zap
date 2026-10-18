/**
 * Web Vitals Analytics
 * Tracks Core Web Vitals and reports to Vercel Analytics
 */

export function initWebVitals() {
  // Dynamic import to avoid loading in SSR
  if (typeof window === "undefined") return;

  import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    // Cumulative Layout Shift (CLS)
    getCLS((metric) => {
      console.log("CLS:", metric.value);
      trackWebVital("cls", metric.value);
    });

    // First Input Delay (FID)
    getFID((metric) => {
      console.log("FID:", metric.value);
      trackWebVital("fid", metric.value);
    });

    // First Contentful Paint (FCP)
    getFCP((metric) => {
      console.log("FCP:", metric.value);
      trackWebVital("fcp", metric.value);
    });

    // Largest Contentful Paint (LCP)
    getLCP((metric) => {
      console.log("LCP:", metric.value);
      trackWebVital("lcp", metric.value);
    });

    // Time to First Byte (TTFB)
    getTTFB((metric) => {
      console.log("TTFB:", metric.value);
      trackWebVital("ttfb", metric.value);
    });
  });
}

/**
 * Send web vital metric to analytics service
 */
function trackWebVital(name: string, value: number) {
  // Send to analytics endpoint or service
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/web-vitals", JSON.stringify({ name, value }));
  }

  // Send to Vercel Analytics if available
  if (typeof window !== "undefined" && (window as any).va) {
    (window as any).va.track("web-vital", { name, value });
  }
}
