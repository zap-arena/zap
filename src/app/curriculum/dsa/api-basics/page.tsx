"use client"
import { AuthGuard } from "@/components/AuthGuard"
import ApiBasicsGuidePage from "@/views/guide/ApiBasicsGuidePage"
export default function Page() {
  return <AuthGuard><ApiBasicsGuidePage /></AuthGuard>
}
