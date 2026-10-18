"use client"

import { Metadata } from "next"
import CodeWarPage from "@/views/CodeWarPage"

// Revalidate every 10 minutes (ISR) - CodeWar problems can change
export const revalidate = 600

export const metadata: Metadata = {
  title: "CodeWar | ZAP - CodeZap.in",
  description:
    "Practice with CodeWar on ZAP. Solve algorithm problems, battle with friends, and improve your coding skills.",
  openGraph: {
    title: "CodeWar - Practice Problems | ZAP",
    description: "Battle and solve algorithmic problems with CodeWar mode.",
    type: "website",
    url: "https://codezap.in/codewar",
  },
}

export default CodeWarPage

