"use client"
import { AuthGuard } from "@/components/AuthGuard"
import HashingDsaGuidePage from "@/views/guide/HashingDsaGuidePage"
export default function Page() {
  return <AuthGuard><HashingDsaGuidePage /></AuthGuard>
}
