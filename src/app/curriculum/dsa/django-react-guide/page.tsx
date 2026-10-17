"use client"
import { AuthGuard } from "@/components/AuthGuard"
import DjangoReactGuidePage from "@/views/guide/DjangoReactGuidePage"
export default function Page() {
  return <AuthGuard><DjangoReactGuidePage /></AuthGuard>
}
