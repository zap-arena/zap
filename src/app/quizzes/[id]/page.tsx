"use client"
import { AuthGuard } from "@/components/AuthGuard"
import QuizTakingPage from "@/views/QuizTakingPage"
export default function Page() {
  return <AuthGuard><QuizTakingPage /></AuthGuard>
}
