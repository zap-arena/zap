"use client"
import { AuthGuard } from "@/components/AuthGuard"
import QuizListPage from "@/views/QuizListPage"
export default function Page() {
  return <AuthGuard><QuizListPage /></AuthGuard>
}
