"use client"
import { AuthGuard } from "@/components/AuthGuard"
import DP1DGuidePage from "@/views/guide/DP1DGuidePage"
export default function Page() {
  return <AuthGuard><DP1DGuidePage /></AuthGuard>
}
