"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/store/auth"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && !user) {
      router.push("/login")
    }
  }, [user, isInitialized, router])

  if (!isInitialized) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
  if (!user) return null

  return <>{children}</>
}
