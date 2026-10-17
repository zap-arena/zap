"use client"
import { AuthGuard } from "@/components/AuthGuard"
import TreeDsaGuidePage from "@/views/guide/TreeDsaGuidePage"
export default function Page() {
  return <AuthGuard><TreeDsaGuidePage /></AuthGuard>
}
