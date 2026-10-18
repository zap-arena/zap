// Service Worker for ZAP
// Enables offline support, background sync, and PWA capabilities

const CACHE_NAME = "zap-v1";
const urlsToCache = [
  "/",
  "/offline.html",
  "/manifest.json",
];

// Install event - cache essential assets
self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event: FetchEvent) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip API calls (let them fail offline)
  if (event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version if available
      if (response) {
        return response;
      }

      // Otherwise fetch from network
      return fetch(event.request).then((response) => {
        // Cache successful responses
        if (!response || response.status !== 200) {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    }),
  );
});

// Handle background sync (for form submissions when offline)
self.addEventListener("sync", (event: any) => {
  if (event.tag === "sync-submissions") {
    event.waitUntil(
      // Retry pending submissions when connection restored
      fetch("/api/sync-pending", { method: "POST" }).catch(() => {
        // Fail silently, user can retry manually
      }),
    );
  }
});

export {};
