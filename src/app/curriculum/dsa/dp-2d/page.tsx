"use client"
import { AuthGuard } from "@/components/AuthGuard"
import DP2DGuidePage from "@/views/guide/DP2DGuidePage"
export default function Page() {
  return <AuthGuard><DP2DGuidePage /></AuthGuard>
}
