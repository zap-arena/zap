"use client"
import { AuthGuard } from "@/components/AuthGuard"
import TwoPointerDsaGuidePage from "@/views/guide/TwoPointerDsaGuidePage"
export default function Page() {
  return <AuthGuard><TwoPointerDsaGuidePage /></AuthGuard>
}
