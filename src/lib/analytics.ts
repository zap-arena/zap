/**
 * Web Vitals Analytics
 * Tracks Core Web Vitals and reports to Vercel Analytics
 */

export function initWebVitals() {
  // Dynamic import to avoid loading in SSR
  if (typeof window === "undefined") return;

  import("web-vitals").then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
    // Cumulative Layout Shift (CLS)
    onCLS?.((metric: { value: number }) => {
      console.log("CLS:", metric.value);
      trackWebVital("cls", metric.value);
    });

    // Interaction to Next Paint (INP)
    onINP?.((metric: { value: number }) => {
      console.log("INP:", metric.value);
      trackWebVital("inp", metric.value);
    });

    // First Contentful Paint (FCP)
    onFCP?.((metric: { value: number }) => {
      console.log("FCP:", metric.value);
      trackWebVital("fcp", metric.value);
    });

    // Largest Contentful Paint (LCP)
    onLCP?.((metric: { value: number }) => {
      console.log("LCP:", metric.value);
      trackWebVital("lcp", metric.value);
    });

    // Time to First Byte (TTFB)
    onTTFB?.((metric: { value: number }) => {
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
