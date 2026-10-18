"use client"

import { Metadata } from "next"
import { getContestMetadata } from "@/lib/metadata"
import ContestEntryPage from "@/views/ContestEntryPage"

// Generate metadata for contest pages
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/contests/${params.slug}`
    )
    if (!response.ok) {
      throw new Error("Contest not found")
    }
    const contest = await response.json()
    return getContestMetadata(
      contest.name || contest.title,
      params.slug,
      contest.description || "Join this coding contest on ZAP",
      contest.imageUrl
    )
  } catch {
    return {
      title: "Contest | ZAP - CodeZap.in",
      description: "Join a coding contest on ZAP",
    }
  }
}

export default ContestEntryPage

