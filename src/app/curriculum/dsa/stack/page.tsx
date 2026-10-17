"use client"
import { AuthGuard } from "@/components/AuthGuard"
import StackDsaGuidePage from "@/views/guide/StackDsaGuidePage"
export default function Page() {
  return <AuthGuard><StackDsaGuidePage /></AuthGuard>
}
