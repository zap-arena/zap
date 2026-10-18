"use client"

import { Metadata } from "next"
import { getGuideMetadata, getCourseSchema } from "@/lib/metadata"
import { JsonLd } from "@/components/JsonLd"
import { AuthGuard } from "@/components/AuthGuard"
import SqlGuidePage from "@/views/guide/SqlGuidePage"

// Revalidate every hour (ISR) - guides rarely change
export const revalidate = 3600

export const metadata: Metadata = getGuideMetadata(
  "SQL Fundamentals",
  "sql",
  "Master SQL queries, joins, and database optimization. Learn to write efficient queries and design schemas."
)

export default function Page() {
  return (
    <>
      <JsonLd
        data={getCourseSchema(
          "SQL Fundamentals",
          "Master SQL queries, joins, and database optimization.",
          5
        )}
      />
      <AuthGuard>
        <SqlGuidePage />
      </AuthGuard>
    </>
  )
}


