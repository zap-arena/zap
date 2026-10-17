"use client"
import { AuthGuard } from "@/components/AuthGuard"
import SdlcGuidePage from "@/views/guide/SdlcGuidePage"
export default function Page() {
  return <AuthGuard><SdlcGuidePage /></AuthGuard>
}
