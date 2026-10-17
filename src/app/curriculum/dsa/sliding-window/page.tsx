"use client"
import { AuthGuard } from "@/components/AuthGuard"
import SlidingWindowDsaGuidePage from "@/views/guide/SlidingWindowDsaGuidePage"
export default function Page() {
  return <AuthGuard><SlidingWindowDsaGuidePage /></AuthGuard>
}
