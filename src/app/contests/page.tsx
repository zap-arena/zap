"use client"

import { Metadata } from "next"
import ContestLandingPage from "@/views/ContestLandingPage"

// Revalidate every 5 minutes (ISR) - contests can change frequently
export const revalidate = 300

export const metadata: Metadata = {
  title: "Contests | ZAP - CodeZap.in",
  description:
    "Participate in coding contests on ZAP. Compete with others, solve algorithmic problems, and climb the leaderboard.",
  openGraph: {
    title: "Coding Contests | ZAP",
    description: "Join contests and compete with the ZAP community.",
    type: "website",
    url: "https://codezap.in/contests",
  },
}

export default ContestLandingPage

