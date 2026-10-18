"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/sonner"
import { useState, useEffect } from "react"
import RouteTransitionLoader from "@/components/RouteTransitionLoader"
import { initWebVitals } from "@/lib/analytics"
import { registerServiceWorker, syncPendingSubmissions } from "@/lib/service-worker"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15000,
      retry: 1,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Initialize web vitals tracking
    initWebVitals()
    // Register service worker for offline support
    registerServiceWorker()
    // Setup sync for pending submissions
    syncPendingSubmissions()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {mounted && <RouteTransitionLoader />}
      {children}
      {mounted && <Toaster position="top-center" richColors />}
    </QueryClientProvider>
  )
}
