"use client"
import { AuthGuard } from "@/components/AuthGuard"
import SqlWorkflowPage from "@/views/SqlWorkflowPage"
export default function Page() {
  return <AuthGuard><SqlWorkflowPage /></AuthGuard>
}
