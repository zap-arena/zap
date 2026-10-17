"use client"
import { AuthGuard } from "@/components/AuthGuard"
import OopsVisualGuidePage from "@/views/guide/OopsVisualGuidePage"
export default function Page() {
  return <AuthGuard><OopsVisualGuidePage /></AuthGuard>
}
