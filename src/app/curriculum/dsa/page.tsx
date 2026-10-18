"use client"

import { Metadata } from "next"
import { AuthGuard } from "@/components/AuthGuard"
import CurriculumDSAPage from "@/views/CurriculumDSAPage"

// Revalidate every 24 hours (ISR) - curriculum rarely changes
export const revalidate = 86400

export const metadata: Metadata = {
  title: "DSA Curriculum | ZAP - CodeZap.in",
  description:
    "Complete Data Structures & Algorithms curriculum with 19+ interactive guides. Learn from basics to advanced concepts.",
  openGraph: {
    title: "DSA Learning Curriculum | ZAP",
    description: "Master DSA with our comprehensive curriculum and interactive guides.",
    type: "website",
    url: "https://codezap.in/curriculum/dsa",
  },
}

export default function Page() {
  return (
    <AuthGuard>
      <CurriculumDSAPage />
    </AuthGuard>
  )
}

