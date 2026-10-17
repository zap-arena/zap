"use client"
import { AuthGuard } from "@/components/AuthGuard"
import OopsGuidePage from "@/views/guide/OopsGuidePage"
export default function Page() {
  return <AuthGuard><OopsGuidePage /></AuthGuard>
}
