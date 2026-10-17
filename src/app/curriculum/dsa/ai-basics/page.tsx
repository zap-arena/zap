"use client"
import { AuthGuard } from "@/components/AuthGuard"
import AIBasicsGuidePage from "@/views/guide/AIBasicsGuidePage"
export default function Page() {
  return <AuthGuard><AIBasicsGuidePage /></AuthGuard>
}
