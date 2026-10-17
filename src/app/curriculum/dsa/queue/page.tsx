"use client"
import { AuthGuard } from "@/components/AuthGuard"
import QueueDsaGuidePage from "@/views/guide/QueueDsaGuidePage"
export default function Page() {
  return <AuthGuard><QueueDsaGuidePage /></AuthGuard>
}
