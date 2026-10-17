"use client"
import { AuthGuard } from "@/components/AuthGuard"
import LinkedListDsaGuidePage from "@/views/guide/LinkedListDsaGuidePage"
export default function Page() {
  return <AuthGuard><LinkedListDsaGuidePage /></AuthGuard>
}
