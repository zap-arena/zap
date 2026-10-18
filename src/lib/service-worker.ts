/**
 * Service Worker Registration
 * Enables PWA features: offline support, background sync, caching
 */

export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        console.log("Service Worker registered:", registration);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Every minute
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

/**
 * Sync pending submissions when connection restored
 */
export function syncPendingSubmissions() {
  if (typeof window === "undefined" || !navigator.serviceWorker.controller)
    return;

  window.addEventListener("online", () => {
    navigator.serviceWorker.controller?.postMessage({
      type: "SYNC_PENDING",
    });
  });
}
