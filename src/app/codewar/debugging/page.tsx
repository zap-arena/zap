"use client"
import { AuthGuard } from "@/components/AuthGuard"
import DebuggingWarPage from "@/views/DebuggingWarPage"
export default function Page() {
  return <AuthGuard><DebuggingWarPage /></AuthGuard>
}
