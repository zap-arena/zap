"use client"
import { AuthGuard } from "@/components/AuthGuard"
import GraphDsaGuidePage from "@/views/guide/GraphDsaGuidePage"
export default function Page() {
  return <AuthGuard><GraphDsaGuidePage /></AuthGuard>
}
