"use client"
import { AuthGuard } from "@/components/AuthGuard"
import RecursionDsaGuidePage from "@/views/guide/RecursionDsaGuidePage"
export default function Page() {
  return <AuthGuard><RecursionDsaGuidePage /></AuthGuard>
}
