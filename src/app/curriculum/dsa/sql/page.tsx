"use client"
import { AuthGuard } from "@/components/AuthGuard"
import SqlGuidePage from "@/views/guide/SqlGuidePage"
export default function Page() {
  return <AuthGuard><SqlGuidePage /></AuthGuard>
}
