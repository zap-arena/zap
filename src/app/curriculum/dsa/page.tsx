"use client"
import { AuthGuard } from "@/components/AuthGuard"
import CurriculumDSAPage from "@/views/CurriculumDSAPage"
export default function Page() {
  return <AuthGuard><CurriculumDSAPage /></AuthGuard>
}
