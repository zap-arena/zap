"use client"

import { Metadata } from "next"
import { AuthGuard } from "@/components/AuthGuard"
import QuizListPage from "@/views/QuizListPage"

// Revalidate every 5 minutes (ISR) - quiz list can change
export const revalidate = 300

export const metadata: Metadata = {
  title: "Quizzes | ZAP - CodeZap.in",
  description:
    "Take quizzes on ZAP to test your knowledge. From basic to advanced DSA concepts. Track your progress and improve.",
  openGraph: {
    title: "Quizzes | ZAP",
    description: "Test your DSA knowledge with interactive quizzes.",
    type: "website",
    url: "https://codezap.in/quizzes",
  },
}

export default function Page() {
  return (
    <AuthGuard>
      <QuizListPage />
    </AuthGuard>
  )
}

