"use client"
import { AuthGuard } from "@/components/AuthGuard"
import ContestWorkspacePage from "@/views/ContestWorkspacePage"
export default function Page() {
  return <AuthGuard><ContestWorkspacePage /></AuthGuard>
}
