"use client"
import { AuthGuard } from "@/components/AuthGuard"
import WorkflowPuzzlePage from "@/views/WorkflowPuzzlePage"
export default function Page() {
  return <AuthGuard><WorkflowPuzzlePage /></AuthGuard>
}
