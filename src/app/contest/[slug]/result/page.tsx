"use client"
import { AuthGuard } from "@/components/AuthGuard"
import ContestResultPage from "@/views/ContestResultPage"
export default function Page() {
  return <AuthGuard><ContestResultPage /></AuthGuard>
}
