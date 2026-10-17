"use client"
import { AuthGuard } from "@/components/AuthGuard"
import FlaskApiGuidePage from "@/views/guide/FlaskApiGuidePage"
export default function Page() {
  return <AuthGuard><FlaskApiGuidePage /></AuthGuard>
}
