"use client"

import { Metadata } from "next"
import HomePage from "@/views/HomePage"

// Revalidate every 24 hours (ISR)
export const revalidate = 86400

export const metadata: Metadata = {
  title: "ZAP - Interactive DSA Learning Platform | Compete & Master Algorithms",
  description:
    "Learn Data Structures & Algorithms with interactive challenges, live contests, and AI-guided paths. Practice coding problems and compete with the community.",
  openGraph: {
    title: "ZAP - Interactive DSA Learning Platform",
    description:
      "Master DSA with interactive visualization, coding challenges, and contests.",
    type: "website",
    url: "https://codezap.in",
  },
}

export default HomePage

