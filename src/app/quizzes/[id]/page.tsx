"use client"

import { Metadata } from "next"
import { getQuizMetadata } from "@/lib/metadata"
import { AuthGuard } from "@/components/AuthGuard"
import QuizTakingPage from "@/views/QuizTakingPage"

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/quizzes/${params.id}`
    )
    if (!response.ok) {
      throw new Error("Quiz not found")
    }
    const quiz = await response.json()
    return getQuizMetadata(
      quiz.name || quiz.title,
      params.id,
      quiz.description || "Take this quiz on ZAP",
      quiz.difficulty
    )
  } catch {
    return {
      title: "Quiz | ZAP - CodeZap.in",
      description: "Take a quiz on ZAP",
    }
  }
}

export default function Page() {
  return (
    <AuthGuard>
      <QuizTakingPage />
    </AuthGuard>
  )
}

